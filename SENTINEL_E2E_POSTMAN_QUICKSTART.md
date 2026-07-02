# ⚡ Sentinel & MedRx: Postman Quickstart Testing Guide

This is a simplified, straight-to-the-point guide to testing your Sentinel integration in Postman. 

---

## 🛠️ Step 1: Copy-Paste the Postman Environment
In Postman, create a new **Environment** and add these variables. Fill in the values:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `sentinel_url` | `https://sentinel-layer-general.onrender.com` | Sentinel API URL |
| `medrx_url` | `http://localhost:5000` | Local MedRx backend URL |
| `api_key` | `229ab87fd0904f6dab62a283231fa7a1ccc3a8fa28f443278a16f926c5183868` | Use either Key 1 or Key 2 |
| `medrx_token` | *(Keep empty; login will fill this)* | MedRx access token |
| `webhook_secret` | `qwertyuiopasdfghjkl` | Webhook verification secret |

---

## 📋 List of all Test Cases

### 🛡️ Part A: Direct Sentinel API Tests (Is Sentinel Working?)

#### 1. Sentinel Health Check
* **Goal**: Check if Sentinel database and Redis cache are working.
* **Method**: `GET`
* **URL**: `{{sentinel_url}}/health`
* **Headers**: None
* **Expected Result**: `200 OK` with database and redis showing `"ok"`.

#### 2. Normal Telemetry Evaluation (LOW Risk)
* **Goal**: Test standard user behavior scoring.
* **Method**: `POST`
* **URL**: `{{sentinel_url}}/evaluate`
* **Headers**:
  * `X-Sentinel-Key`: `{{api_key}}`
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "user_id": "test_user_001",
  "session_id": "session_001",
  "action": { "type": "page_view" },
  "network": { "ip_address": "12.166.45.102" },
  "behavioral": {
    "typing_speed": 65,
    "mouse_velocity": 140,
    "time_on_page": 25
  }
}
```
* **Expected Result**: `200 OK` with `risk.level` as `"LOW"`, and `recommended_action` as `"allow"`.

#### 3. Bot Telemetry Evaluation (HIGH Risk / Block)
* **Goal**: Test behavior showing a automated bot.
* **Method**: `POST`
* **URL**: `{{sentinel_url}}/evaluate`
* **Headers**:
  * `X-Sentinel-Key`: `{{api_key}}`
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "user_id": "test_user_001",
  "session_id": "session_bot_001",
  "action": { "type": "login" },
  "network": { "ip_address": "103.45.162.18" },
  "behavioral": {
    "typing_speed": 950,
    "mouse_velocity": 0,
    "time_on_page": 1
  }
}
```
* **Expected Result**: `200 OK` with `risk.score` above 50, and `recommended_action` as `"block"`.

#### 4. Invalid API Key Protection
* **Goal**: Test Sentinel blocking bad API keys.
* **Method**: `POST`
* **URL**: `{{sentinel_url}}/evaluate`
* **Headers**:
  * `X-Sentinel-Key`: `bad_api_key_here`
  * `Content-Type`: `application/json`
* **Body (JSON)**: Same as Test Case 2.
* **Expected Result**: `401 Unauthorized`.

---

### 🏥 Part B: MedRx Website Integration Tests (Is MedRx Integration Working?)

#### 5. MedRx Normal Login (Bypass/Legitimate)
* **Goal**: Check if legitimate users can login successfully.
* **Method**: `POST`
* **URL**: `{{medrx_url}}/api/auth/login`
* **Body (JSON)**:
```json
{
  "email": "doctor@medrx.com",
  "password": "doctorpassword123",
  "sentinelTelemetry": {
    "session_id": "sess_login_001",
    "behavioral": { "typing_speed": 60, "mouse_velocity": 120 }
  }
}
```
* **Expected Result**: `200 OK` with `token`. Copy this token value and paste it into the `medrx_token` Postman environment variable.

#### 6. MedRx Bot Login Block
* **Goal**: Verify MedRx blocks a login when Sentinel signals a Bot threat.
* **Method**: `POST`
* **URL**: `{{medrx_url}}/api/auth/login`
* **Body (JSON)**:
```json
{
  "email": "doctor@medrx.com",
  "password": "doctorpassword123",
  "sentinelTelemetry": {
    "session_id": "sess_login_bot",
    "behavioral": { "typing_speed": 999, "mouse_velocity": 0 }
  }
}
```
* **Expected Result**: `403 Forbidden` with:
```json
{
  "sentinelVerdict": "BLOCK",
  "message": "Login blocked by security policy."
}
```

#### 7. MedRx Sentinel-Guarded Action (Legitimate)
* **Goal**: Verify a Doctor can perform sensitive actions when behavior is safe.
* **Method**: `POST`
* **URL**: `{{medrx_url}}/api/prescriptions`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
  * `Content-Type`: `application/json`
* **Body (JSON)**:
```json
{
  "patientId": "65b90f488f284e3c54a991f2",
  "medicines": [
    { "name": "Amoxicillin", "dosage": "500mg", "frequency": "Thrice a day", "duration": "5 days" }
  ],
  "sentinelTelemetry": {
    "session_id": "sess_action_001",
    "behavioral": { "typing_speed": 55, "mouse_velocity": 130 }
  }
}
```
* **Expected Result**: `200 OK` (or `201 Created`) along with prescription details.

#### 8. OTP Verification Bypass Check
* **Goal**: Test bypassing evaluation during testing or after user completes OTP.
* **Method**: `POST`
* **URL**: `{{medrx_url}}/api/prescriptions`
* **Headers**:
  * `Authorization`: `Bearer {{medrx_token}}`
  * `Content-Type`: `application/json`
  * `x-sentinel-otp-verified`: `true`
* **Body (JSON)**: Same as Test Case 7, but send empty/bot `sentinelTelemetry` details.
* **Expected Result**: `200 OK` (Bypasses verification entirely).

#### 9. MedRx Webhook Security Check (Signature Valid)
* **Goal**: Confirm MedRx correctly processes threat events pushed from Sentinel.
* **Method**: `POST`
* **URL**: `{{medrx_url}}/webhooks/sentinel`
* **Headers**:
  * `Content-Type`: `application/json`
  * *(The dynamic `x-sentinel-signature` header will be generated by the script in Step 2)*
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
* **Expected Result**: `200 OK` with text `"OK"`.

---

## ⚡ Step 2: Auto-Sign Webhooks in Postman (For Test Case 9)
To make Test Case 9 work without manual calculations:
1. Open your Webhook request in Postman.
2. Navigate to the **Pre-request Script** tab.
3. Paste the following snippet:
```javascript
const secret = pm.environment.get("webhook_secret") || "qwertyuiopasdfghjkl";
const body = pm.request.body.toString();
const hash = CryptoJS.HmacSHA256(body, secret).toString(CryptoJS.enc.Hex);

pm.request.headers.add({
    key: "x-sentinel-signature",
    value: "sha256=" + hash
});
```
4. Click **Send**. Postman will automatically calculate and append the signature!
