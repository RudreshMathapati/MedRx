import express from "express";

import {
  createHospital,
  getHospitals,
  uploadHospitalTemplate,
  updateTwilioSettings,
  getMyHospital
} from "../controllers/hospitalController.js";

import {
  verifyToken,
  isSuperAdmin,
  isHospitalAdmin
} from "../middleware/authMiddleware.js";

import { uploadTemplate } from "../middleware/multer.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

// ========================================
// Template Upload (Hospital Admin)
// ========================================

router.post(
  "/upload-template",
  verifyToken,
  isHospitalAdmin,
  uploadTemplate.single("template"),
  sentinelGuard("upload_hospital_template"),
  uploadHospitalTemplate
);

// ========================================
// Auth Test Route
// ========================================

router.get("/test-admin", verifyToken, isHospitalAdmin, (req, res) => {
  res.send("Hospital admin working");
});

// ========================================
// Super Admin Routes
// ========================================

router.post(
  "/create",
  verifyToken,
  isSuperAdmin,
  sentinelGuard("create_hospital"),
  createHospital
);

router.get(
  "/all",
  verifyToken,
  isSuperAdmin,
  getHospitals
);

// ========================================
// Hospital Admin Routes
// ========================================

router.get(
  "/my-hospital",
  verifyToken,
  isHospitalAdmin,
  getMyHospital
);

router.put(
  "/twilio-settings",
  verifyToken,
  isHospitalAdmin,
  sentinelGuard("update_twilio_settings"),
  updateTwilioSettings
);

export default router;