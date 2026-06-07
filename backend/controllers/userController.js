import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import bcrypt from "bcryptjs";

// Create Receptionist
export const createReceptionist = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Improved search for the hospital
    const hospital = await Hospital.findOne({
      $or: [
        { hospitalAdminId: req.user.id },
        { _id: req.user.hospitalId }
      ]
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found for this admin." });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create Receptionist linked to the found hospital
    const receptionist = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "receptionist",
      hospitalId: hospital._id, // Use the ID from the found hospital doc
      isApproved: true,
      isActive: true
    });

    await receptionist.save();

    res.json({ success: true, message: "Receptionist created successfully" });

  } catch (error) {
    console.error("CREATE_RECEPTIONIST_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorsByHospital = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      hospitalId: req.user.hospitalId,
      isActive: true
    }).select("name specialization");

    res.json(doctors);
  } catch (error) {
    console.log("GET DOCTORS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = true;
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Doctor record not found" });
    }

    res.json({ message: "Doctor record removed successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal server error during deletion" });
  }
};
// Get Receptionists
export const getReceptionists = async (req, res) => {
  try {
    // Search by BOTH possible links to be safe
    const hospital = await Hospital.findOne({
      $or: [
        { hospitalAdminId: req.user.id },
        { _id: req.user.hospitalId }
      ]
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found for this admin" });
    }

    const receptionists = await User.find({
      role: "receptionist",
      hospitalId: hospital._id
    });

    res.json(receptionists);
  } catch (error) {
    console.error("GET_RECEPTIONISTS_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Doctors
export const getDoctors = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      $or: [
        { hospitalAdminId: req.user.id },
        { _id: req.user.hospitalId }
      ]
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const doctors = await User.find({
      role: "doctor",
      hospitalId: hospital._id
    });

    res.json(doctors);
  } catch (error) {
    console.error("GET_DOCTORS_ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};