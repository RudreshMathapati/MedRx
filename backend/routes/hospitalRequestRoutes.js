import express from "express";
import {
  createHospitalRequest,
  getPendingHospitalRequests,
  approveHospitalRequest,
  rejectHospitalRequest,
} from "../controllers/hospitalRequestController.js";
import { verifyToken, isSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Create hospital registration request
router.post("/", createHospitalRequest);

// Super Admin Protected: Manage requests
router.get("/", verifyToken, isSuperAdmin, getPendingHospitalRequests);
router.put("/:id/approve", verifyToken, isSuperAdmin, approveHospitalRequest);
router.put("/:id/reject", verifyToken, isSuperAdmin, rejectHospitalRequest);

export default router;
