import express from "express";
import {
  createReceptionist,
  getReceptionists,
  getDoctors,
  blockUser,
  deleteUser
} from "../controllers/userController.js";

import { verifyToken, isHospitalAdmin } from "../middleware/authMiddleware.js";
import { getDoctorsByHospital, } from "../controllers/userController.js";
const router = express.Router();

router.post("/receptionist", verifyToken, isHospitalAdmin, createReceptionist);
router.get("/receptionists", verifyToken, isHospitalAdmin, getReceptionists);
router.get("/doctors", verifyToken, isHospitalAdmin, getDoctors);
router.put("/block/:id", verifyToken, isHospitalAdmin, blockUser);
router.get("/doctors-by-hospital", verifyToken, getDoctorsByHospital);
router.delete("/:id", verifyToken, deleteUser);
export default router;