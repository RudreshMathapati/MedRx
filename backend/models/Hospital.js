// import mongoose from "mongoose";

// const hospitalSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   address: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
  
//   adminName: { type: String, required: true },
//   adminEmail: { type: String, required: true, unique: true, lowercase: true },
//   adminPassword: { type: String, required: true },

//   hospitalCode: { type: String, unique: true, uppercase: true, trim: true },

//   twilioSid: { type: String, default: "" },
//   twilioToken: { type: String, default: "" },
//   whatsappNumber: { type: String, default: "" },
//   smsNumber: { type: String, default: "" },
//   isEnabled: { type: Boolean, default: false },

//   role: { type: String, default: "hospital" },
//   createdAt: { type: Date, default: Date.now },
// });

// /**
//  * NEW FIX: Use async function WITHOUT the 'next' parameter.
//  * This prevents the "next is not a function" TypeError.
//  */
// hospitalSchema.pre("save", async function () {
//   if (!this.hospitalCode) {
//     this.hospitalCode = "HOSP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
//   }
//   // No next() call needed for async hooks
// });

// const Hospital = mongoose.model("Hospital", hospitalSchema);
// export default Hospital;

import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  
  // Master Admin Info
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true, lowercase: true },
  adminPassword: { type: String, required: true },

  hospitalCode: { type: String, unique: true, uppercase: true, trim: true },

  // CRITICAL: Status fields for Login Check
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isActive: { type: Boolean, default: true },

  // References
  hospitalAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  templateFile: { type: String, default: "" },

  // Twilio
  twilioSid: { type: String, default: "" },
  twilioToken: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
  smsNumber: { type: String, default: "" },
  isEnabled: { type: Boolean, default: false },

  role: { type: String, default: "hospital" },
  createdAt: { type: Date, default: Date.now },
});

// Fixed pre-save hook using async (prevents "next is not a function")
hospitalSchema.pre("save", async function () {
  if (!this.hospitalCode) {
    this.hospitalCode = "HOSP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;