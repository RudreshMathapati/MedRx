import express from "express";

import {
  registerDoctorRequest,
  hospitalAdminApprove,
  getHospitalDoctorRequests,
  getAllDoctorRequests,
  rejectDoctorRequest
} from "../controllers/doctorRequestController.js";

import {
  verifyToken,
  isHospitalAdmin,
  isSuperAdmin
} from "../middleware/authMiddleware.js";

import { uploadSignature } from "../middleware/multer.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

console.log("Doctor Request Routes Loaded");

// ========================================
// Doctor Registration
// ========================================

router.post(
  "/register",
  uploadSignature.single("signature"),
  sentinelGuard("register_doctor"),
  registerDoctorRequest
);

// ========================================
// Hospital Admin Actions
// ========================================

router.get(
  "/hospital",
  verifyToken,
  isHospitalAdmin,
  getHospitalDoctorRequests
);

router.put(
  "/hospital-approve/:id",
  verifyToken,
  isHospitalAdmin,
  sentinelGuard("approve_doctor"),
  hospitalAdminApprove
);

router.delete(
  "/hospital-reject/:id",
  verifyToken,
  isHospitalAdmin,
  sentinelGuard("reject_doctor"),
  rejectDoctorRequest
);

// ========================================
// Super Admin Actions
// ========================================

router.get(
  "/all",
  verifyToken,
  isSuperAdmin,
  getAllDoctorRequests
);

router.get("/test", (req, res) => {
  res.send("Doctor request route working");
});

export default router;