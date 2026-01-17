package com.example.beacon;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.telephony.SmsManager;
import android.view.KeyEvent;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
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

    TextView tvContacts;
    Button btnEmergency, btnMic, btnAddContact, btnSaveKeyword;
    EditText etKeyword;

    SharedPreferences prefs;
    FirebaseFirestore db;
    FusedLocationProviderClient fusedLocationClient;

    private static final int PERMISSION_REQUEST = 101;
    private static final int VOICE_REQUEST = 200;

    int volumePressCount = 0;
    long lastPressTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvContacts = findViewById(R.id.tvContacts);
        btnEmergency = findViewById(R.id.btnEmergency);
        btnMic = findViewById(R.id.btnMic);
        btnAddContact = findViewById(R.id.btnAddContact);
        btnSaveKeyword = findViewById(R.id.btnSaveKeyword);
        etKeyword = findViewById(R.id.etKeyword);

        prefs = getSharedPreferences("BeaconPrefs", MODE_PRIVATE);
        etKeyword.setText(prefs.getString("keyword", "help"));

        db = FirebaseFirestore.getInstance();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        requestPermissions();
        loadTrustedContacts();

        btnEmergency.setOnClickListener(v -> triggerEmergency());

        btnMic.setOnClickListener(v -> startVoiceInput());

        btnSaveKeyword.setOnClickListener(v -> saveKeyword());

        btnAddContact.setOnClickListener(v ->
                startActivity(new Intent(this, AddContactActivity.class)));
    }

    // 🔊 Volume Up ×3 Emergency
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            long now = System.currentTimeMillis();
            if (now - lastPressTime > 2000) volumePressCount = 0;
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

    // 🎤 Voice Input
    private void startVoiceInput() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(
                RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
        );
        startActivityForResult(intent, VOICE_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == VOICE_REQUEST && resultCode == RESULT_OK && data != null) {
            ArrayList<String> result =
                    data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);

            if (result != null && !result.isEmpty()) {
                String spokenText = result.get(0).toLowerCase();
                String keyword = prefs.getString("keyword", "help").toLowerCase();

                if (spokenText.contains(keyword)) {
                    Toast.makeText(this, "Keyword detected!", Toast.LENGTH_SHORT).show();
                    triggerEmergency();
                } else {
                    Toast.makeText(this, "Keyword not matched", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }

    // 🚨 Emergency Logic
    private void triggerEmergency() {
        if (ActivityCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Location permission missing", Toast.LENGTH_SHORT).show();
            return;
        }

        fusedLocationClient.getLastLocation().addOnSuccessListener(location -> {
            String message = "🚨 EMERGENCY ALERT!\n";
            Map<String, Object> alert = new HashMap<>();
            alert.put("time", System.currentTimeMillis());

            if (location != null) {
                String link = "https://maps.google.com/?q=" +
                        location.getLatitude() + "," +
                        location.getLongitude();
                message += "Location: " + link;
                alert.put("location", link);
            }

            String finalMessage = message;

            db.collection("emergency_events")
                    .add(alert)
                    .addOnSuccessListener(doc -> {
                        Toast.makeText(this,
                                "Emergency triggered",
                                Toast.LENGTH_SHORT).show();
                        sendSmsToTrustedContacts(finalMessage);
                    });
        });
    }

    // 📩 Auto SMS
    private void sendSmsToTrustedContacts(String message) {
        if (ContextCompat.checkSelfPermission(
                this, Manifest.permission.SEND_SMS)
                != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this,
                    "SMS permission not granted",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        db.collection("trusted_contacts").get().addOnSuccessListener(query -> {
            SmsManager smsManager = SmsManager.getDefault();
            for (DocumentSnapshot doc : query) {
                String phone = doc.getString("phone");
                if (phone != null && phone.length() >= 10) {
                    ArrayList<String> parts =
                            smsManager.divideMessage(message);
                    smsManager.sendMultipartTextMessage(
                            phone, null, parts, null, null);
                }
            }
            Toast.makeText(this,
                    "SMS sent automatically",
                    Toast.LENGTH_SHORT).show();
        });
    }

    // 📇 Load Contacts
    private void loadTrustedContacts() {
        db.collection("trusted_contacts").get().addOnSuccessListener(query -> {
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

    // 💾 Save Keyword
    private void saveKeyword() {
        String keyword = etKeyword.getText().toString().trim();
        if (keyword.isEmpty()) {
            Toast.makeText(this,
                    "Keyword cannot be empty",
                    Toast.LENGTH_SHORT).show();
            return;
        }
        prefs.edit().putString("keyword", keyword).apply();
        Toast.makeText(this,
                "Keyword saved successfully",
                Toast.LENGTH_SHORT).show();
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
                PERMISSION_REQUEST
        );
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            @NonNull String[] permissions,
            @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
