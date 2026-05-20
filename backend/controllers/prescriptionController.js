import Prescription from "../models/Prescription.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";
import { generatePrescriptionPDF } from "../utils/generatePDF.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
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

    const pdfLink = `http://localhost:5000/${pdfPath}`;

    // Send WhatsApp
    try {
      await sendWhatsApp(patient.phone, `Your Prescription: ${pdfLink}`);
      prescription.whatsappSent = true;
    } catch (err) {
      console.log("WhatsApp failed");
    }

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
export const sendPrescriptionNotification = async (req, res) => {
  try {
    const { patientPhone, patientName, prescriptionId, hospitalName } = req.body;

    // The link to the viewable prescription PDF
    const rxLink = `${process.env.FRONTEND_URL}/view-rx/${prescriptionId}`;

    // 1. SEND SMS
    await client.messages.create({
      body: `Hello ${patientName}, your prescription from ${hospitalName} is ready. View it here: ${rxLink}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: patientPhone,
    });

    // 2. SEND WHATSAPP
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      body: `*MedRx Digital Prescription*\n\nHello ${patientName},\nYour digital prescription from *${hospitalName}* has been generated.\n\n🔗 *View Rx:* ${rxLink}\n\nGet well soon!`,
      to: `whatsapp:${patientPhone}`,
    });

    res.json({ success: true, message: "Notifications sent via SMS & WhatsApp" });
  } catch (error) {
    console.error("Notification Error:", error);
    res.status(500).json({ message: "Failed to send notifications" });
  }
};