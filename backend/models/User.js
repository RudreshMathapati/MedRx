import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    password: String,

    role: {
      type: String,
      enum: [
        "super_admin",
        "hospital_admin",
        "doctor",
        "receptionist",
        "patient",
      ],
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    specialization: String,
    qualification: String,
    experience: String,

    // NEW: Doctor signature image
    signatureFile: {
      type: String,
      default: "",
    },

    // Approval system (for doctors)
    isApproved: {
      type: Boolean,
      default: true,
    },

    // Manual block by admin
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Used when hospital archived
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);