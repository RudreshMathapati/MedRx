import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sentinelService from "../services/sentinelService.js";

/**
 * LOGIN: Authenticates users and checks for account/hospital status
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and populate hospital details to check hospital status
    const user = await User.findOne({ email }).populate("hospitalId");
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or user not found" });
    }

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 🚨 Sentinel: Track failed login attempt
      try {
        await sentinelService.evaluateFailedLogin({
          userId: user._id,
          failedAttempts: 1,
          ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1"
        });
      } catch (err) {
        console.error("Sentinel failed login tracking error:", err.message);
      }

      return res.status(400).json({ message: "Invalid credentials (wrong password)" });
    }

    // 🔒 Sentinel: Evaluate successful login behavior before proceeding
    let behavioralData = {};
    const telemetryHeader = req.headers["x-sentinel-telemetry"];
    if (telemetryHeader) {
      try {
        behavioralData = JSON.parse(telemetryHeader);
      } catch (e) {
        console.warn("Failed to parse telemetry header on login");
      }
    }

    const evaluation = await sentinelService.evaluateLogin({
      userId: user._id,
      role: user.role,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      behavioralData,
      geoData: behavioralData?.geo
    });

    if (evaluation.action === "block" || evaluation.action === "TERMINATE_SESSION") {
      return res.status(403).json({
        message: "Access Denied: Suspicious login activity blocked by security monitoring."
      });
    }

    // 3. Safety & Status Checks 
    // Check if the individual user account is approved/blocked
    if (user.isApproved === false) {
      return res.status(403).json({ message: "Access denied: Your account is pending approval." });
    }

    if (user.isBlocked === true) {
      return res.status(403).json({ message: "Access denied: Your account has been blocked by the admin." });
    }

    // 4. Hospital Health Check (Skip for SuperAdmin)
    if (user.role !== "super_admin") {
      if (!user.hospitalId) {
        return res.status(403).json({ message: "Error: User is not linked to any hospital." });
      }

      if (user.hospitalId.status !== "active") {
        return res.status(403).json({ message: "Access denied: This hospital account is currently inactive." });
      }
    }
    // 5. Generate JWT Token
    // i have included the hospitalId in the token so the frontend doesn't lose it on refresh
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        hospitalId: user.hospitalId?._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // 6. Send Response to Frontend
    res.json({
      token,
      role: user.role,
      userId: user._id,
      hospitalId: user.hospitalId?._id,
      user: {
        name: user.name,
        email: user.email,
        hospitalName: user.hospitalId?.name || "MedRx System"
      }
    });

  } catch (error) {
    console.error("CRITICAL LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Internal server error during login. Please try again later." });
  }
};