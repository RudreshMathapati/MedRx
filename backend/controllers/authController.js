import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      return res.status(400).json({ message: "Invalid credentials (wrong password)" });
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