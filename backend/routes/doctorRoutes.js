import express from "express";
import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const doctorId = req.user.id;

    const patients = await Patient.find({ doctorId }).sort({ createdAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPatients = await Patient.countDocuments({
      doctorId,
      createdAt: { $gte: today },
    });

    const pendingPatients = await Patient.countDocuments({
      doctorId,
      status: "pending",
    });

    const completedPatients = await Patient.countDocuments({
      doctorId,
      status: "completed",
    });

    const prescriptions = await Prescription.countDocuments({ doctorId });

    res.json({
      stats: {
        todayPatients,
        pendingPatients,
        completedPatients,
        prescriptions,
      },
      patients,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loading dashboard" });
  }
});

export default router;