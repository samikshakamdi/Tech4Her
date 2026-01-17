package com.example.beacon;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private static final int LOCATION_REQUEST_CODE = 101;

    Button emergencyBtn;
    FusedLocationProviderClient fusedLocationClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        emergencyBtn = findViewById(R.id.btnEmergency);
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        // 🔴 Emergency button trigger
        emergencyBtn.setOnClickListener(v -> checkLocationPermission());
    }

    // 1️⃣ Permission check
    private void checkLocationPermission() {

        boolean fineGranted = ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED;

        boolean coarseGranted = ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED;

        if (!fineGranted && !coarseGranted) {
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    LOCATION_REQUEST_CODE
            );
        } else {
            getLocationAndSendEmergency();
        }
    }

    // 2️⃣ Get location (safe)
    @SuppressLint("MissingPermission")
    private void getLocationAndSendEmergency() {

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
        ) != PackageManager.PERMISSION_GRANTED) {

            Toast.makeText(this,
                    "Location permission not granted",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(location -> {

                    // 🔥 BUTTON TRIGGER
                    sendEmergencyToFirebase(
                            "button",
                            "SOS Button",
                            location
                    );
                });
    }

    // 3️⃣ FINAL Firebase write (STRUCTURED DATA)
    private void sendEmergencyToFirebase(
            String triggerType,
            String message,
            Location location
    ) {

        DatabaseReference emergencyRef =
                FirebaseDatabase.getInstance()
                        .getReference("emergencies");

        String id = emergencyRef.push().getKey();

        if (id == null) {
            Toast.makeText(this,
                    "Error generating emergency ID",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        Map<String, Object> data = new HashMap<>();
        data.put("trigger", triggerType);      // button / volume
        data.put("message", message);          // readable text
        data.put("time", System.currentTimeMillis());

        // 📍 Location optional
        if (location != null) {
            data.put("latitude", location.getLatitude());
            data.put("longitude", location.getLongitude());
        } else {
            data.put("latitude", null);
            data.put("longitude", null);
        }

        emergencyRef.child(id).setValue(data)
                .addOnSuccessListener(aVoid ->
                        Toast.makeText(
                                this,
                                "Emergency stored",
                                Toast.LENGTH_SHORT
                        ).show())
                .addOnFailureListener(e ->
                        Toast.makeText(
                                this,
                                "Failed: " + e.getMessage(),
                                Toast.LENGTH_LONG
                        ).show());
    }

    // 4️⃣ Permission result
    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            @NonNull String[] permissions,
            @NonNull int[] grantResults) {

        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == LOCATION_REQUEST_CODE) {

            boolean granted = false;
            for (int result : grantResults) {
                if (result == PackageManager.PERMISSION_GRANTED) {
                    granted = true;
                    break;
                }
            }

            if (granted) {
                getLocationAndSendEmergency();
            } else {
                Toast.makeText(
                        this,
                        "Location permission denied",
                        Toast.LENGTH_SHORT
                ).show();
            }
        }
    }

    // 🔊 FUTURE USE (Volume Button)
    private void sendVolumeEmergency() {
        sendEmergencyToFirebase(
                "volume",
                "Triggered via Volume Button",
                null
        );
    }
}
