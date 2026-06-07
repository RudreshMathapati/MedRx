import QRCode from "qrcode";
import fs from "fs";

export const generateQRCode = async (data, prescriptionId) => {
  try {
    const dir = "uploads/qrcodes";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = `${dir}/${prescriptionId}.png`;

    await QRCode.toFile(filePath, JSON.stringify(data));

    return filePath;
  } catch (error) {
    console.log("QR Error:", error);
  }
};