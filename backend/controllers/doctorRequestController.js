import DoctorRequest from "../models/DoctorRequest.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get pending requests for specific Hospital Admin
export const getHospitalDoctorRequests = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      hospitalAdminId: req.user.id,
      status: "active",
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found or inactive" });
    }

    const requests = await DoctorRequest.find({
      hospitalId: hospital._id,
      status: "pending",
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerDoctorRequest = async (req, res) => {
  try {
    const { hospitalCode } = req.body;

    // Search for hospital (Case insensitive and Trimmed)
    const hospital = await Hospital.findOne({ 
      hospitalCode: hospitalCode.trim().toUpperCase() 
    });

    if (!hospital) {
      return res.status(400).json({ message: "Invalid Hospital Code. Please check with your admin." });
    }

    const newRequest = new DoctorRequest({
      ...req.body,
      hospitalId: hospital._id // Links the doctor to the hospital
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hospital Admin Approve
export const hospitalAdminApprove = async (req, res) => {
  try {
    const request = await DoctorRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: request.email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    // 1. Update Request Status
    request.hospitalAdminApproved = true;
    request.status = "approved";
    await request.save();

    // 2. Create the Doctor User Account
    const generatePassword = () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let pwd = "";
      for (let i = 0; i < 8; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pwd;
    };
    const randomPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const doctor = new User({
      name: request.name,
      email: request.email,
      phone: request.phone,
      password: hashedPassword,
      role: "doctor",
      hospitalId: request.hospitalId,
      specialization: request.specialization,
      qualification: request.qualification,
      experience: request.experience,
      signatureFile: request.signatureFile,
      isApproved: true,
      isActive: true
    });

    await doctor.save();

    res.json({
      message: "Doctor approved and account created successfully",
      data: {
        doctorName: doctor.name,
        email: doctor.email,
        password: randomPassword
      }
    });
  } catch (error) {
    console.error("HOSPITAL APPROVE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Reject Doctor Request
export const rejectDoctorRequest = async (req, res) => {
  try {
    const request = await DoctorRequest.findByIdAndDelete(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Doctor request rejected and removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all for SuperAdmin
export const getAllDoctorRequests = async (req, res) => {
  try {
    const requests = await DoctorRequest.find({ status: "pending" }).populate("hospitalId", "name");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};