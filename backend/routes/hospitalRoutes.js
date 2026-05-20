
import express from "express";
import { 
  createHospital, 
  getHospitals, 
  uploadHospitalTemplate 
} from "../controllers/hospitalController.js"; // Ensure these 3 are exported in controller
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

export default router;