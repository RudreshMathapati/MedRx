import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import doctorRequestRoutes from "./routes/doctorRequestRoutes.js";
import hospitalRequestRoutes from "./routes/hospitalRequestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Sentinel
import sentinelWebhookRoute from "./routes/sentinelWebhookRoute.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

// ================================
// Sentinel Webhook Route
// MUST BE BEFORE express.json()
// ================================
app.use("/webhooks/sentinel", sentinelWebhookRoute);

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
app.use("/api/hospital-requests", hospitalRequestRoutes);
app.use("/api/notifications", notificationRoutes);

// socket.io server configuration
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join_hospital", (hospitalId) => {
    if (hospitalId) {
      socket.join(hospitalId.toString());
      console.log(`Socket ${socket.id} joined hospital room: ${hospitalId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// expose socket io to routes
app.set("io", io);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// start server on HTTP wrapper
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});