package com.example.beacon;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.speech.RecognizerIntent;
import android.telephony.SmsManager;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.firestore.*;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    ListView listContacts;
    Button btnEmergency, btnMic, btnAddContact, btnSaveKeyword;
    EditText etKeyword;

    SharedPreferences prefs;
    FirebaseFirestore db;
    FusedLocationProviderClient fusedLocationClient;

    static final int PERMISSION_REQUEST = 101;
    static final int VOICE_REQUEST = 200;

    int volumePressCount = 0;
    long lastPressTime = 0;

    CountDownTimer emergencyTimer;
    boolean isCountdownRunning = false;
    boolean isEmergencyCancelled = false;

    ArrayList<String> contactNames = new ArrayList<>();
    ArrayList<String> contactIds = new ArrayList<>();

    ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 🔗 Bind views
        listContacts = findViewById(R.id.listContacts);
        btnEmergency = findViewById(R.id.btnEmergency);
        btnMic = findViewById(R.id.btnMic);
        btnAddContact = findViewById(R.id.btnAddContact);
        btnSaveKeyword = findViewById(R.id.btnSaveKeyword);
        etKeyword = findViewById(R.id.etKeyword);

        prefs = getSharedPreferences("BeaconPrefs", MODE_PRIVATE);
        db = FirebaseFirestore.getInstance();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        etKeyword.setText(prefs.getString("keyword", "help"));

        // ✅ Custom adapter with BLACK text
        adapter = new ArrayAdapter<String>(
                this,
                android.R.layout.simple_list_item_1,
                contactNames
        ) {
            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                View view = super.getView(position, convertView, parent);
                TextView tv = view.findViewById(android.R.id.text1);
                tv.setTextColor(Color.BLACK);
                tv.setTextSize(16);
                return view;
            }
        };

        listContacts.setAdapter(adapter);

        requestPermissions();
        loadTrustedContacts();

        btnEmergency.setOnClickListener(v -> startEmergencyFlow());
        btnMic.setOnClickListener(v -> startVoiceInput());
        btnSaveKeyword.setOnClickListener(v -> saveKeyword());
        btnAddContact.setOnClickListener(
                v -> startActivity(new Intent(this, AddContactActivity.class))
        );

        // 🗑️ Delete single contact (LONG PRESS)
        listContacts.setOnItemLongClickListener((p, v, pos, id) -> {
            new AlertDialog.Builder(this)
                    .setTitle("Delete Contact")
                    .setMessage("Delete " + contactNames.get(pos) + "?")
                    .setPositiveButton("DELETE", (d, w) ->
                            db.collection("trusted_contacts")
                                    .document(contactIds.get(pos))
                                    .delete()
                                    .addOnSuccessListener(x -> loadTrustedContacts())
                    )
                    .setNegativeButton("CANCEL", null)
                    .show();
            return true;
        });
    }

    // 🔊 Volume Up ×3 trigger
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            long now = System.currentTimeMillis();
            if (now - lastPressTime > 2000) volumePressCount = 0;
            volumePressCount++;
            lastPressTime = now;

            if (volumePressCount == 3) {
                volumePressCount = 0;
                startEmergencyFlow();
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    // 🎤 Voice input
    private void startVoiceInput() {
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        startActivityForResult(i, VOICE_REQUEST);
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == VOICE_REQUEST && result == RESULT_OK && data != null) {
            ArrayList<String> res =
                    data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            if (res != null && !res.isEmpty()) {
                if (res.get(0).toLowerCase()
                        .contains(prefs.getString("keyword", "help").toLowerCase())) {
                    startEmergencyFlow();
                }
            }
        }
    }

    // 🚨 Emergency countdown
    private void startEmergencyFlow() {
        if (isCountdownRunning) return;

        isCountdownRunning = true;
        isEmergencyCancelled = false;

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Emergency Alert")
                .setMessage("Sending alert in 5 seconds...")
                .setCancelable(false)
                .setNegativeButton("CANCEL", (d, w) -> {
                    isEmergencyCancelled = true;
                    isCountdownRunning = false;
                    if (emergencyTimer != null) emergencyTimer.cancel();
                })
                .create();

        dialog.show();

        emergencyTimer = new CountDownTimer(5000, 1000) {
            public void onTick(long ms) {
                dialog.setMessage("Sending alert in " + (ms / 1000) + " seconds...");
            }

            public void onFinish() {
                dialog.dismiss();
                isCountdownRunning = false;
                if (!isEmergencyCancelled) triggerEmergency();
            }
        }.start();
    }

    // 🚨 Send SMS
    private void triggerEmergency() {
        if (ContextCompat.checkSelfPermission(
                this, Manifest.permission.SEND_SMS)
                != PackageManager.PERMISSION_GRANTED) return;

        fusedLocationClient.getLastLocation().addOnSuccessListener(loc -> {
            String msg = "🚨 EMERGENCY ALERT!\n";
            if (loc != null) {
                msg += "Location: https://maps.google.com/?q="
                        + loc.getLatitude() + "," + loc.getLongitude();
            }
            sendSmsToTrustedContacts(msg);
        });
    }

    private void sendSmsToTrustedContacts(String msg) {
        db.collection("trusted_contacts").get().addOnSuccessListener(q -> {
            SmsManager sms = SmsManager.getDefault();
            for (DocumentSnapshot d : q) {
                String phone = d.getString("phone");
                if (phone != null && phone.length() >= 10) {
                    sms.sendMultipartTextMessage(
                            phone, null,
                            sms.divideMessage(msg),
                            null, null
                    );
                }
            }
        });
    }

    // 📇 Load contacts + FIX space issue
    private void loadTrustedContacts() {
        db.collection("trusted_contacts").get().addOnSuccessListener(q -> {
            contactNames.clear();
            contactIds.clear();

            for (DocumentSnapshot d : q) {
                contactIds.add(d.getId());
                contactNames.add("👤 " + d.getString("name")
                        + " : " + d.getString("phone"));
            }

            adapter.notifyDataSetChanged();
            adjustListViewHeight();
        });
    }

    // ✅ Fix ListView extra space
    private void adjustListViewHeight() {
        ViewGroup.LayoutParams params = listContacts.getLayoutParams();

        if (adapter.getCount() == 0) {
            params.height = 0;
        } else {
            int totalHeight = 0;
            for (int i = 0; i < adapter.getCount(); i++) {
                View item = adapter.getView(i, null, listContacts);
                item.measure(0, 0);
                totalHeight += item.getMeasuredHeight();
            }
            params.height = totalHeight +
                    (listContacts.getDividerHeight()
                            * (adapter.getCount() - 1));
        }

        listContacts.setLayoutParams(params);
        listContacts.requestLayout();
    }

    private void saveKeyword() {
        prefs.edit()
                .putString("keyword",
                        etKeyword.getText().toString().trim())
                .apply();
    }

    private void requestPermissions() {
        ActivityCompat.requestPermissions(
                this,
                new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.SEND_SMS,
                        Manifest.permission.RECORD_AUDIO
                },
                PERMISSION_REQUEST
        );
    }
}
