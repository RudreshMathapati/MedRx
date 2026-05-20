import Hospital from "../models/Hospital.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createHospital = async (req, res) => {
  try {
    const { 
      name, address, phone, email, 
      adminName, adminEmail, adminPassword,
      twilioSid, twilioToken, whatsappNumber, smsNumber, isEnabled 
    } = req.body;

    // 1. Check if Admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin email already exists" });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 3. Create Hospital (Ensuring status is 'active')
    const hospital = new Hospital({
      name, address, phone, 
      email: email.toLowerCase(),
      adminName, 
      adminEmail: adminEmail.toLowerCase(),
      adminPassword: adminPassword, // To satisfy Schema validation
      twilioSid: twilioSid || "",
      twilioToken: twilioToken || "",
      whatsappNumber: whatsappNumber || "",
      smsNumber: smsNumber || "",
      isEnabled: isEnabled || false,
      status: "active", // Required for Auth check
      isActive: true    // Required for Auth check
    });

    await hospital.save();

    // 4. Create Admin User record
    const adminUser = new User({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "hospital_admin",
      hospitalId: hospital._id,
      isApproved: true,
      isActive: true
    });

    await adminUser.save();

    // 5. Link Admin ID to Hospital doc
    hospital.hospitalAdminId = adminUser._id;
    await hospital.save();

    res.status(201).json({
      success: true,
      message: "Hospital and Admin created successfully",
      hospitalCode: hospital.hospitalCode
    });

  } catch (error) {
    console.error("CREATE_HOSPITAL_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... (Keep your getHospitals and uploadHospitalTemplate as they were)

/**
 * GET ALL HOSPITALS:
 * Fetches hospitals and populates the linked Admin data.
 */
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate("hospitalAdminId", "name email") // Link to User collection
      .sort({ createdAt: -1 });

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("GET_HOSPITALS_ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPLOAD PRESCRIPTION TEMPLATE:
 * Allows a logged-in Hospital Admin to upload their branding template.
 */
export const uploadHospitalTemplate = async (req, res) => {
  try {
    // We search by hospitalAdminId which is linked to req.user.id from auth middleware
    const hospital = await Hospital.findOne({ hospitalAdminId: req.user.id });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital record not found for this admin." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No template file uploaded." });
    }

    hospital.templateFile = req.file.path;
    await hospital.save();

    res.json({
      success: true,
      message: "Prescription template uploaded successfully",
      file: req.file.path,
    });
  } catch (error) {
    console.error("UPLOAD_TEMPLATE_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};