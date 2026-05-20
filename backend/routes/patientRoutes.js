import express from "express";
import Patient from "../models/Patient.js";
import {
  addPatient,
  getDoctorPatients,
  getReceptionistPatients,
  markCompleted
} from "../controllers/patientController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addPatient);
router.get("/doctor", verifyToken, getDoctorPatients);
router.get("/receptionist", verifyToken, getReceptionistPatients);
router.put("/complete/:id", verifyToken, markCompleted);
router.get("/:id", verifyToken, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
});
export default router;