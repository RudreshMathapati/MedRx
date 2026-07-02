import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * LOGIN: Authenticates users and checks for account/hospital status
 */
export const login = async (req, res) => {

  const telemetry =
    req.body.sentinelTelemetry || {};

  console.log(
    "\n========================"
  );

  console.log(
    "[LOGIN TELEMETRY RECEIVED]"
  );

  console.log(
    JSON.stringify(
      telemetry,
      null,
      2
    )
  );

  console.log(
    "========================\n"
  );

  try {

    const { email, password } = req.body;
    console.log("LOGIN REQUEST HEADERS RECEIVED:", JSON.stringify(req.headers, null, 2));

    // ==================================
    // LOGIN SENTINEL EVALUATION
    // ==================================

    try {
      if (req.headers["x-sentinel-otp-verified"] === "true") {
        console.log("[Login Sentinel] OTP already verified. Bypassing check.");
      } else {
        const sentinelPayload = {
          user_id: email,

          session_id:
            telemetry.session_id ||
            `login_${Date.now()}`,

          action: {
            type: "login",
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

        console.log(
          "\n[LOGIN FULL SENTINEL PAYLOAD]"
        );

        console.log(
          JSON.stringify(
            sentinelPayload,
            null,
            2
          )
        );

        console.log("\n==================================");
        console.log("LOGIN SENTINEL REQUEST");
        console.log("==================================");

        console.log(
          JSON.stringify(
            sentinelPayload,
            null,
            2
          )
        );

        const sentinelResponse =
          await fetch(
            process.env.SENTINEL_API_URL || "https://sentinel-layer-general.onrender.com/evaluate",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",

                "X-Sentinel-Key":
                  process.env.SENTINEL_API_KEY || "c493d2858ab64449ab5492d37e0f943700a1cf4ceaa744ee84445991c1843e76",
              },

              body: JSON.stringify(
                sentinelPayload
              ),
            }
          );

        console.log(
          "[LOGIN SENTINEL STATUS]",
          sentinelResponse.status
        );

        console.log(
          "[LOGIN SENTINEL CONTENT TYPE]",
          sentinelResponse.headers.get(
            "content-type"
          )
        );

        const sentinelRaw =
          await sentinelResponse.text();

        console.log(
          "\n[LOGIN SENTINEL RAW RESPONSE]"
        );

        console.log(
          sentinelRaw
        );

        try {
          const parsed =
            JSON.parse(
              sentinelRaw
            );

          console.log(
            "\n[LOGIN SENTINEL PARSED RESPONSE]"
          );

          console.log(
            parsed
          );

          const action = (parsed.action || parsed.recommended_action || "ALLOW").toUpperCase();
          if (action === "BLOCK") {
            return res.status(403).json({
              sentinelVerdict: "BLOCK",
              message: "Login blocked by security policy."
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

        } catch {
          console.log(
            "[LOGIN SENTINEL] Response is not JSON"
          );
        }

        console.log(
          "\n==================================\n"
        );
      }
    } catch (sentinelError) {
      console.error(
        "[LOGIN SENTINEL ERROR]",
        sentinelError
      );
    }

    // ==================================
    // NORMAL LOGIN FLOW
    // ==================================

    const user = await User.findOne({
      email
    }).populate("hospitalId");

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email or user not found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid credentials (wrong password)"
      });
    }

    if (user.isApproved === false) {
      return res.status(403).json({
        message:
          "Access denied: Your account is pending approval."
      });
    }

    if (user.isBlocked === true) {
      return res.status(403).json({
        message:
          "Access denied: Your account has been blocked by the admin."
      });
    }

    if (user.role !== "super_admin") {

      if (!user.hospitalId) {
        return res.status(403).json({
          message:
            "Error: User is not linked to any hospital."
        });
      }

      if (
        user.hospitalId.status !==
        "active"
      ) {
        return res.status(403).json({
          message:
            "Access denied: This hospital account is currently inactive."
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        hospitalId:
          user.hospitalId?._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
      hospitalId:
        user.hospitalId?._id,

      user: {
        name: user.name,
        email: user.email,
        hospitalName:
          user.hospitalId?.name ||
          "MedRx System",
      },
    });

  } catch (error) {

    console.error(
      "CRITICAL LOGIN ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Internal server error during login. Please try again later."
    });

  }
};   