import HospitalRequest from "../models/HospitalRequest.js";
import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Public: Create a pending Hospital Admin Request
export const createHospitalRequest = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      adminName,
      adminEmail,
      adminPassword,
      twilioSid,
      twilioToken,
      whatsappNumber,
      smsNumber,
      isEnabled,
    } = req.body;

    // 1. Check if admin email already exists in User collection
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An admin user with this email already exists." });
    }

    // 2. Check if a pending request already exists for this admin email
    const existingRequest = await HospitalRequest.findOne({
      adminEmail: adminEmail.toLowerCase(),
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "A pending request for this admin email already exists." });
    }

    // 3. Hash the admin password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 4. Save request
    const newRequest = new HospitalRequest({
      name,
      address,
      phone,
      email: email.toLowerCase(),
      adminName,
      adminEmail: adminEmail.toLowerCase(),
      adminPassword: hashedPassword,
      twilioSid: twilioSid || "",
      twilioToken: twilioToken || "",
      whatsappNumber: whatsappNumber || "",
      smsNumber: smsNumber || "",
      isEnabled: isEnabled || false,
      status: "pending",
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Registration request submitted successfully. It will be reviewed by the Super Admin.",
    });
  } catch (error) {
    console.error("CREATE_HOSPITAL_REQUEST_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Super Admin: Get all pending requests
export const getPendingHospitalRequests = async (req, res) => {
  try {
    const requests = await HospitalRequest.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("GET_PENDING_REQUESTS_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Super Admin: Approve hospital request
export const approveHospitalRequest = async (req, res) => {
  try {
    const request = await HospitalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    // Check if User already exists under this email (double-check safety)
    const existingAdmin = await User.findOne({ email: request.adminEmail.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "An admin user with this email already exists." });
    }

    // 1. Create the Hospital doc (pre-save generates hospitalCode)
    const hospital = new Hospital({
      name: request.name,
      address: request.address,
      phone: request.phone,
      email: request.email.toLowerCase(),
      adminName: request.adminName,
      adminEmail: request.adminEmail.toLowerCase(),
      adminPassword: request.adminPassword, // Note: already hashed in request
      twilioSid: request.twilioSid || "",
      twilioToken: request.twilioToken || "",
      whatsappNumber: request.whatsappNumber || "",
      smsNumber: request.smsNumber || "",
      isEnabled: request.isEnabled || false,
      status: "active",
      isActive: true,
    });

    await hospital.save();

    // 2. Create the Admin User
    const adminUser = new User({
      name: request.adminName,
      email: request.adminEmail.toLowerCase(),
      password: request.adminPassword, // Note: already hashed
      role: "hospital_admin",
      hospitalId: hospital._id,
      isApproved: true,
      isActive: true,
    });

    await adminUser.save();

    // 3. Link Admin back to Hospital
    hospital.hospitalAdminId = adminUser._id;
    await hospital.save();

    // 4. Update request status
    request.status = "approved";
    await request.save();

    // 5. Send data back to frontend so it can trigger EmailJS
    res.status(200).json({
      success: true,
      message: "Hospital request approved and registered successfully.",
      data: {
        hospitalCode: hospital.hospitalCode,
        adminEmail: request.adminEmail,
        adminName: request.adminName,
        hospitalName: request.name,
      },
    });
  } catch (error) {
    console.error("APPROVE_HOSPITAL_REQUEST_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Super Admin: Reject hospital request
export const rejectHospitalRequest = async (req, res) => {
  try {
    const request = await HospitalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Hospital request rejected successfully.",
    });
  } catch (error) {
    console.error("REJECT_HOSPITAL_REQUEST_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
