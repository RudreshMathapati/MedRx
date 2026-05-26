import Prescription from "../models/Prescription.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import { generatePrescriptionPDF } from "../utils/generatePDF.js";
// Generate Prescription ID
const generatePrescriptionId = async (hospitalCode) => {
  const count = await Prescription.countDocuments();
  const number = String(count + 1).padStart(4, "0");
  return `RX-${hospitalCode}-${number}`;
};

// Create Prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, diagnosis, medicines, tests, advice, nextVisit } =
      req.body;

    const patient = await Patient.findById(patientId);
    const doctor = await User.findById(req.user.id);
    const hospital = await Hospital.findById(patient.hospitalId);

    if (!patient || !doctor || !hospital) {
      return res.status(404).json({ message: "Data missing" });
    }

    // Generate Prescription ID
    const prescriptionId = await generatePrescriptionId(
      hospital.hospitalCode
    );

    // Create prescription
    const prescription = new Prescription({
      prescriptionId,
      patientId,
      doctorId: doctor._id,
      hospitalId: hospital._id,
      diagnosis,
      medicines,
      tests,
      advice,
      nextVisit,
      createdBy: doctor._id,
    });

    await prescription.save();

    // Generate PDF
    const pdfPath = await generatePrescriptionPDF(
      prescription,
      patient,
      doctor,
      hospital
    );

    prescription.pdfUrl = pdfPath;
    await prescription.save();

    // Update patient status
    await Patient.findByIdAndUpdate(patientId, {
      status: "completed",
      prescriptionCreated: true,
    });

    res.json({
      message: "Prescription created",
      pdfUrl: pdfPath,
      prescriptionId,
    });
  } catch (error) {
    console.log("PRESCRIPTION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get Prescription by Patient
export const getPrescriptionByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.log("PRESCRIPTION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};