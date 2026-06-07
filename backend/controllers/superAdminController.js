// controllers/superAdminController.js

import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import DoctorRequest from "../models/DoctorRequest.js";


// ARCHIVE HOSPITAL
export const deleteHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const superAdminId = req.user.id;

    // Archive hospital
    await Hospital.findByIdAndUpdate(hospitalId, {
      status: "archived",
      deletedAt: new Date(),
      deletedBy: superAdminId,
    });

    // Disable all users
    await User.updateMany(
      { hospitalId },
      { isActive: false }
    );

    // Reject pending doctor requests
    await DoctorRequest.updateMany(
      { hospitalId, status: "pending" },
      { status: "rejected" }
    );

    res.json({ message: "Hospital archived successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// RESTORE HOSPITAL
export const restoreHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Restore hospital
    await Hospital.findByIdAndUpdate(hospitalId, {
      status: "active",
      deletedAt: null,
      deletedBy: null,
    });

    // Enable all users again
    await User.updateMany(
      { hospitalId },
      { isActive: true }
    );

    res.json({ message: "Hospital restored successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};