import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

// Connect to your MongoDB Atlas URI (reads from .env MONGO_URI)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file!");
  process.exit(1);
}

mongoose.connect(MONGO_URI).then(async () => {
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ role: "super_admin" });
  if (existing) {
    console.log("Super Admin already exists:", existing.email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = new User({
    name: "Super Admin",
    email: "admin@medrx.com",
    password: hashedPassword,
    role: "super_admin",
    isApproved: true,
    isActive: true,
  });

  await admin.save();
  console.log("✅ Super Admin created!");
  console.log("   Email: admin@medrx.com");
  console.log("   Password: admin123");
  console.log("   ⚠️  Change this password after first login!");
  process.exit(0);
}).catch(err => {
  console.error("Connection failed:", err);
  process.exit(1);
});
