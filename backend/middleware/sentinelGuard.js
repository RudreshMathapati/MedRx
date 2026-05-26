import axios from "axios";

/**
 * Express Middleware to evaluate behavioral security telemetry.
 * Communicates with the Sentinel server to analyze threat levels in real-time.
 */
export async function sentinelGuard(req, res, next) {
  // Fail-Open is critical: if any parsing or connection fails, let the request proceed
  try {
    const evaluateUrl = process.env.SENTINEL_EVALUATE_URL || "http://localhost:3001/evaluate";
    const apiKey = process.env.SENTINEL_API_KEY;

    if (!apiKey) {
      console.warn("[SentinelGuard] SENTINEL_API_KEY is not configured. Bypassing check.");
      return next();
    }

    // Extract the telemetry payload sent by the frontend
    const telemetryHeader = req.headers["x-sentinel-telemetry"];
    let sentinelTelemetry = {};

    if (telemetryHeader) {
      try {
        sentinelTelemetry = JSON.parse(telemetryHeader);
      } catch (parseErr) {
        console.error("[SentinelGuard] Error parsing X-Sentinel-Telemetry header:", parseErr.message);
      }
    }

    // Prepare contextual and behavioral parameters
    const userId = req.user?.id || sentinelTelemetry?.user_id || "anonymous";
    const sessionId = req.headers.authorization?.split(" ")[1] || sentinelTelemetry?.session_id || "unknown";

    // Call Sentinel /evaluate endpoint
    const response = await axios.post(
      evaluateUrl,
      {
        user_id: userId,
        session_id: sessionId,
        action: {
          type: req.path // e.g. "/create"
        },
        network: {
          ip_address: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
          user_agent: req.headers["user-agent"] || "unknown"
        },
        behavioral: {
          typing_speed: parseFloat(sentinelTelemetry?.behavioral?.typing_speed) || 0,
          mouse_velocity: parseFloat(sentinelTelemetry?.behavioral?.mouse_velocity) || 0,
          time_on_page: parseInt(sentinelTelemetry?.behavioral?.time_on_page) || 0
        }
      },
      {
        headers: {
          "X-Sentinel-Key": apiKey,
          "Content-Type": "application/json"
        },
        timeout: 2000 // Tight 2-second timeout for maximum speed
      }
    );

    const { recommended_action, risk } = response.data;
    
    console.log(`[SentinelGuard] Evaluated: User: ${userId} | Risk Score: ${risk?.score || 0} | Action: ${recommended_action}`);

    // If session is flagged as critical/hijacked, immediately deny request
    if (recommended_action === "TERMINATE_SESSION" || recommended_action === "BLOCK") {
      return res.status(403).json({
        success: false,
        error: "SESSION_TERMINATED",
        message: "Your session has been terminated due to suspicious behavioral dynamics. Please log in again."
      });
    }

    // If step-up auth is required
    if (recommended_action === "REQUIRE_MFA") {
      return res.status(403).json({
        success: false,
        stepUpRequired: true,
        message: "Step-up authentication is required to complete this action."
      });
    }

    // ALLOW or FLAG -> proceed
    next();
  } catch (error) {
    // Graceful Fail-Open: log error but let genuine customers proceed if Sentinel is offline
    console.error("[SentinelGuard] Evaluation failed or timed out:", error.message);
    next();
  }
}
