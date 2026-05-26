import mongoose from "mongoose";

const hospitalRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    
    // Admin credentials & details
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true, lowercase: true },
    adminPassword: { type: String, required: true },

    // Twilio Notification Settings
    twilioSid: { type: String, default: "" },
    twilioToken: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    smsNumber: { type: String, default: "" },
    isEnabled: { type: Boolean, default: false },

    // Status of the request
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.HospitalRequest ||
  mongoose.model("HospitalRequest", hospitalRequestSchema);
