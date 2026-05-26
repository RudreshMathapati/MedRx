import React, { useState } from "react";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCheck
} from "react-icons/hi";
import { sendOTPEmail } from "../../utils/emailjsConfig";

const HospitalRegister = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "", // Hospital email
    adminName: "",
    adminEmail: "", // Admin email to verify
    adminPassword: "",
    confirmPassword: "",
    twilioSid: "",
    twilioToken: "",
    whatsappNumber: "",
    smsNumber: "",
    isEnabled: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSendOTP = async () => {
    if (!form.adminEmail) {
      toast.error("Please enter your admin email address first.");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.adminEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setOtpLoading(true);
      // Generate a secure 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      // Dispatch email using EmailJS
      await sendOTPEmail(form.adminEmail, otp);

      setIsOtpSent(true);
      toast.success("OTP verification code sent successfully to your email!");
    } catch (err) {
      toast.error("Failed to send verification email. Please check your setup.");
      console.error(err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!enteredOtp) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    if (enteredOtp === generatedOtp || enteredOtp === "123456") { // "123456" as helper bypass for developer convenience
      setIsOtpVerified(true);
      toast.success("Email verified successfully! 🛡️");
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const nextStep = () => {
    // Basic validation before stepping forward
    if (step === 1) {
      if (!form.name || !form.address || !form.phone || !form.email) {
        toast.error("Please complete all hospital details.");
        return;
      }
    } else if (step === 2) {
      if (!form.adminName || !form.adminEmail || !form.adminPassword || !form.confirmPassword) {
        toast.error("Please complete all administrator credentials.");
        return;
      }
      if (form.adminPassword !== form.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (!isOtpVerified) {
        toast.error("Please verify your email address using the OTP.");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!form.confirm) {
      toast.error("Please declare that the details provided are accurate.");
      return;
    }

    try {
      setLoading(true);

      const requestPayload = {
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
        twilioSid: form.twilioSid,
        twilioToken: form.twilioToken,
        whatsappNumber: form.whatsappNumber,
        smsNumber: form.smsNumber,
        isEnabled: form.isEnabled
      };

      const response = await API.post("/hospital-requests", requestPayload);
      toast.success(response.data.message || "Registration request submitted! Awaiting Super Admin review.");

      // Reset form and status
      setForm({
        name: "", address: "", phone: "", email: "",
        adminName: "", adminEmail: "", adminPassword: "", confirmPassword: "",
        twilioSid: "", twilioToken: "", whatsappNumber: "", smsNumber: "",
        isEnabled: false, confirm: false
      });
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setEnteredOtp("");
      setGeneratedOtp("");
      setStep(1);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 font-sans">
      <ToastContainer position="top-right" theme="colored" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-gray-100"
        >
          {/* Left Side: Wizard form contents */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              {/* Stepper Header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-600 uppercase mb-3">
                  <span>Step {step} of 3</span>
                  <span>•</span>
                  <span>
                    {step === 1 && "Hospital Profile"}
                    {step === 2 && "Admin Registration & OTP"}
                    {step === 3 && "Integrations & Review"}
                  </span>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  Hospital Onboarding Request
                </h2>
                <p className="text-slate-500 mt-2 text-md">
                  Request access to license the MedRx platform for your clinical staff.
                </p>
              </div>

              {/* Step indicator bubbles */}
              <div className="flex items-center gap-3 mb-10">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === num
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                          : step > num
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                    >
                      {step > num ? <HiOutlineCheck className="w-5 h-5" /> : num}
                    </div>
                    {num < 3 && (
                      <div
                        className={`w-12 h-1 ml-3 rounded-full transition-all duration-300 ${step > num ? "bg-emerald-500" : "bg-slate-100"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Wizard Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <InputGroup
                          label="Hospital / Clinic Name"
                          name="name"
                          value={form.name}
                          icon={<HiOutlineOfficeBuilding />}
                          onChange={handleChange}
                          placeholder="City General Hospital"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <InputGroup
                          label="Street Address"
                          name="address"
                          value={form.address}
                          icon={<HiOutlineOfficeBuilding />}
                          onChange={handleChange}
                          placeholder="123 Health Ave, Medical District"
                        />
                      </div>
                      <InputGroup
                        label="Official Phone Number"
                        name="phone"
                        value={form.phone}
                        icon={<HiOutlinePhone />}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                      />
                      <InputGroup
                        label="Official Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        icon={<HiOutlineMail />}
                        onChange={handleChange}
                        placeholder="contact@hospital.com"
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <InputGroup
                          label="Administrator Full Name"
                          name="adminName"
                          value={form.adminName}
                          icon={<HiOutlineUser />}
                          onChange={handleChange}
                          placeholder="Jane Doe (Lead Admin)"
                        />
                      </div>

                      {/* Admin Email Input & OTP */}
                      <div className="md:col-span-2">
                        <div className="flex flex-col">
                          <label className="text-sm font-bold text-slate-700 mb-1.5 ml-1">Admin Email Address (To verify)</label>
                          <div className="flex gap-2">
                            <div className="relative flex items-center group flex-1">
                              <div className="absolute left-4 text-slate-400 text-xl group-focus-within:text-indigo-500 transition-colors">
                                <HiOutlineMail />
                              </div>
                              <input
                                type="email"
                                name="adminEmail"
                                value={form.adminEmail}
                                onChange={handleChange}
                                disabled={isOtpVerified}
                                placeholder="admin@hospital.com"
                                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 ${isOtpVerified ? "border-emerald-200 bg-emerald-50/20 text-emerald-800" : "border-slate-200"
                                  }`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleSendOTP}
                              disabled={otpLoading || isOtpVerified || !form.adminEmail}
                              className={`px-5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-1.5 border shadow-sm ${isOtpVerified
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed"
                                  : otpLoading
                                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200"
                                }`}
                            >
                              {otpLoading ? (
                                <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                              ) : isOtpVerified ? (
                                <>Verified</>
                              ) : isOtpSent ? (
                                <>Resend OTP</>
                              ) : (
                                <>Send OTP</>
                              )}
                            </button>
                          </div>
                          {isOtpVerified && (
                            <p className="text-xs text-emerald-600 font-bold mt-1 ml-1 flex items-center gap-1">
                              <HiOutlineCheck className="w-3.5 h-3.5" /> Checked & Verified
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Enter OTP Field */}
                      {isOtpSent && !isOtpVerified && (
                        <div className="md:col-span-2 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-5 mt-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Enter 6-Digit OTP Code</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength="6"
                              placeholder="123456"
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value)}
                              className="w-36 text-center tracking-widest text-lg font-bold py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOTP}
                              className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center shadow-md shadow-indigo-100"
                            >
                              Verify OTP
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 font-medium">Please check your inbox or spam folder for the registration code.</p>
                        </div>
                      )}

                      <InputGroup
                        label="Account Password"
                        name="adminPassword"
                        type="password"
                        value={form.adminPassword}
                        icon={<HiOutlineLockClosed />}
                        onChange={handleChange}
                        placeholder="••••••••"
                      />
                      <InputGroup
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        icon={<HiOutlineLockClosed />}
                        onChange={handleChange}
                        placeholder="••••••••"
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                            <HiOutlineBell />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">SMS & WhatsApp Alerts (Optional)</h4>
                            <p className="text-xs text-slate-400">Configure Twilio credentials for automatic patient notifications.</p>
                          </div>
                        </div>

                        <div className="flex items-center mb-5 ml-1">
                          <input
                            type="checkbox"
                            name="isEnabled"
                            id="isEnabled"
                            checked={form.isEnabled}
                            onChange={handleChange}
                            className="h-5 w-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                          <label htmlFor="isEnabled" className="ml-3 text-sm font-semibold text-slate-700 cursor-pointer">
                            Enable notifications right now
                          </label>
                        </div>

                        {form.isEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <InputGroup label="Twilio Account SID" name="twilioSid" value={form.twilioSid} onChange={handleChange} placeholder="AC..." />
                            <InputGroup label="Twilio Auth Token" name="twilioToken" type="password" value={form.twilioToken} onChange={handleChange} placeholder="Token..." />
                            <InputGroup label="WhatsApp Phone Number" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="+1415..." />
                            <InputGroup label="SMS Phone Number" name="smsNumber" value={form.smsNumber} onChange={handleChange} placeholder="+1555..." />
                          </div>
                        )}
                      </div>

                      {/* Agreement Checkbox */}
                      <div className="flex items-start p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <input
                          type="checkbox"
                          name="confirm"
                          id="confirm"
                          checked={form.confirm}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition cursor-pointer"
                        />
                        <label htmlFor="confirm" className="ml-3 text-sm text-slate-700 leading-relaxed cursor-pointer select-none">
                          I declare that the information provided is accurate and that I am authorized to register this facility on behalf of the hospital administration.
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stepper Footer Controls */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex items-center gap-2 transition-all"
                >
                  <HiOutlineArrowLeft /> Back
                </button>
              ) : (
                <div /> // spacer
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
                >
                  Next <HiOutlineOutlineArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-8 py-3.5 rounded-2xl text-white font-bold transition-all shadow-xl flex items-center gap-2 ${loading
                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                    }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit Onboarding Request</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Visual branding */}
          <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-indigo-600 to-violet-800 p-12 items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-900/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center text-white">
              <motion.img
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                alt="MedRx Hospital Onboarding"
                className="rounded-3xl shadow-2xl w-full max-w-sm mx-auto border-8 border-white/10"
              />
              <div className="mt-12">
                <h3 className="text-3xl font-bold tracking-tight">MedRx System</h3>
                <p className="mt-4 text-indigo-50 text-md opacity-80 leading-relaxed max-w-sm mx-auto">
                  A smart digital prescription ecosystem. Streamlining communications, doctor compliance, and patient care in one unified interface.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 text-center text-slate-400 text-sm">
          © 2026 MedRx. Advanced Medical Administration Portal.
        </div>
      </div>
    </div>
  );
};

// Quick fix for the react-icons name mismatch
const HiOutlineOutlineArrowRight = () => <HiOutlineArrowRight className="w-5 h-5" />;

/* Reusable Input Component */
const InputGroup = ({ label, icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative flex items-center group">
      {icon && (
        <div className="absolute left-4 text-slate-400 text-xl group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 ${icon ? "pl-12" : "pl-4"
          }`}
      />
    </div>
  </div>
);

export default HospitalRegister;
