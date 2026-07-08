const sentinelGuard = (actionType) => {
  return async (req, res, next) => {
    try {
      if (req.headers["x-sentinel-otp-verified"] === "true") {
        console.log(`[SentinelGuard] OTP already verified for action ${actionType}. Bypassing evaluation.`);
        return next();
      }

      let telemetry = req.body?.sentinelTelemetry || {};
      if (typeof telemetry === "string") {
        try {
          telemetry = JSON.parse(telemetry);
        } catch (e) {
          console.error("Failed to parse sentinelTelemetry string in sentinelGuard:", e);
        }
      }

      const userId =
        req.user?.id ||
        req.user?._id ||
        "anonymous";

      const sessionId =
        req.headers["x-session-id"] ||
        userId;

      const payload = {
  user_id:
    telemetry.user_id ||
    String(userId),

  session_id:
    telemetry.session_id ||
    String(sessionId),

  action: {
    type: actionType,
  },

  network: {
    ip_address:
      (req.headers["x-forwarded-for"] || "")
        .split(",")[0]
        .trim() ||
      req.socket.remoteAddress,

    user_agent:
      telemetry.network?.user_agent ||
      req.headers["user-agent"] ||
      "unknown",
  },

  device:
    telemetry.device || {},

  behavioral:
    telemetry.behavioral || {},
};

      console.log("\n==================================");
      console.log("SENTINEL REQUEST START");
      console.log("==================================");

      console.log("[ACTION]", actionType);

      console.log("[USER ID]", userId);

      console.log("[SESSION ID]", sessionId);

      console.log("[REQUEST URL]");
      console.log(
        process.env.SENTINEL_API_URL || "https://sentinel-layer-general.onrender.com/evaluate"
      );

      console.log("[REQUEST HEADERS]");
      console.log({
        "Content-Type": "application/json",
        "X-Sentinel-Key":
          process.env.SENTINEL_API_KEY
      });

      console.log("[REQUEST PAYLOAD]");
      console.log(
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(
        process.env.SENTINEL_API_URL || "https://sentinel-layer-general.onrender.com/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Sentinel-Key":
              process.env.SENTINEL_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("\n==================================");
      console.log("SENTINEL RESPONSE");
      console.log("==================================");

      console.log(
        "[FINAL RESPONSE URL]",
        response.url
      );

      console.log(
        "[STATUS]",
        response.status
      );

      console.log(
        "[STATUS TEXT]",
        response.statusText
      );

      console.log(
        "[CONTENT TYPE]",
        response.headers.get("content-type")
      );

      console.log(
        "[SERVER HEADER]",
        response.headers.get("server")
      );

      console.log(
        "[DATE HEADER]",
        response.headers.get("date")
      );

      const rawResponse =
        await response.text();

      console.log("\n[RAW RESPONSE]");
      console.log(rawResponse);

      try {
        const data =
          JSON.parse(rawResponse);

        console.log(
          "\n[PARSED RESPONSE]"
        );

        console.dir(data, {
          depth: null,
        });

        req.sentinelResponse = data;

        const action = (data.action || data.recommended_action || "ALLOW").toUpperCase();
        
        const isShadowMode = process.env.SENTINEL_SHADOW_MODE === "true";
        if (isShadowMode && action !== "ALLOW") {
          console.log(`[SentinelGuard] SHADOW MODE ACTIVE: Action verdict is ${action}, but bypassing enforcement and allowing request.`);
          return next();
        }

        if (action === "BLOCK") {
          return res.status(403).json({
            sentinelVerdict: "BLOCK",
            message: "Action blocked by security policy."
          });
        }
        if (action === "TERMINATE_SESSION") {
          return res.status(403).json({
            sentinelVerdict: "TERMINATE_SESSION",
            message: "Suspicious activity detected. Session terminated."
          });
        }
        if (action === "VERIFY") {
          return res.status(403).json({
            sentinelVerdict: "VERIFY",
            message: "OTP Verification required."
          });
        }

      } catch (err) {
        console.log(
          "\n[JSON PARSE FAILED]"
        );

        console.log(
          err.message
        );
      }

      console.log(
        "\n=================================="
      );
      console.log(
        "SENTINEL REQUEST END"
      );
      console.log(
        "==================================\n"
      );

      next();
    } catch (err) {
      console.error(
        "\n[SENTINEL ERROR]"
      );

      console.error(err);

      next();
    }
  };
};

export default sentinelGuard;