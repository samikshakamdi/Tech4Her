package com.example.beacon;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;
import java.util.Map;

public class AddContactActivity extends AppCompatActivity {

    EditText etName, etPhone;
    Button btnSave;
    FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_contact);

        etName = findViewById(R.id.etName);
        etPhone = findViewById(R.id.etPhone);
        btnSave = findViewById(R.id.btnSave);

        db = FirebaseFirestore.getInstance();

        btnSave.setOnClickListener(v -> saveContact());
    }

    private void saveContact() {
        String name = etName.getText().toString().trim();
        String phone = etPhone.getText().toString().trim();

        if (name.isEmpty() || phone.isEmpty()) {
            Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        Map<String, Object> contact = new HashMap<>();
        contact.put("name", name);
        contact.put("phone", phone);

        db.collection("trusted_contacts")
                .add(contact)
                .addOnSuccessListener(doc -> {
                    Toast.makeText(this, "Contact added", Toast.LENGTH_SHORT).show();
                    finish(); // go back
                })
                .addOnFailureListener(e ->
                        Toast.makeText(this, "Failed to add contact", Toast.LENGTH_SHORT).show()
                );
    }
}