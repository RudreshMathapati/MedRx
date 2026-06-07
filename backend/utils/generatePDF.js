
import PDFDocument from "pdfkit";
import fs from "fs";
import qr from "qr-image";

export const generatePrescriptionPDF = async (prescription, patient, doctor, hospital) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = "uploads/prescriptions";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const filePath = `uploads/prescriptions/prescription_${Date.now()}.pdf`;

      // A4 dimensions: 595.28 x 841.89 points
      const doc = new PDFDocument({ size: "A4", margin: 40 }); 
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // 1. TEMPLATE BACKGROUND
      if (hospital.templateFile) {
        let templatePath = hospital.templateFile.replace(/\\/g, "/");
        if (fs.existsSync(templatePath)) {
          doc.image(templatePath, 0, 0, { width: 595, height: 842 });
        }
      }

      // 2. PATIENT INFO BLOCK (Y=170 to clear header)
      const patientY = 170;
      doc.fillColor("#1e293b"); // Modern dark slate

      // Left Info
      doc.font("Helvetica-Bold").fontSize(10).text("PATIENT NAME", 90, patientY);
      doc.font("Helvetica").text(`: ${patient.name.toUpperCase()}`, 175, patientY);
      
      doc.font("Helvetica-Bold").text("PHONE", 90, patientY + 18);
      doc.font("Helvetica").text(`: ${patient.phone}`, 175, patientY + 18);

      doc.font("Helvetica-Bold").text("ID / SL", 90, patientY + 36);
      doc.font("Helvetica").text(`: ${prescription.prescriptionId.slice(-8).toUpperCase()}`, 175, patientY + 36);

      // Right Info
      doc.font("Helvetica-Bold").text("DATE", 400, patientY);
      doc.font("Helvetica").text(`: ${new Date().toLocaleDateString('en-IN')}`, 445, patientY);

      doc.font("Helvetica-Bold").text("WEIGHT", 400, patientY + 18);
      doc.font("Helvetica").text(`: ${patient.weight || "-"} kg`, 445, patientY + 18);

      // Professional horizontal separator
      doc.moveTo(70, 230).lineTo(530, 230).lineWidth(0.5).strokeColor("#e2e8f0").stroke();

      // 3. CLINICAL NOTES
      doc.font("Helvetica-Bold").fontSize(10).text("DIAGNOSIS:", 90, 250);
      doc.font("Helvetica").text(prescription.diagnosis || "General Consultation", 160, 250, { width: 350 });

      // 4. THE Rx SYMBOL
      doc.fillColor("#2563eb").font("Helvetica-Bold").fontSize(24).text("Rx", 70, 285);

      // 5. MEDICINE TABLE HEADER
      const tableTop = 320;
      doc.rect(70, tableTop, 460, 22).fill("#f8fafc"); // Subtle background for header
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(9);

      doc.text("SR.", 80, tableTop + 7);
      doc.text("MEDICINE NAME", 110, tableTop + 7);
      doc.text("DOSAGE (M-A-N)", 300, tableTop + 7);
      doc.text("DURATION", 400, tableTop + 7);
      doc.text("QTY", 495, tableTop + 7);

      // 6. MEDICINE ROWS
      let y = tableTop + 30;
      doc.fillColor("#334155");

      prescription.medicines.forEach((med, index) => {
        const perDay = Number(med.morning) + Number(med.afternoon) + Number(med.night);
        const qty = perDay * Number(med.days);

        doc.font("Helvetica-Bold").fontSize(10).text(index + 1, 80, y);
        doc.text(med.name.toUpperCase(), 110, y);

        doc.font("Helvetica").text(`${med.morning}-${med.afternoon}-${med.night}`, 300, y);
        doc.text(`${med.days} Days`, 400, y);
        doc.font("Helvetica-Bold").text(qty, 495, y);

        y += 18;

        if (med.composition) {
          doc.fontSize(8).fillColor("#94a3b8").text(`Comp: ${med.composition}`, 110, y);
          y += 12;
        }

        // Draw row line
        doc.moveTo(70, y + 2).lineTo(530, y + 2).lineWidth(0.3).strokeColor("#f1f5f9").stroke();
        y += 12;

        if (y > 580) { doc.addPage(); y = 60; }
      });

      // 7. QR CODE & SIGNATURE (Positioned using your specified coordinates)
      // These are optimized to sit just above the Rheumaderm wave footer
      const signatureY = 620; 

      // Left Side: Verification QR
      const qrData = `https://medrx.com/verify/${prescription.prescriptionId}`;
      const qrImage = qr.imageSync(qrData, { type: "png" });
      const qrPath = `uploads/qrcodes/qr_${Date.now()}.png`;
      if (!fs.existsSync("uploads/qrcodes")) fs.mkdirSync("uploads/qrcodes", { recursive: true });
      fs.writeFileSync(qrPath, qrImage);

      doc.image(qrPath, 70, 600, { width: 90 }); // Left Position 
      doc.fontSize(9).fillColor("#64748b").font("Helvetica-Bold").text("Scan to Verify", 80, 690);

      // Right Side: Authorized Signature
      if (doctor.signatureFile) {
        let signPath = doctor.signatureFile.replace(/\\/g, "/");
        if (fs.existsSync(signPath)) {
          doc.image(signPath, 400, signatureY, { width: 130 }); // Right Position 
          
          doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(10);
          doc.text(doctor.name.toUpperCase(), 400, 690, { width: 130, align: "center" });
          
          doc.font("Helvetica").fontSize(8).fillColor("#94a3b8");
          doc.text("Authorized Signature", 400, 705, { width: 130, align: "center" });
        }
      }

      doc.end();
      stream.on("finish", () => resolve(filePath));
    } catch (error) {
      reject(error);
    }
  });
};