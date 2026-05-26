import axios from "axios";
import { sentinelConfig } from "../config/sentinel.js";

/**
 * Sentinel Security Service
 * Handles standard server-to-server POST logic to Sentinel's /evaluate API.
 */
class SentinelService {
  /**
   * Evaluate action with Sentinel Layer API
   */
  async evaluate(payload) {
    try {
      const response = await axios.post(
        sentinelConfig.evaluateUrl,
        payload,
        {
          headers: {
            "X-Sentinel-Key": sentinelConfig.apiKey,
            "Content-Type": "application/json"
          },
          timeout: sentinelConfig.timeout
        }
      );

      return {
        success: true,
        action: response.data?.recommended_action || response.data?.action || "allow",
        riskScore: response.data?.risk?.score || response.data?.risk_score || 0,
        riskLevel: response.data?.risk?.level || response.data?.risk_level || "LOW",
        anomalies: response.data?.anomalies || response.data?.anomalies_detected || []
      };
    } catch (error) {
      console.error("[SentinelService] API request failed:", error.message);
      
      // Fail-Open strategy to maintain medical system availability
      if (sentinelConfig.failOpen) {
        console.warn("[SentinelService] Fail-Open activated. Allowing request to pass.");
        return {
          success: false,
          action: "allow",
          riskScore: 0,
          riskLevel: "LOW",
          anomalies: []
        };
      }

      throw error;
    }
  }

  /**
   * 1. Evaluate User / Admin Login Attempt
   */
  async evaluateLogin({ userId, role, ipAddress, userAgent, behavioralData, geoData }) {
    const actionType = role === "super_admin" || role === "hospital_admin" ? "admin_login" : "login";
    
    const payload = {
      user_id: userId,
      action: {
        type: actionType
      },
      network: {
        ip_address: ipAddress || "127.0.0.1",
        user_agent: userAgent || "unknown"
      },
      behavioral: {
        typing_speed: parseFloat(behavioralData?.typing_speed) || 0,
        mouse_velocity: parseFloat(behavioralData?.mouse_velocity) || 0,
        time_on_page: parseInt(behavioralData?.time_on_page) || 0
      }
    };

    if (geoData?.lat && geoData?.lon) {
      payload.geo = {
        lat: parseFloat(geoData.lat),
        lon: parseFloat(geoData.lon)
      };
    }

    return this.evaluate(payload);
  }

  /**
   * 2. Evaluate Doctor Sending Prescription
   */
  async evaluateSendPrescription({ doctorId, sessionId, patientId, prescriptionCount, medicinesCount, ipAddress, userAgent }) {
    const payload = {
      user_id: doctorId,
      session_id: sessionId || "unknown",
      action: {
        type: "send_prescription"
      },
      metadata: {
        patient_id: patientId || "unknown",
        prescription_count: parseInt(prescriptionCount) || 1,
        medicines_count: parseInt(medicinesCount) || 0
      },
      network: {
        ip_address: ipAddress || "127.0.0.1",
        user_agent: userAgent || "unknown"
      }
    };

    return this.evaluate(payload);
  }

  /**
   * 3. Evaluate Password Reset Attempt
   */
  async evaluatePasswordReset({ userId, ipAddress, userAgent }) {
    const payload = {
      user_id: userId,
      action: {
        type: "password_reset"
      },
      network: {
        ip_address: ipAddress || "127.0.0.1",
        user_agent: userAgent || "unknown"
      }
    };

    return this.evaluate(payload);
  }

  /**
   * 4. Evaluate OTP Verification Attempt
   */
  async evaluateOtpVerification({ phoneNumber, ipAddress }) {
    const payload = {
      user_id: phoneNumber, // Phone acts as unique identifier
      action: {
        type: "otp_verification"
      },
      network: {
        ip_address: ipAddress || "127.0.0.1"
      }
    };

    return this.evaluate(payload);
  }

  /**
   * 5. Evaluate File / Prescription Upload Activity
   */
  async evaluateFileUpload({ userId, fileSize, fileType, ipAddress }) {
    const payload = {
      user_id: userId,
      action: {
        type: "upload_file"
      },
      metadata: {
        file_size: parseInt(fileSize) || 0,
        file_type: fileType || "unknown"
      },
      network: {
        ip_address: ipAddress || "127.0.0.1"
      }
    };

    return this.evaluate(payload);
  }

  /**
   * 6. Evaluate WhatsApp Message Sending
   */
  async evaluateWhatsAppMessage({ doctorId, recipientCount, ipAddress }) {
    const payload = {
      user_id: doctorId,
      action: {
        type: "send_whatsapp_message"
      },
      metadata: {
        recipient_count: parseInt(recipientCount) || 1
      },
      network: {
        ip_address: ipAddress || "127.0.0.1"
      }
    };

    return this.evaluate(payload);
  }

  /**
   * 7. Track Failed Login Attempt
   */
  async evaluateFailedLogin({ userId, failedAttempts, ipAddress }) {
    const payload = {
      user_id: userId,
      action: {
        type: "failed_login"
      },
      metadata: {
        failed_attempts: parseInt(failedAttempts) || 1
      },
      network: {
        ip_address: ipAddress || "127.0.0.1"
      }
    };

    return this.evaluate(payload);
  }
}

export default new SentinelService();
