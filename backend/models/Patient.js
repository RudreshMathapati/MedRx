import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    age: String,
    gender: String,

    temperature: String,
    bp: String,
    weight: String,
    pulse: String,
    symptoms: String,

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    // Track if prescription created
    prescriptionCreated: {
      type: Boolean,
      default: false,
    },

    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model("Patient", patientSchema);