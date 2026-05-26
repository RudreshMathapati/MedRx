import emailjs from "@emailjs/browser";

// =========================================================================
// EMAILJS CONFIGURATION — Real credentials configured
// Template 1 (OTP):              template_99aw37x
// Template 2 (Generic Notify):   template_otqunvl  <-- shared for BOTH
//                                 hospital approval AND doctor approval
//
// Your template_otqunvl must have these variables in its body:
//   {{to_email}}  — recipient address (set as "To Email" field)
//   {{subject}}   — used as the email Subject line
//   {{message}}   — full body of the email (plain text)
// =========================================================================

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_clc6fmr";
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "04rEkXvNSLED8jztK";

const EMAILJS_OTP_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_OTP_TEMPLATE_ID || "template_99aw37x";
const EMAILJS_NOTIFY_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_NOTIFY_TEMPLATE_ID || "template_otqunvl"; // shared template

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// -------------------------------------------------------------------------
// Helper: low-level send wrapper
// -------------------------------------------------------------------------
const sendEmail = async (templateId, params) => {
  const result = await emailjs.send(
    EMAILJS_SERVICE_ID,
    templateId,
    params,
    EMAILJS_PUBLIC_KEY
  );
  return result;
};

// -------------------------------------------------------------------------
// 1. OTP Verification Email
//    Template variables used: {{to_email}}, {{otp}}
//    Make sure your OTP template (template_99aw37x) body contains {{otp}}
// -------------------------------------------------------------------------
export const sendOTPEmail = async (email, otp) => {
  try {
    const result = await sendEmail(EMAILJS_OTP_TEMPLATE_ID, {
      to_email: email,
      email: email, // supports both {{to_email}} and {{email}} in template settings
      otp: otp,
    });
    console.log("✅ OTP email sent to:", email, "| OTP:", otp);
    return result;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw error;
  }
};

// -------------------------------------------------------------------------
// 2. Hospital Approval Email  (uses shared notify template)
//    Sends hospitalCode + welcome message to the new hospital admin
// -------------------------------------------------------------------------
export const sendHospitalApprovalEmail = async (email, adminName, hospitalName, hospitalCode) => {
  const subject = `🎉 Congratulations! ${hospitalName} is now live on MedRx`;

  const message =
    `Hello ${adminName},\n\n` +
    `Your request to register "${hospitalName}" has been approved by the Super Admin!\n\n` +
    `Your hospital is now active on MedRx. Share the access code below with your doctors so they can register under your hospital:\n\n` +
    `  Hospital Access Code: ${hospitalCode}\n\n` +
    `You can log in to the Hospital Admin portal using your registered email and password.\n\n` +
    `Welcome aboard!\n` +
    `— MedRx Team`;

  try {
    const result = await sendEmail(EMAILJS_NOTIFY_TEMPLATE_ID, {
      to_email: email,
      subject: subject,
      message: message,
    });
    console.log("✅ Hospital approval email sent to:", email, "| Code:", hospitalCode);
    return result;
  } catch (error) {
    console.error("❌ Failed to send hospital approval email:", error);
    throw error;
  }
};

// -------------------------------------------------------------------------
// 3. Doctor Approval Email  (uses same shared notify template)
//    Sends auto-generated temporary password to the approved doctor
// -------------------------------------------------------------------------
export const sendDoctorApprovalEmail = async (email, doctorName, password) => {
  const subject = `Welcome to MedRx, Dr. ${doctorName}! Your login credentials are ready`;

  const message =
    `Hello Dr. ${doctorName},\n\n` +
    `Your registration request has been approved by your Hospital Administrator.\n\n` +
    `Here are your login credentials for the MedRx Doctor Portal:\n\n` +
    `  Email:              ${email}\n` +
    `  Temporary Password: ${password}\n\n` +
    `Please log in and change your password immediately after your first sign-in.\n\n` +
    `If you did not request access, please contact your hospital administrator.\n\n` +
    `— MedRx Team`;

  try {
    const result = await sendEmail(EMAILJS_NOTIFY_TEMPLATE_ID, {
      to_email: email,
      subject: subject,
      message: message,
    });
    console.log("✅ Doctor approval email sent to:", email, "| Temp password:", password);
    return result;
  } catch (error) {
    console.error("❌ Failed to send doctor approval email:", error);
    throw error;
  }
};
