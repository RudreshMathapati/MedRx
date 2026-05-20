import twilio from "twilio";
import Hospital from "../models/Hospital.js";

export const sendRxNotification = async (req, res) => {
  try {
    const { patientPhone, patientName, prescriptionId, hospitalId } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || !hospital.communicationSettings?.isEnabled) {
      return res.status(400).json({ message: "Service not enabled for this hospital." });
    }

    const settings = hospital.communicationSettings;
    const client = twilio(settings.twilioSid, settings.twilioToken);

    const rxLink = `${process.env.FRONTEND_URL}/view-rx/${prescriptionId}`;
    const formattedPhone = patientPhone.startsWith('+') ? patientPhone : `+91${patientPhone}`;

    // Send via this specific hospital's WhatsApp
    await client.messages.create({
      from: `whatsapp:${settings.whatsappNumber}`,
      body: `*${hospital.name}*\n\nHello ${patientName},\nYour Rx is ready: ${rxLink}`,
      to: `whatsapp:${formattedPhone}`,
    });

    res.json({ success: true, message: "Notification sent." });
  } catch (error) {
    console.error("Notification Error:", error);
    res.status(500).json({ message: "Twilio error: Check hospital credentials." });
  }
};