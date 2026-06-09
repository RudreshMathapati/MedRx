// services/api.js
import axios from "axios";
import { sentinel } from "./sentinelClient";
import { sendOTPEmail } from "../utils/emailjsConfig";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api",
});

const injectSentinelOTPStyles = () => {
  if (typeof document === "undefined" || document.getElementById("sentinel-otp-styles")) return;
  const style = document.createElement("style");
  style.id = "sentinel-otp-styles";
  style.innerHTML = `
    #sentinel-otp-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #sentinel-otp-overlay.active {
      opacity: 1;
    }
    .sentinel-otp-card {
      background: #ffffff;
      border: 1px solid rgba(241, 245, 249, 0.8);
      border-radius: 28px;
      padding: 40px;
      width: 90%;
      max-width: 440px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
      text-align: center;
      transform: scale(0.92);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #sentinel-otp-overlay.active .sentinel-otp-card {
      transform: scale(1);
      opacity: 1;
    }
    .sentinel-otp-icon {
      font-size: 44px;
      background: #eff6ff;
      width: 80px;
      height: 80px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px auto;
      color: #2563eb;
    }
    .sentinel-otp-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px 0;
      letter-spacing: -0.025em;
    }
    .sentinel-otp-subtitle {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 28px 0;
      font-weight: 500;
    }
    .sentinel-otp-email {
      color: #2563eb;
      font-weight: 700;
      word-break: break-all;
    }
    .sentinel-otp-field {
      width: 100%;
      max-width: 220px;
      height: 58px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      font-size: 32px;
      font-weight: 800;
      text-align: center;
      color: #0f172a;
      outline: none;
      transition: all 0.2s ease;
      letter-spacing: 8px;
      padding-left: 8px;
      background: #f8fafc;
      margin: 0 auto 8px auto;
      display: block;
    }
    .sentinel-otp-field:focus {
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
    }
    .sentinel-otp-error {
      font-size: 13px;
      font-weight: 600;
      color: #ef4444;
      margin: 8px 0 20px 0;
      display: none;
    }
    .sentinel-otp-btn-verify {
      width: 100%;
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 16px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
      margin-bottom: 12px;
    }
    .sentinel-otp-btn-verify:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 12px 20px -3px rgba(37, 99, 235, 0.25);
    }
    .sentinel-otp-btn-verify:active {
      transform: translateY(0);
    }
    .sentinel-otp-btn-cancel {
      width: 100%;
      background: #f1f5f9;
      color: #475569;
      border: none;
      padding: 16px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .sentinel-otp-btn-cancel:hover {
      background: #e2e8f0;
      color: #334155;
    }
  `;
  document.head.appendChild(style);
};

const showOTPModal = (email, correctOtp) => {
  injectSentinelOTPStyles();
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("DOM not available"));
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "sentinel-otp-overlay";
    overlay.innerHTML = `
      <div class="sentinel-otp-card">
        <div class="sentinel-otp-icon">🛡️</div>
        <h3 class="sentinel-otp-title">Security Verification</h3>
        <p class="sentinel-otp-subtitle">
          Enter the 6-digit verification code sent to <span class="sentinel-otp-email">${email}</span> to authorize this action.
        </p>
        <input id="sentinel-otp-field" type="text" placeholder="000000" maxlength="6" class="sentinel-otp-field" autocomplete="off" />
        <div id="sentinel-otp-error" class="sentinel-otp-error"></div>
        <button id="sentinel-otp-verify-btn" class="sentinel-otp-btn-verify">Verify Identity</button>
        <button id="sentinel-otp-cancel-btn" class="sentinel-otp-btn-cancel">Cancel</button>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add("active"), 10);

    const input = document.getElementById("sentinel-otp-field");
    const verifyBtn = document.getElementById("sentinel-otp-verify-btn");
    const cancelBtn = document.getElementById("sentinel-otp-cancel-btn");
    const errorMsg = document.getElementById("sentinel-otp-error");

    input.focus();

    const closeAndClean = () => {
      overlay.classList.remove("active");
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    };

    verifyBtn.onclick = () => {
      const code = input.value.trim();
      if (code === correctOtp) {
        closeAndClean();
        resolve();
      } else {
        errorMsg.textContent = "Invalid verification code. Please try again.";
        errorMsg.style.display = "block";
        input.value = "";
        input.focus();
      }
    };

    cancelBtn.onclick = () => {
      closeAndClean();
      reject(new Error("OTP verification cancelled."));
    };

    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        verifyBtn.click();
      }
    };
  });
};

const getEmailFromRequest = (originalRequest) => {
  if (originalRequest?.data instanceof FormData) {
    if (originalRequest.data.has("email")) {
      return originalRequest.data.get("email");
    }
  }

  try {
    let payload = originalRequest?.data;
    if (typeof payload === "string") {
      payload = JSON.parse(payload);
    }
    if (payload?.email) return payload.email;
  } catch (e) {
    console.error("Failed to parse request email:", e);
  }

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.email) return user.email;
    }
  } catch (e) {
    console.error("Failed to parse user email from localStorage:", e);
  }

  return "";
};

API.interceptors.request.use(
  (req) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      req.headers.Authorization =
        `Bearer ${token}`;
    }

    const method =
      req.method?.toLowerCase();

    const protectedMethods = [
      "post",
      "put",
      "patch",
      "delete",
    ];

    if (
      protectedMethods.includes(method)
    ) {

      const telemetry =
        sentinel.getTelemetry();

      req.headers["x-session-id"] =
        telemetry.session_id;

      if (req.data instanceof FormData) {
        req.data.append("sentinelTelemetry", JSON.stringify(telemetry));
      } else {
        req.data = {
          ...(req.data || {}),
          sentinelTelemetry: telemetry,
        };
      }

      console.log(
        `[SENTINEL ${method.toUpperCase()}]`
      );

      console.log(telemetry);
    }

    return req;
  },

  (error) =>
    Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data?.sentinelVerdict === "BLOCK") {
      toast.error(data.message || "Action blocked by security policy.");
      return Promise.reject(new Error("Blocked by Sentinel"));
    }
    if (data?.sentinelVerdict === "TERMINATE_SESSION") {
      toast.error("Suspicious activity detected. Please login again.");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return Promise.reject(new Error("Session terminated by Sentinel"));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const responseData = error.response?.data;

    if (responseData?.sentinelVerdict) {
      const verdict = responseData.sentinelVerdict;

      if (verdict === "BLOCK") {
        toast.error(responseData.message || "Action blocked by security policy.");
        return Promise.reject(error);
      }

      if (verdict === "TERMINATE_SESSION") {
        toast.error(responseData.message || "Suspicious activity detected. Please login again.");
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return Promise.reject(error);
      }

      if (verdict === "VERIFY") {
        if (originalRequest._retry) {
          return Promise.reject(error);
        }
        originalRequest._retry = true;

        const email = getEmailFromRequest(originalRequest);
        if (!email) {
          toast.error("Verification email address not found.");
          return Promise.reject(error);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        try {
          toast.info("Sending security verification code to your email...");
          await sendOTPEmail(email, otp);
        } catch (emailErr) {
          toast.error("Failed to send verification email. Please try again.");
          return Promise.reject(error);
        }

        try {
          await showOTPModal(email, otp);
          toast.success("Security verification completed successfully.");

          originalRequest.headers["x-sentinel-otp-verified"] = "true";

          return API(originalRequest);
        } catch (verifyErr) {
          toast.warn("Action cancelled or verification failed.");
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;