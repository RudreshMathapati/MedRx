import express from "express";
import {
  createPrescription,
  getPrescriptionByPatient
} from "../controllers/prescriptionController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { sentinelGuard } from "../middleware/sentinelGuard.js";

const router = express.Router();

router.post("/create", verifyToken, sentinelGuard, createPrescription);
router.get("/patient/:patientId", verifyToken, getPrescriptionByPatient);

export default router;