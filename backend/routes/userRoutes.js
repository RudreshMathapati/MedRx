import express from "express";

import {
  createReceptionist,
  getReceptionists,
  getDoctors,
  blockUser,
  deleteUser,
  getDoctorsByHospital
} from "../controllers/userController.js";

import {
  verifyToken,
  isHospitalAdmin
} from "../middleware/authMiddleware.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

// ==========================
// Protected Actions
// ==========================

// Create Receptionist
router.post(
  "/receptionist",
  verifyToken,
  isHospitalAdmin,
  sentinelGuard("create_receptionist"),
  createReceptionist
);

// Read Operations
router.get(
  "/receptionists",
  verifyToken,
  isHospitalAdmin,
  getReceptionists
);

router.get(
  "/doctors",
  verifyToken,
  isHospitalAdmin,
  getDoctors
);

router.get(
  "/doctors-by-hospital",
  verifyToken,
  getDoctorsByHospital
);

// Block User
router.put(
  "/block/:id",
  verifyToken,
  isHospitalAdmin,
  sentinelGuard("block_user"),
  blockUser
);

// Delete User
router.delete(
  "/:id",
  verifyToken,
  sentinelGuard("delete_user"),
  deleteUser
);

export default router;