import jwt from "jsonwebtoken";
import User from "../models/User.js";


const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};



export default authMiddleware;
// Verify Token
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Decoded should have { id, role, hospitalId }
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("JWT ERROR:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Super Admin Middleware
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const isHospitalAdmin = (req, res, next) => {
  console.log("ROLE:", req.user.role);
  if (req.user.role !== "hospital_admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};