package com.example.beacon;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.telephony.SmsManager;
import android.view.KeyEvent;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    // UI
    TextView tvContacts;
    Button btnEmergency, btnMic, btnAddContact;

    // Firebase & Location
    FirebaseFirestore db;
    FusedLocationProviderClient fusedLocationClient;

    // Permissions
    private static final int LOCATION_PERMISSION_REQUEST = 101;
    private static final int SMS_PERMISSION_REQUEST = 102;
    private static final int VOICE_REQUEST = 200;

    // Volume button logic
    int volumePressCount = 0;
    long lastPressTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // UI init
        tvContacts = findViewById(R.id.tvContacts);
        btnEmergency = findViewById(R.id.btnEmergency);
        btnMic = findViewById(R.id.btnMic);
        btnAddContact = findViewById(R.id.btnAddContact);

        // Firebase & location
        db = FirebaseFirestore.getInstance();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        // Permissions
        requestPermissions();

        // Load contacts
        loadTrustedContacts();

        // Click listeners
        btnEmergency.setOnClickListener(v -> triggerEmergency());
        btnMic.setOnClickListener(v -> startVoiceInput());
        btnAddContact.setOnClickListener(v ->
                startActivity(new Intent(this, AddContactActivity.class))
        );
    }

    // 🔊 Volume Up ×3 trigger
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            long now = System.currentTimeMillis();
            if (now - lastPressTime > 2000) {
                volumePressCount = 0;
            }
            volumePressCount++;
            lastPressTime = now;

            if (volumePressCount == 3) {
                triggerEmergency();
                volumePressCount = 0;
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    // 🎤 Voice keyword
    private void startVoiceInput() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
        );
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak emergency keyword");

        try {
            startActivityForResult(intent, VOICE_REQUEST);
        } catch (Exception e) {
            Toast.makeText(this, "Voice input not supported", Toast.LENGTH_SHORT).show();
        }
    }

    // 🎧 Handle spoken keyword
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == VOICE_REQUEST && resultCode == RESULT_OK && data != null) {
            ArrayList<String> result =
                    data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);

            if (result != null && !result.isEmpty()) {
                String spoken = result.get(0).toLowerCase();

                if (spoken.contains("help me blue")) {
                    Toast.makeText(this, "Keyword detected!", Toast.LENGTH_SHORT).show();
                    triggerEmergency();
                } else {
                    Toast.makeText(this, "Keyword not matched", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }

    // 🚨 Emergency logic
    private void triggerEmergency() {

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Location permission missing", Toast.LENGTH_SHORT).show();
            return;
        }

        fusedLocationClient.getLastLocation().addOnSuccessListener(location -> {

            Map<String, Object> alert = new HashMap<>();
            alert.put("status", "EMERGENCY_TRIGGERED");
            alert.put("time", System.currentTimeMillis());

            String message = "🚨 EMERGENCY ALERT!\n";

            if (location != null) {
                double lat = location.getLatitude();
                double lng = location.getLongitude();
                String mapLink = "https://maps.google.com/?q=" + lat + "," + lng;

                alert.put("latitude", lat);
                alert.put("longitude", lng);
                alert.put("maps_link", mapLink);

                message += "Location: " + mapLink;
            }

            final String finalMessage = message;

            db.collection("emergency_events")
                    .add(alert)
                    .addOnSuccessListener(doc -> {
                        Toast.makeText(this, "Emergency sent!", Toast.LENGTH_SHORT).show();
                        sendSmsToTrustedContacts(finalMessage);
                    });
        });
    }

    // 📩 Send SMS
    private void sendSmsToTrustedContacts(String message) {

        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.SEND_SMS
        ) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.SEND_SMS},
                    SMS_PERMISSION_REQUEST
            );
            return;
        }

        db.collection("trusted_contacts")
                .get()
                .addOnSuccessListener(query -> {
                    SmsManager smsManager = SmsManager.getDefault();

                    for (DocumentSnapshot doc : query) {
                        String phone = doc.getString("phone");
                        if (phone != null && phone.length() >= 10) {
                            smsManager.sendTextMessage(
                                    phone,
                                    null,
                                    message,
                                    null,
                                    null
                            );
                        }
                    }
                });
    }

    // 📇 Load contacts
    private void loadTrustedContacts() {
        db.collection("trusted_contacts")
                .get()
                .addOnSuccessListener(query -> {
                    StringBuilder sb = new StringBuilder();
                    for (DocumentSnapshot doc : query) {
                        sb.append("👤 ")
                                .append(doc.getString("name"))
                                .append(" : ")
                                .append(doc.getString("phone"))
                                .append("\n\n");
                    }
                    tvContacts.setText(sb.toString());
                });
    }

    // 🔐 Permissions
    private void requestPermissions() {
        ActivityCompat.requestPermissions(
                this,
                new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.SEND_SMS,
                        Manifest.permission.RECORD_AUDIO
                },
                LOCATION_PERMISSION_REQUEST
        );
    }
}
