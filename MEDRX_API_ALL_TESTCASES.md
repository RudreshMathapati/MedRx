# 🏥 MedRx Web API: Complete Test Case Suite

This document lists **all** backend API endpoints for the MedRx platform, categorized by system modules. It describes the endpoints, methods, headers, query parameters, payloads, and authorization requirements for end-to-end testing in Postman.

---

## 🔑 Authentication Roles
Several endpoints require specific user roles. Ensure your login JWT (`Bearer {{medrx_token}}`) corresponds to the correct role for testing:
* **Super Admin (`super_admin`)**: Manages hospital creations, global statistics, hospital approval requests.
* **Hospital Admin (`hospital_admin`)**: Manages doctors, receptionists, hospital configurations, Twilio credentials.
* **Doctor (`doctor`)**: Prescribes medications, views patient profiles.
* **Receptionist (`receptionist`)**: Registers new patients, adds patients to the queue.

---

## 📋 Table of Contents
1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Doctor Requests Endpoints](#2-doctor-requests-endpoints)
3. [Hospital Requests Endpoints](#3-hospital-requests-endpoints)
4. [Hospitals Endpoints](#4-hospitals-endpoints)
5. [Patients Endpoints](#5-patients-endpoints)
6. [Prescriptions Endpoints](#6-prescriptions-endpoints)
7. [Super Admin Operations](#7-super-admin-operations)
8. [User Operations (Hospital Admins)](#8-user-operations-hospital-admins)
9. [Doctor Actions](#9-doctor-actions)
10. [Notifications Endpoints](#10-notifications-endpoints)
11. [Sentinel Webhook Receiver](#11-sentinel-webhook-receiver)

---

## 1. Authentication Endpoints

### TC 1.1: User Login (`POST /api/auth/login`)
* **Goal**: Authenticate doctor, receptionist, hospital admin, or super admin with optional behavioral telemetry for security evaluation.
* **URL**: `{{medrx_url}}/api/auth/login`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "email": "doctor@medrx.com",
  "password": "doctorpassword123",
  "sentinelTelemetry": {
    "session_id": "sess_auth_login",
    "behavioral": { "typing_speed": 65, "mouse_velocity": 140 }
  }
}
```
* **Expected Response (200 OK)**:
```json
{
  "token": "JWT_STRING_HERE",
  "role": "doctor",
  "userId": "USER_ID_HERE",
  "hospitalId": "HOSPITAL_ID_HERE",
  "user": {
    "name": "Doctor Name",
    "email": "doctor@medrx.com",
    "hospitalName": "City Hospital"
  }
}
```

---

## 2. Doctor Requests Endpoints

### TC 2.1: Register Doctor Request (`POST /api/doctor-requests/register`)
* **Goal**: Submit a doctor application to join a hospital. Must upload a signature image.
* **URL**: `{{medrx_url}}/api/doctor-requests/register`
* **Headers**:
  * `Content-Type`: `multipart/form-data`
* **Body (form-data)**:
  * `name`: `Dr. John Doe`
  * `email`: `drjohndoe@gmail.com`
  * `password`: `DrJohn@123`
  * `phone`: `+919876543210`
  * `specialization`: `Cardiologist`
  * `hospitalId`: `{{hospital_id}}`
  * `signature`: *(File upload: signature PNG/JPG)*
  * `sentinelTelemetry`: `{"session_id": "sess_doc_reg", "behavioral": {"typing_speed": 70}}`
* **Expected Response (201 Created)**: `"Doctor registration request submitted successfully."`

### TC 2.2: Get Hospital Doctor Requests (`GET /api/doctor-requests/hospital`)
* **Goal**: Hospital admin retrieves pending doctor requests for their hospital.
* **URL**: `{{medrx_url}}/api/doctor-requests/hospital`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: Array of pending doctor request objects.

### TC 2.3: Approve Doctor Request (`PUT /api/doctor-requests/hospital-approve/:id`)
* **Goal**: Hospital admin approves a doctor's pending request.
* **URL**: `{{medrx_url}}/api/doctor-requests/hospital-approve/{{request_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: `"Doctor request approved and user created."`

### TC 2.4: Reject Doctor Request (`DELETE /api/doctor-requests/hospital-reject/:id`)
* **Goal**: Hospital admin rejects and deletes a doctor's request.
* **URL**: `{{medrx_url}}/api/doctor-requests/hospital-reject/{{request_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: `"Doctor request rejected and deleted."`

### TC 2.5: Get All Doctor Requests (`GET /api/doctor-requests/all`)
* **Goal**: Super admin retrieves doctor requests across all hospitals.
* **URL**: `{{medrx_url}}/api/doctor-requests/all`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: Array of all doctor request objects.

---

## 3. Hospital Requests Endpoints

### TC 3.1: Create Hospital Request (`POST /api/hospital-requests/`)
* **Goal**: Public request to register a new hospital.
* **URL**: `{{medrx_url}}/api/hospital-requests/`
* **Headers**:
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "name": "St. Marys Clinic",
  "address": "456 Oak Avenue",
  "contactNumber": "+12223334444",
  "adminEmail": "stmarysadmin@gmail.com",
  "adminName": "Mary Smith"
}
```
* **Expected Response (201 Created)**: `"Hospital registration request submitted successfully."`

### TC 3.2: Get Pending Hospital Requests (`GET /api/hospital-requests/`)
* **Goal**: Super Admin retrieves pending hospital registration requests.
* **URL**: `{{medrx_url}}/api/hospital-requests/`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: Array of pending hospital requests.

### TC 3.3: Approve Hospital Request (`PUT /api/hospital-requests/:id/approve`)
* **Goal**: Super Admin approves hospital request, creating the hospital & Admin user accounts.
* **URL**: `{{medrx_url}}/api/hospital-requests/{{request_id}}/approve`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: `"Hospital approved and admin registered successfully."`

### TC 3.4: Reject Hospital Request (`PUT /api/hospital-requests/:id/reject`)
* **Goal**: Super Admin rejects hospital request.
* **URL**: `{{medrx_url}}/api/hospital-requests/{{request_id}}/reject`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: `"Hospital request rejected."`

---

## 4. Hospitals Endpoints

### TC 4.1: Upload Hospital Template (`POST /api/hospitals/upload-template`)
* **Goal**: Hospital admin uploads custom letterhead/Rx template file.
* **URL**: `{{medrx_url}}/api/hospitals/upload-template`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
  * `Content-Type`: `multipart/form-data`
* **Body (form-data)**:
  * `template`: *(File upload: PDF template)*
* **Expected Response (200 OK)**: `{ "message": "Template uploaded successfully", "templateUrl": "..." }`

### TC 4.2: Create Hospital Directly (`POST /api/hospitals/create`)
* **Goal**: Super admin creates hospital directly without requests.
* **URL**: `{{medrx_url}}/api/hospitals/create`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "name": "General Wellness Hospital",
  "address": "789 Pine Road",
  "contactNumber": "+17778889999"
}
```
* **Expected Response (201 Created)**: Created hospital object details.

### TC 4.3: Get All Active Hospitals (`GET /api/hospitals/all`)
* **Goal**: Super admin lists active hospitals.
* **URL**: `{{medrx_url}}/api/hospitals/all`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: Array of all active hospitals.

### TC 4.4: Get Current Admin's Hospital (`GET /api/hospitals/my-hospital`)
* **Goal**: Hospital admin fetches details of their own hospital.
* **URL**: `{{medrx_url}}/api/hospitals/my-hospital`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: Hospital object configuration.

### TC 4.5: Update Twilio Settings (`PUT /api/hospitals/twilio-settings`)
* **Goal**: Hospital admin configures SMS integration details.
* **URL**: `{{medrx_url}}/api/hospitals/twilio-settings`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "twilioSid": "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "twilioAuthToken": "your_auth_token_here",
  "twilioNumber": "+15556667777"
}
```
* **Expected Response (200 OK)**: Twilio configuration save confirmation.

---

## 5. Patients Endpoints

### TC 5.1: Add Patient (`POST /api/patients/add`)
* **Goal**: Register and queue a patient for a doctor.
* **URL**: `{{medrx_url}}/api/patients/add`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "name": "Alice Johnson",
  "age": 28,
  "gender": "Female",
  "phone": "+918888888888",
  "symptoms": "Mild fever and cough",
  "bp": "120/80",
  "temp": "99.1",
  "pulse": "76",
  "spo2": "98",
  "doctorId": "65b90f488f284e3c54a991aa"
}
```
* **Expected Response (201 Created)**: Created patient object with status set to `"pending"`.

### TC 5.2: Get Doctor's Patients (`GET /api/patients/doctor`)
* **Goal**: Doctor retrieves their assigned list of patients.
* **URL**: `{{medrx_url}}/api/patients/doctor`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Doctor)
* **Expected Response (200 OK)**: Array of patient objects assigned to the doctor.

### TC 5.3: Get Receptionist's Patients (`GET /api/patients/receptionist`)
* **Goal**: Receptionist retrieves patients queued for the day.
* **URL**: `{{medrx_url}}/api/patients/receptionist`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Receptionist)
* **Expected Response (200 OK)**: Array of patients registered by receptionist.

### TC 5.4: Complete Patient Appointment (`PUT /api/patients/complete/:id`)
* **Goal**: Update patient visit status to complete.
* **URL**: `{{medrx_url}}/api/patients/complete/{{patient_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
* **Expected Response (200 OK)**: Patient object with status set to `"completed"`.

### TC 5.5: Get Single Patient Details (`GET /api/patients/:id`)
* **Goal**: Retrieve details for a specific patient.
* **URL**: `{{medrx_url}}/api/patients/{{patient_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
* **Expected Response (200 OK)**: Detailed patient object.

---

## 6. Prescriptions Endpoints

### TC 6.1: Create Prescription (`POST /api/prescriptions/create`)
* **Goal**: Create and save a new prescription. Generates a PDF Rx under the hood.
* **URL**: `{{medrx_url}}/api/prescriptions/create`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Doctor)
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "patientId": "65b90f488f284e3c54a991f2",
  "medicines": [
    { "name": "Paracetamol", "dosage": "650mg", "frequency": "Twice daily", "duration": "3 days" }
  ],
  "diagnosis": "Viral Infection",
  "advice": "Drink plenty of warm fluids."
}
```
* **Expected Response (201 Created)**: Created prescription object, including the generated PDF letterhead URL.

### TC 6.2: Get Prescriptions by Patient (`GET /api/prescriptions/patient/:patientId`)
* **Goal**: Retrieve prescription records for a specific patient.
* **URL**: `{{medrx_url}}/api/prescriptions/patient/{{patient_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
* **Expected Response (200 OK)**: Array of prescription documents for the patient.

---

## 7. Super Admin Operations

### TC 7.1: Get Global System Stats (`GET /api/superadmin/stats`)
* **Goal**: Fetch overall numbers of active hospitals, doctors, patients, and prescriptions.
* **URL**: `{{medrx_url}}/api/superadmin/stats`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: `{ "hospitals": N, "doctors": N, "patients": N, "prescriptions": N }`

### TC 7.2: List Active Hospitals (`GET /api/superadmin/hospitals`)
* **Goal**: Super admin retrieves all hospitals currently active on the platform.
* **URL**: `{{medrx_url}}/api/superadmin/hospitals`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: Array of active hospital objects.

### TC 7.3: Restore Archived Hospital (`PUT /api/superadmin/restore-hospital/:hospitalId`)
* **Goal**: Restore an archived/deleted hospital back to active status.
* **URL**: `{{medrx_url}}/api/superadmin/restore-hospital/{{hospital_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: `{ "message": "Hospital restored successfully", "hospital": {...} }`

### TC 7.4: Get Archived Hospitals (`GET /api/superadmin/archived-hospitals`)
* **Goal**: View deleted/archived hospital list.
* **URL**: `{{medrx_url}}/api/superadmin/archived-hospitals`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: Array of archived hospital objects.

### TC 7.5: Archive Hospital (`DELETE /api/superadmin/hospital/:hospitalId`)
* **Goal**: Delete (archive) a hospital.
* **URL**: `{{medrx_url}}/api/superadmin/hospital/{{hospital_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Super Admin)
* **Expected Response (200 OK)**: `{ "message": "Hospital archived successfully", "hospital": {...} }`

---

## 8. User Operations (Hospital Admins)

### TC 8.1: Create Receptionist (`POST /api/users/receptionist`)
* **Goal**: Hospital admin creates a new receptionist user for their hospital.
* **URL**: `{{medrx_url}}/api/users/receptionist`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "name": "Jane Doe",
  "email": "janedoe@reception.com",
  "password": "JanePassword123",
  "phone": "+917777777777"
}
```
* **Expected Response (201 Created)**: Created receptionist object.

### TC 8.2: Get Receptionists (`GET /api/users/receptionists`)
* **Goal**: Hospital admin fetches receptionists at their hospital.
* **URL**: `{{medrx_url}}/api/users/receptionists`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: Array of receptionist users.

### TC 8.3: Get Doctors (`GET /api/users/doctors`)
* **Goal**: Hospital admin retrieves registered doctors for their hospital.
* **URL**: `{{medrx_url}}/api/users/doctors`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: Array of doctor users.

### TC 8.4: Get Doctors by Hospital (`GET /api/users/doctors-by-hospital`)
* **Goal**: Retrieve active doctors at a hospital (used dynamically during patient registration queues).
* **URL**: `{{medrx_url}}/api/users/doctors-by-hospital?hospitalId={{hospital_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
* **Expected Response (200 OK)**: List of active doctors linked to the specified hospital.

### TC 8.5: Block User (`PUT /api/users/block/:id`)
* **Goal**: Hospital admin blocks/unblocks a user.
* **URL**: `{{medrx_url}}/api/users/block/{{user_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "isBlocked": true
}
```
* **Expected Response (200 OK)**: `{ "message": "User blocked successfully", "user": {...} }`

### TC 8.6: Delete User (`DELETE /api/users/:id`)
* **Goal**: Delete receptionist or doctor.
* **URL**: `{{medrx_url}}/api/users/{{user_id}}`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Hospital Admin)
* **Expected Response (200 OK)**: `{ "message": "User deleted successfully" }`

---

## 9. Doctor Actions

### TC 9.1: Fetch Doctor Dashboard Stats (`GET /api/doctor/dashboard`)
* **Goal**: Load daily clinic stats (Today's patients count, pending vs completed appointments, total prescriptions written).
* **URL**: `{{medrx_url}}/api/doctor/dashboard`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}` (Doctor)
* **Expected Response (200 OK)**:
```json
{
  "stats": {
    "todayPatients": 3,
    "pendingPatients": 1,
    "completedPatients": 2,
    "prescriptions": 8
  },
  "patients": [...]
}
```

---

## 10. Notifications Endpoints

### TC 10.1: Send Prescription Notification (`POST /api/notifications/send-rx`)
* **Goal**: Fire SMS or WhatsApp alerts via Twilio containing Rx download links to patients.
* **URL**: `{{medrx_url}}/api/notifications/send-rx`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "prescriptionId": "65b90f488f284e3c54a991f9",
  "patientPhone": "+918888888888"
}
```
* **Expected Response (200 OK)**: `{ "message": "Prescription notification sent successfully!" }`

---

## 11. Sentinel Webhook Receiver

### TC 11.1: Sentinel Webhook (`POST /webhooks/sentinel`)
* **Goal**: Endpoint for Sentinel threat signals. Computes and checks signature verification.
* **URL**: `{{medrx_url}}/webhooks/sentinel`
* **Headers**:
  * `Content-Type`: `application/json`
  * `x-sentinel-signature`: `sha256={{computed_signature}}`
* **Body (JSON)**:
```json
{
  "event": "RISK_ALERT",
  "alert_id": "83cf720b-0447-4f6c-850d-85473cf29e01",
  "session_id": "sess_anomaly_bot",
  "user_id": "doctor@medrx.com",
  "risk_score": 75,
  "risk_level": "HIGH",
  "recommended_action": "block",
  "anomalies_detected": ["high_typing_speed", "zero_mouse_movement"],
  "triggered_at": "2026-06-22T17:30:00Z"
}
```
* **Expected Response (200 OK)**: `OK`
