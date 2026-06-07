import mongoose from "mongoose";

const doctorRequestSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    qualification: String,
    specialization: String,
    experience: String,

    hospitalCode: String,

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    // Doctor signature uploaded during request
    signatureFile: {
      type: String,
      default: "",
    },

    hospitalAdminApproved: {
      type: Boolean,
      default: false,
    },

    superAdminApproved: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.DoctorRequest ||
  mongoose.model("DoctorRequest", doctorRequestSchema);