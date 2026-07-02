# Sentinel Layer & MedRx E2E Postman Testing Guide

This guide provides step-by-step instructions to test the end-to-end flows of both the **Sentinel-Layer-General** API and the **MedRx website integration** using Postman.

---

## 📋 Table of Contents
1. [Overview & Prerequisites](#1-overview--prerequisites)
2. [Setting Up Postman Environment](#2-setting-up-postman-environment)
3. [Phase A: Direct Sentinel API Testing](#3-phase-a-direct-sentinel-api-testing)
   - [A.1 Public Health Check (`GET /health`)](#a1-public-health-check-get-health)
   - [A.2 Core Telemetry Evaluation (`POST /evaluate`)](#a2-core-telemetry-evaluation-post-evaluate)
   - [A.3 Testing Dashboard Secured Endpoints (requires JWT)](#a3-testing-dashboard-secured-endpoints-requires-jwt)
4. [Phase B: MedRx Integration Testing](#4-phase-b-medrx-integration-testing)
   - [B.1 Login Flow with Telemetry (`POST /api/auth/login`)](#b1-login-flow-with-telemetry-post-apiauthlogin)
   - [B.2 Action Flow Evaluation (`POST /api/prescriptions`, etc.)](#b2-action-flow-evaluation-post-apiprescriptions-etc)
   - [B.3 Sentinel Webhook Endpoint (`POST /webhooks/sentinel`)](#b3-sentinel-webhook-endpoint-postwebhookssentinel)
5. [💡 Pro-Tips & Troubleshooting](#5-pro-tips--troubleshooting)

---

## 1. Overview & Prerequisites

### 🔐 Your Testing Accounts & Keys
You have two registered API keys from the Sentinel Dashboard corresponding to these credentials:

| Tenant / Account | Registered Email | Password | Sentinel API Key |
| :--- | :--- | :--- | :--- |
| **Account 1** | `test@gmail.com` | `test@123` | `229ab87fd0904f6dab62a283231fa7a1ccc3a8fa28f443278a16f926c5183868` |
| **Account 2** | `test2@gmail.com` | `test2@123` | `1f126e32ba794e3fa51247907c7f2ead4ef23cdf10ea49c99df0fb44d8eb4d1a` |

---

## 2. Setting Up Postman Environment

To run the flows efficiently, create a **Postman Environment** containing the following key-value pairs:

| Variable | Description | Example (Local Dev) | Example (Deployed / Production) |
| :--- | :--- | :--- | :--- |
| `sentinel_base_url` | Base URL of the Sentinel API | `http://localhost:3001` | `https://sentinel-layer-general.onrender.com` |
| `medrx_base_url` | Base URL of the MedRx website backend | `http://localhost:5000` | `https://your-medrx-backend.onrender.com` |
| `api_key_1` | Sentinel API Key for Account 1 | `229ab87fd0904f6dab62a283231fa7a1ccc3a8fa28f443278a16f926c5183868` | (Same) |
| `api_key_2` | Sentinel API Key for Account 2 | `1f126e32ba794e3fa51247907c7f2ead4ef23cdf10ea49c99df0fb44d8eb4d1a` | (Same) |
| `active_api_key` | Key currently used for testing evaluation | `{{api_key_1}}` | `{{api_key_1}}` |
| `jwt_token` | Firebase ID Token for Secured Dashboard | *Paste from DevTools LocalStorage* | *Paste from DevTools LocalStorage* |
| `medrx_jwt_token` | Authentication token for MedRx | *Generated during MedRx Login* | *Generated during MedRx Login* |
| `webhook_secret` | Secret for testing Sentinel Webhook signature | `qwertyuiopasdfghjkl` | (Same) |

---

## 3. Phase A: Direct Sentinel API Testing

Direct API testing verifies that the Sentinel core server is fully operational and evaluates risk scoring parameters as designed.

### A.1 Public Health Check
Verifies connection integrity to both PostgreSQL Database and Redis caching server.

- **Method**: `GET`
- **URL**: `{{sentinel_base_url}}/health`
- **Headers**: None
- **Expected Response (200 OK)**:
```json
{
  "status": "ok",
  "timestamp": "2026-06-22T17:28:00.000Z",
  "database": "ok",
  "redis": "ok",
  "uptime": 142.5
}
```

---

### A.2 Core Telemetry Evaluation (`POST /evaluate`)
The heart of Sentinel's security analysis. Testing endpoints ensures the anomaly scoring heuristics correctly trigger.

#### Scenario A.2.1: Normal Interaction (LOW Risk)
Tests if standard typing metrics and known IP address range output a benign (LOW risk) verdict.

- **Method**: `POST`
- **URL**: `{{sentinel_base_url}}/evaluate`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-Sentinel-Key`: `{{active_api_key}}`
- **Request Body (JSON)**:
```json
{
  "user_id": "usr_premium_user",
  "session_id": "sess_normal_001",
  "action": {
    "type": "page_view"
  },
  "network": {
    "ip_address": "12.166.45.102"
  },
  "geo": {
    "lat": 37.7749,
    "lon": -122.4194
  },
  "device": {
    "fingerprint": "sess_normal_001",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  "behavioral": {
    "typing_speed": 65,
    "mouse_velocity": 140,
    "time_on_page": 25
  }
}
```
- **Expected Response (200 OK)**:
```json
{
  "risk": {
    "score": 15,
    "level": "LOW"
  },
  "recommended_action": "allow",
  "anomalies_detected": [],
  "session_id": "sess_normal_001"
}
```

#### Scenario A.2.2: Bot Anomaly (HIGH Risk)
Tests if unrealistic mouse velocities or speeds (e.g. typing speed of 950 WPM with no mouse movements) trigger alerts.

- **Method**: `POST`
- **URL**: `{{sentinel_base_url}}/evaluate`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-Sentinel-Key`: `{{active_api_key}}`
- **Request Body (JSON)**:
```json
{
  "user_id": "usr_premium_user",
  "session_id": "sess_anomaly_bot",
  "action": {
    "type": "login"
  },
  "network": {
    "ip_address": "103.45.162.18"
  },
  "geo": {
    "lat": 19.0760,
    "lon": 72.8777
  },
  "device": {
    "fingerprint": "bot_fingerprint_001",
    "user_agent": "Mozilla/5.0 (Linux; Android 12)"
  },
  "behavioral": {
    "typing_speed": 950,
    "mouse_velocity": 0,
    "time_on_page": 1
  }
}
```
- **Expected Response (200 OK)**:
```json
{
  "risk": {
    "score": 75,
    "level": "HIGH"
  },
  "recommended_action": "block",
  "anomalies_detected": [
    "high_typing_speed",
    "zero_mouse_movement"
  ],
  "session_id": "sess_anomaly_bot"
}
```

#### Scenario A.2.3: Revoked/Fake API Key Check
Verifies key validation failure logic.

- **Method**: `POST`
- **URL**: `{{sentinel_base_url}}/evaluate`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-Sentinel-Key`: `sentinel_sk_live_fakekeyplaceholder`
- **Request Body**: Same payload as Scenario A.2.1.
- **Expected Response (401 Unauthorized)**:
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The API key provided is invalid or revoked"
  }
}
```

---

### A.3 Testing Dashboard Secured Endpoints (requires JWT)

> [!IMPORTANT]
> **Dashboard JWT Auth Flow**:
> The Sentinel Dashboard utilizes Firebase Authentication under the hood. As result, `/auth/login` and `/auth/me` endpoints expect a Bearer token verification signed by Firebase.
> 
> **How to test Dashboard endpoints in Postman**:
> 1. Open your browser and log in to the Sentinel Dashboard UI (e.g., `http://localhost:5173`).
> 2. Open Developer Tools (F12) → go to **Application** tab → under **Local Storage**, select the dashboard URL.
> 3. Find and copy the value of `sentinel_token` (this is the active JWT).
> 4. In Postman, assign this value to your `jwt_token` environment variable.

With `jwt_token` configured, you can test the following management endpoints:

#### A.3.1 Get Sessions List
- **Method**: `GET`
- **URL**: `{{sentinel_base_url}}/sessions?limit=20&offset=0`
- **Headers**:
  - `Authorization`: `Bearer {{jwt_token}}`
- **Expected Response (200 OK)**:
```json
{
  "sessions": [
    {
      "id": "...",
      "external_user_id": "usr_premium_user",
      "ip_address": "12.166.45.102",
      "current_risk_score": 15,
      "status": "active"
    }
  ],
  "total": 1
}
```

#### A.3.2 List Security Alerts
- **Method**: `GET`
- **URL**: `{{sentinel_base_url}}/alerts?status=open`
- **Headers**:
  - `Authorization`: `Bearer {{jwt_token}}`

#### A.3.3 Acknowledge Alert (PATCH)
- **Method**: `PATCH`
- **URL**: `{{sentinel_base_url}}/alerts/{{alert_id}}` (Replace with a valid alert UUID from `GET /alerts`)
- **Headers**:
  - `Authorization`: `Bearer {{jwt_token}}`
  - `Content-Type`: `application/json`
- **Request Body (JSON)**:
```json
{
  "status": "acknowledged"
}
```
- **Expected Response (200 OK)**: Contains updated alert object with `"status": "acknowledged"`.

#### A.3.4 Get Threat Intelligence List
- **Method**: `GET`
- **URL**: `{{sentinel_base_url}}/threats`
- **Headers**:
  - `Authorization`: `Bearer {{jwt_token}}`

#### A.3.5 Download CSV Reports
- **Method**: `GET`
- **URL**: `{{sentinel_base_url}}/reports`
- **Headers**:
  - `Authorization`: `Bearer {{jwt_token}}`
- **Expected Response**: Direct download of CSV formatted summary report.

---

## 4. Phase B: MedRx Integration Testing

MedRx integrates Sentinel checks during user authentication and sensitive actions. These tests verify the MedRx backend communicates properly with Sentinel and blocks malicious activities.

### B.1 Login Flow with Telemetry (`POST /api/auth/login`)
MedRx sends the user's frontend behavioral telemetry to Sentinel during login.

- **Method**: `POST`
- **URL**: `{{medrx_base_url}}/api/auth/login`
- **Headers**:
  - `Content-Type`: `application/json`
- **Request Body (JSON)**:
```json
{
  "email": "doctor@medrx.com",
  "password": "doctorpassword123",
  "sentinelTelemetry": {
    "session_id": "sess_login_postman_001",
    "network": {
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    },
    "behavioral": {
      "typing_speed": 60,
      "mouse_velocity": 120,
      "time_on_page": 15
    }
  }
}
```

#### Expected Verdict Handling:
1. **If Sentinel returns ALLOW**:
   - MedRx responds with `200 OK` and returns the Doctor's login JWT.
   - Save the returned token as `medrx_jwt_token`.
2. **If Sentinel returns BLOCK (simulated by setting typing_speed: 900, mouse_velocity: 0 in payload)**:
   - MedRx returns `403 Forbidden`:
   ```json
   {
     "sentinelVerdict": "BLOCK",
     "message": "Login blocked by security policy."
   }
   ```
3. **If Sentinel returns VERIFY (Requires step-up authentication)**:
   - MedRx returns `403 Forbidden`:
   ```json
   {
     "sentinelVerdict": "VERIFY",
     "message": "OTP Verification required."
   }
   ```

---

### B.2 Action Flow Evaluation (e.g., `POST /api/prescriptions`)
Verify how endpoints protected by the `sentinelGuard` middleware handle telemetry.

- **Method**: `POST`
- **URL**: `{{medrx_base_url}}/api/prescriptions`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{medrx_jwt_token}}`
- **Request Body (JSON)**:
```json
{
  "patientId": "65b90f488f284e3c54a991f2",
  "medicines": [
    { "name": "Amoxicillin", "dosage": "500mg", "frequency": "Thrice a day", "duration": "5 days" }
  ],
  "sentinelTelemetry": {
    "session_id": "sess_action_postman_001",
    "behavioral": {
      "typing_speed": 75,
      "mouse_velocity": 150,
      "time_on_page": 30
    }
  }
}
```

#### Simulating OTP Verification Bypass:
If you need to bypass a step-up challenge (e.g., in automated testing), add the header:
- `x-sentinel-otp-verified`: `true`

This instructs `sentinelGuard` to bypass evaluation and pass control to the route logic immediately:
```javascript
if (req.headers["x-sentinel-otp-verified"] === "true") {
  console.log(`[SentinelGuard] OTP already verified. Bypassing evaluation.`);
  return next();
}
```

---

### B.3 Sentinel Webhook Endpoint (`POST /webhooks/sentinel`)
MedRx listens to real-time webhook alerts sent from Sentinel when an anomaly occurs.

- **Method**: `POST`
- **URL**: `{{medrx_base_url}}/webhooks/sentinel`
- **Headers**:
  - `Content-Type`: `application/json`
  - `x-sentinel-signature`: `sha256={{computed_signature}}`
- **Request Body (JSON)**:
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

> [!TIP]
> **How to Compute the `x-sentinel-signature`**:
> 1. In Postman, go to the request's **Pre-request Script** tab.
> 2. Add the following code to compute the signature dynamically based on your request body and environment's `webhook_secret` (default is `qwertyuiopasdfghjkl`):
> ```javascript
> const secret = pm.environment.get("webhook_secret") || "qwertyuiopasdfghjkl";
> const body = pm.request.body.toString();
> const hash = CryptoJS.HmacSHA256(body, secret).toString(CryptoJS.enc.Hex);
> pm.request.headers.add({
>     key: "x-sentinel-signature",
>     value: "sha256=" + hash
> });
> ```
> 3. Clear the header `x-sentinel-signature` from the **Headers** tab (since the script injects it dynamically).
> 4. Send the request. A successful verification will return **`200 OK`** with message **`OK`**.

---

## 5. 💡 Pro-Tips & Troubleshooting

### 🛑 Verification Failures
- **Error**: `Invalid signature` on Webhook route
  - **Check**: Ensure `SENTINEL_WEBHOOK_SECRET` in `MedRx-Sentinel-integrated/backend/.env` matches `webhook_secret` in Postman (`qwertyuiopasdfghjkl`).
  - **Check**: Make sure the body JSON in Postman does not contain unnecessary trailing whitespaces or formatting changes after signature calculation.

- **Error**: `401 Unauthorized` on Evaluate
  - **Check**: Verify the `X-Sentinel-Key` header has been set to the correct API key from either Account 1 or Account 2.
  - **Check**: In local dev, make sure `API_KEY_SALT` is configured in `Sentinel-Layer-General/backend/.env`.

### 🔄 Environment Toggling
You can switch test keys by changing the `active_api_key` environment variable in Postman to `{{api_key_1}}` or `{{api_key_2}}`. This allows you to verify that Sentinel isolates accounts and scores threat history separately per tenant account.
