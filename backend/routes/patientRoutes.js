import express from "express";
import Patient from "../models/Patient.js";

import {
  addPatient,
  getDoctorPatients,
  getReceptionistPatients,
  markCompleted
} from "../controllers/patientController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

// ==========================
// Protected Actions
// ==========================

// Create Patient
router.post(
  "/add",
  verifyToken,
  sentinelGuard("add_patient"),
  addPatient
);

// Read Operations
router.get("/doctor", verifyToken, getDoctorPatients);
router.get("/receptionist", verifyToken, getReceptionistPatients);

// Complete Patient
router.put(
  "/complete/:id",
  verifyToken,
  sentinelGuard("complete_patient"),
  markCompleted
);

// Single Patient
router.get("/:id", verifyToken, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
});

export default router;