package com.example.beacon;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class EmergencyService extends Service {

    private int volumePressCount = 0;
    private long lastPressTime = 0;
    private BroadcastReceiver volumeReceiver;

    @Override
    public void onCreate() {
        super.onCreate();
        startForegroundServiceNotification();

        // Register receiver to listen for volume changes
        volumeReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if ("android.media.VOLUME_CHANGED_ACTION".equals(intent.getAction())) {
                    long currentTime = System.currentTimeMillis();

                    // If more than 2 seconds passed since last press, reset count
                    if (currentTime - lastPressTime > 2000) {
                        volumePressCount = 0;
                    }

                    volumePressCount++;
                    lastPressTime = currentTime;

                    if (volumePressCount >= 3) {
                        sendEmergency();
                        volumePressCount = 0;
                    }
                }
            }
        };

        IntentFilter filter = new IntentFilter("android.media.VOLUME_CHANGED_ACTION");
        registerReceiver(volumeReceiver, filter);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (volumeReceiver != null) {
            unregisterReceiver(volumeReceiver);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void startForegroundServiceNotification() {
        String channelId = "emergency_channel";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Emergency Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }

        Notification notification = new NotificationCompat.Builder(this, channelId)
                .setContentTitle("SafeTrigger Active")
                .setContentText("Listening for volume triggers")
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();

        startForeground(1, notification);
    }

    private void sendEmergency() {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        Map<String, Object> alert = new HashMap<>();
        alert.put("status", "EMERGENCY_TRIGGERED");
        alert.put("time", System.currentTimeMillis());

        db.collection("emergency_events").add(alert);

        Toast.makeText(this, "🚨 Emergency Sent!", Toast.LENGTH_SHORT).show();
    }
}