import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import doctorRequestRoutes from "./routes/doctorRequestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

const app = express();

dotenv.config();
// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/doctor-requests", doctorRequestRoutes);
// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// connect DB
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});