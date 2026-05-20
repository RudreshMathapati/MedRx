// import mongoose from "mongoose";

// const medicineSchema = new mongoose.Schema({
//   name: String,
//   morning: String,
//   afternoon: String,
//   night: String,
//   days: String,
//   food: String
// });

// const prescriptionSchema = new mongoose.Schema(
//   {
//     patientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Patient",
//       required: true
//     },

//     doctorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     hospitalId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Hospital",
//       required: true
//     },

//     symptoms: String,
//     diagnosis: String,

//     medicines: [medicineSchema],

//     tests: String,
//     advice: String,
//     nextVisit: String,

//     visitDate: {
//       type: Date,
//       default: Date.now
//     },

//     pdfUrl: String,

//     status: {
//       type: String,
//       enum: ["pending", "completed", "sent"],
//       default: "completed"
//     },

//     // Track message sending
//     whatsappSent: {
//       type: Boolean,
//       default: false
//     },

//     smsSent: {
//       type: Boolean,
//       default: false
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Prescription", prescriptionSchema);


import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: String,
  morning: String,
  afternoon: String,
  night: String,
  days: String,
  food: String,
  qty: String
});

const prescriptionSchema = new mongoose.Schema(
  {
    // NEW: Prescription ID
    prescriptionId: {
      type: String,
      unique: true
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true
    },

    symptoms: String,
    diagnosis: String,

    medicines: [medicineSchema],

    tests: String,
    advice: String,
    nextVisit: String,

    visitDate: {
      type: Date,
      default: Date.now
    },

    // NEW: QR Code Image
    qrCodeFile: String,

    // PDF File
    pdfUrl: String,

    status: {
      type: String,
      enum: ["pending", "completed", "sent"],
      default: "completed"
    },

    whatsappSent: {
      type: Boolean,
      default: false
    },

    smsSent: {
      type: Boolean,
      default: false
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
export default mongoose.models.Prescription || mongoose.model("Prescription", prescriptionSchema);