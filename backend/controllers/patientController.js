import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";

// Add Patient (Receptionist or Doctor)
export const addPatient = async (req, res) => {
  try {
    const {
      name,
      phone,
      age,
      gender,
      temperature,
      bp,
      weight,
      pulse,
      symptoms,
      doctorId
    } = req.body;

    const patient = new Patient({
      name,
      phone,
      age,
      gender,
      temperature,
      bp,
      weight,
      pulse,
      symptoms,
      doctorId,
      hospitalId: req.user.hospitalId,
      addedBy: req.user.id
    });

    await patient.save();

    // Emit event through socket.io
    const io = req.app.get("io");
    if (io && req.user.hospitalId) {
      io.to(req.user.hospitalId.toString()).emit("QUEUE_UPDATED", {
        hospitalId: req.user.hospitalId,
        doctorId: doctorId
      });
      console.log(`Socket broadcast: QUEUE_UPDATED for hospital ${req.user.hospitalId}`);
    }

    res.json({ message: "Patient added successfully" });
  } catch (error) {
    console.log("ADD PATIENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPatientsForReceptionist = async (req, res) => {
  try {
    const patients = await Patient.find({
      hospitalId: req.user.hospitalId
    }).populate("doctorId", "name");

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get Patients for Doctor
export const getDoctorPatients = async (req, res) => {
  try {
    const patients = await Patient.find({
      doctorId: req.user.id
    }).sort({ visitDate: -1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Patients for Receptionist
export const getReceptionistPatients = async (req, res) => {
  try {
    const patients = await Patient.find({
      hospitalId: req.user.hospitalId
    }).sort({ visitDate: -1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Completed
export const markCompleted = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    patient.status = "completed";
    await patient.save();

    // Emit event through socket.io
    const io = req.app.get("io");
    if (io && req.user.hospitalId) {
      io.to(req.user.hospitalId.toString()).emit("QUEUE_UPDATED", {
        hospitalId: req.user.hospitalId,
        doctorId: patient.doctorId
      });
      console.log(`Socket broadcast: QUEUE_UPDATED (completed) for hospital ${req.user.hospitalId}`);
    }

    res.json({ message: "Patient marked completed" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};