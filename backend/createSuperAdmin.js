import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    name: "Super Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "super_admin",
    isApproved: true
  });

  await admin.save();
  console.log("Super Admin Created");
  process.exit();
};

createAdmin();