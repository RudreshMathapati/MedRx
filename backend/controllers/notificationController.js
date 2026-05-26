import twilio from "twilio";
import Hospital from "../models/Hospital.js";

export const sendRxNotification = async (req, res) => {
  try {
    const { patientPhone, patientName, prescriptionId, hospitalId } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || !hospital.isEnabled) {
      return res.status(400).json({ message: "Service not enabled for this hospital." });
    }

    const client = twilio(hospital.twilioSid, hospital.twilioToken);

    const rxLink = `${process.env.FRONTEND_URL}/view-rx/${prescriptionId}`;
    const formattedPhone = patientPhone.startsWith('+') ? patientPhone : `+91${patientPhone}`;

    // 1. Send WhatsApp Notification
    await client.messages.create({
      from: `whatsapp:${hospital.whatsappNumber}`,
      body: `*MedRx Digital Prescription*\n\nHello ${patientName},\nYour digital prescription from *${hospital.name}* has been generated.\n\n🔗 *View Rx:* ${rxLink}\n\nGet well soon!`,
      to: `whatsapp:${formattedPhone}`,
    });

    console.log(`✅ WhatsApp sent to ${formattedPhone}`);

    // 2. Send SMS Notification (if smsNumber is configured)
    if (hospital.smsNumber) {
      try {
        await client.messages.create({
          body: `Hello ${patientName}, your prescription from ${hospital.name} is ready. View it here: ${rxLink}`,
          from: hospital.smsNumber,
          to: formattedPhone,
        });
        console.log(`✅ SMS sent to ${formattedPhone}`);
      } catch (smsErr) {
        console.warn("⚠️ Backup SMS failed to send:", smsErr.message);
      }
    }

    res.json({ success: true, message: "Notification sent successfully." });
  } catch (error) {
    console.error("❌ Notification Error:", error);
    res.status(500).json({ message: `Failed to send notification: ${error.message}` });
  }
};