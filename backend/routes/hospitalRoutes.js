
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

const router = express.Router();

// 1. Template Upload (Hospital Admin only)
router.post(
  "/upload-template",
  verifyToken,
  isHospitalAdmin,
  uploadTemplate.single("template"),
  uploadHospitalTemplate
);

// 2. Auth Test Route
router.get("/test-admin", verifyToken, isHospitalAdmin, (req, res) => {
  res.send("Hospital admin working");
});

// 3. SuperAdmin Routes (Hospital Management)
router.post("/create", verifyToken, isSuperAdmin, createHospital);
router.get("/all", verifyToken, isSuperAdmin, getHospitals);

// 4. Hospital Admin: Twilio Settings
router.get("/my-hospital", verifyToken, isHospitalAdmin, getMyHospital);
router.put("/twilio-settings", verifyToken, isHospitalAdmin, updateTwilioSettings);

export default router;