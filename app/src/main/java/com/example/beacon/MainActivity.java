package com.example.beacon;

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    Button btnEmergency;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btnEmergency = findViewById(R.id.btnEmergency);

        btnEmergency.setOnClickListener(v ->
                Toast.makeText(this,
                        "Emergency trigger (logic coming next)",
                        Toast.LENGTH_SHORT).show()
        );
    }
}
