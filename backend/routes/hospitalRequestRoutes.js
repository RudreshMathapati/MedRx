import express from "express";

import {
  createHospitalRequest,
  getPendingHospitalRequests,
  approveHospitalRequest,
  rejectHospitalRequest,
} from "../controllers/hospitalRequestController.js";

import {
  verifyToken,
  isSuperAdmin
} from "../middleware/authMiddleware.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

// ========================================
// Public Hospital Registration Request
// ========================================

router.post(
  "/",
  sentinelGuard("create_hospital_request"),
  createHospitalRequest
);

// ========================================
// Super Admin Actions
// ========================================

router.get(
  "/",
  verifyToken,
  isSuperAdmin,
  getPendingHospitalRequests
);

router.put(
  "/:id/approve",
  verifyToken,
  isSuperAdmin,
  sentinelGuard("approve_hospital_request"),
  approveHospitalRequest
);

router.put(
  "/:id/reject",
  verifyToken,
  isSuperAdmin,
  sentinelGuard("reject_hospital_request"),
  rejectHospitalRequest
);

export default router;