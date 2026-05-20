import express from "express";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";
import { verifyToken, isSuperAdmin } from "../middleware/authMiddleware.js";
import { deleteHospital, restoreHospital } from "../controllers/superAdminController.js";
const router = express.Router();


// STATS (Only Active Hospitals Data)
router.get("/stats", verifyToken, isSuperAdmin, async (req, res) => {
  const hospitals = await Hospital.countDocuments({ status: "active" });

  const doctors = await User.countDocuments({
    role: "doctor",
    isActive: true,
  });

  const patients = await Patient.countDocuments();
  const prescriptions = await Prescription.countDocuments();

  res.json({ hospitals, doctors, patients, prescriptions });
});


// GET ACTIVE HOSPITALS
router.get("/hospitals", verifyToken, isSuperAdmin, async (req, res) => {
  const hospitals = await Hospital.find({ status: "active" }).sort({
    createdAt: -1,
  });
  res.json(hospitals);
});
router.put(
  "/restore-hospital/:hospitalId",
  verifyToken,
  isSuperAdmin,
  restoreHospital
);

// GET ARCHIVED HOSPITALS
router.get(
  "/archived-hospitals",
  verifyToken,
  isSuperAdmin,
  async (req, res) => {
    const hospitals = await Hospital.find({ status: "archived" }).sort({
      deletedAt: -1,
    });
    res.json(hospitals);
  }
);


// ARCHIVE HOSPITAL (DELETE → ARCHIVE)
router.delete(
  "/hospital/:hospitalId",
  verifyToken,
  isSuperAdmin,
  deleteHospital
);


export default router;