// backend/utils/generatePrescriptionId.js
import Counter from "../models/Counter.js";
import crypto from "crypto";

export const generatePrescriptionId = async () => {
  const year = new Date().getFullYear();

  // 1. Get the incrementing sequence number
  const counter = await Counter.findOneAndUpdate(
    { name: "prescription" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqNumber = String(counter.seq).padStart(4, "0");

  // 2. Generate a short 4-character random string for security
  // This makes the link sent to WhatsApp secure and non-guessable
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();

  // Result: RX-2026-0001-A2B4
  return `RX-${year}-${seqNumber}-${randomSuffix}`;
};