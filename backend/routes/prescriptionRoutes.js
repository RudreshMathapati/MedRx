import express from "express";

import {
  createPrescription,
  getPrescriptionByPatient
} from "../controllers/prescriptionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

// ==========================
// Protected Actions
// ==========================

// Create Prescription
router.post(
  "/create",
  verifyToken,
  sentinelGuard("create_prescription"),
  createPrescription
);

// Read Prescription
router.get(
  "/patient/:patientId",
  verifyToken,
  getPrescriptionByPatient
);

export default router;