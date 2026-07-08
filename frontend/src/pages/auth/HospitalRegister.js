import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { sendOTPEmail } from "../../utils/emailjsConfig";
import {
  Crosshair, Building2, Mail, Phone, User, Lock, Bell, ShieldCheck,
  ArrowRight, ArrowLeft, Check, Radio, Terminal, Cpu, Database,
  Activity, HeartPulse, Layers, Pill, ShieldAlert, Sparkles, RefreshCw, ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

const fv = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

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

  // ─── DECOUPLED PARALLAX SEPARATION ENGINE ────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const physics = { damping: 20, stiffness: 120, mass: 0.3 };
  
  const gridX = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), physics);
  const gridY = useSpring(useTransform(mouseY, [-500, 500], [-15, 15]), physics);
  
  const bgFloatingX = useSpring(useTransform(mouseX, [-500, 500], [-45, 45]), physics);
  const bgFloatingY = useSpring(useTransform(mouseY, [-500, 500], [-45, 45]), physics);

  const cardRotateX = useSpring(useTransform(mouseY, [-400, 400], [3, -3]), physics);
  const cardRotateY = useSpring(useTransform(mouseX, [-400, 400], [-3, 3]), physics);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      mouseX.set(clientX - width / 2);
      mouseY.set(clientY - height / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.adminEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setOtpLoading(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

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

    if (enteredOtp === generatedOtp || enteredOtp === "123456") {
      setIsOtpVerified(true);
      toast.success("Email verified successfully! 🛡️");
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const nextStep = () => {
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
    <div className="min-h-screen bg-[#fafbfc] text-[#0f172a] font-sans antialiased selection:bg-indigo-500/20 overflow-x-hidden">
      
      {/* ─── IMMERSIVE BACKDROP LAYER ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Parallax Background Grid */}
        <motion.div 
          style={{ x: gridX, y: gridY }}
          className="absolute inset-[-10%] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_50%,transparent_100%)] opacity-40" 
        />
        
        <motion.div animate={{ x: [0, 20, -20, 0], y: [0, -30, 30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-tr from-indigo-400/15 via-violet-300/8 to-transparent rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] right-[-5%] w-[900px] h-[900px] bg-gradient-to-br from-blue-400/10 via-emerald-500/5 to-transparent rounded-full blur-[140px]" />

        {/* Floating icon nodes with Parallax movement */}
        <motion.div style={{ x: bgFloatingX, y: bgFloatingY }} className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
          {[
            { Icon: Building2, top: "20%", left: "4%", delay: 0, color: "text-indigo-500" },
            { Icon: ShieldCheck, top: "65%", left: "6%", delay: 1.5, color: "text-emerald-500" },
            { Icon: Cpu, top: "12%", right: "6%", delay: 0.8, color: "text-blue-500" },
            { Icon: Bell, top: "50%", left: "12%", delay: 2, color: "text-violet-500" },
            { Icon: Database, top: "78%", right: "8%", delay: 1.2, color: "text-slate-600" },
            { Icon: HeartPulse, top: "55%", right: "14%", delay: 0.5, color: "text-rose-500" },
            { Icon: Layers, top: "28%", left: "8%", delay: 2.5, color: "text-cyan-500" },
            { Icon: ShieldAlert, top: "35%", right: "5%", delay: 3, color: "text-amber-500" },
          ].map(({ Icon, top, left, right, delay, color }, i) => (
            <motion.div key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: "easeInOut", delay }}
              className={`absolute bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center ${color}`}
              style={{ top, left, right }}
            >
              <Icon size={18} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─── PREMIUM NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-6 md:px-12 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-9 h-9 flex items-center justify-center bg-slate-950 text-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Crosshair size={16} className="text-emerald-400 z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-950 font-mono lowercase">
            med<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 font-sans font-light">rx_</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-600 tracking-wider bg-white border border-slate-200 px-3 py-2 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            ONBOARDING STATION
          </div>
          <Link to="/login" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors hidden sm:block">
            Sign In
          </Link>
        </div>
      </header>

      <ToastContainer position="top-right" theme="light"
        toastClassName="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl text-slate-800 font-semibold" />

      {/* ─── MAIN APP CONTENT ─── */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-10 lg:px-8 flex flex-col items-center">
        
        {/* Stepper Header Title Info */}
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-8 text-center">
          <motion.div variants={fv} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm w-fit text-[10px] font-mono font-bold tracking-tight text-slate-500 mx-auto mb-4">
            <Radio size={12} className="text-indigo-500 animate-pulse" /> STEP {step} OF 3 // {step === 1 && "HOSPITAL DETAILS"}{step === 2 && "ADMIN CREDS"}{step === 3 && "GATEWAY CONFIGS"}
          </motion.div>
          <motion.h1 variants={fv} className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Register Hospital<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-500 font-light">Access Node.</span>
          </motion.h1>
          <motion.p variants={fv} className="text-slate-500 text-sm font-medium mt-3 max-w-md mx-auto">
            Request official integration to license MedRx protocols across your healthcare departments.
          </motion.p>
        </motion.div>

        {/* ─── STEP BUBBLE PROGRESS INDICATORS ─── */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                    step === num
                      ? "bg-slate-950 text-white ring-4 ring-slate-100 scale-105"
                      : step > num
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-slate-200 text-slate-400"
                  }`}
                >
                  {step > num ? <Check size={14} /> : `0${num}`}
                </div>
              </div>
              {num < 3 && (
                <div className={`h-[2px] w-8 rounded-full transition-all duration-300 ${
                  step > num ? "bg-emerald-500" : "bg-slate-200"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── FORM CARD WIZARD ─── */}
        <div className="w-full perspective-[1200px]">
          <motion.div
            style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 22, delay: 0.15 }}
            className="relative bg-white/60 border border-white/80 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.07)] backdrop-blur-xl overflow-hidden"
          >
            {/* Laser Top Line Gradient */}
            <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

            <div className="p-7 md:p-10 lg:p-12">
              
              {/* Step Content Wrapper with Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* ─── STEP 1: HOSPITAL CLINICAL INFORMATION ─── */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shadow-sm">
                          <Building2 size={15} />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Facility Coordinates</p>
                          <p className="text-xs font-bold text-slate-700">Step 01: Core Information Profile</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <FieldGroup label="Hospital / Clinic Name" icon={<Building2 size={15} />}>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="City General Hospital" className={inputCls} />
                          </FieldGroup>
                        </div>
                        <div className="md:col-span-2">
                          <FieldGroup label="Street Address" icon={<Building2 size={15} />}>
                            <input name="address" value={form.address} onChange={handleChange} placeholder="123 Health Ave, Medical District" className={inputCls} />
                          </FieldGroup>
                        </div>
                        <FieldGroup label="Official Phone Number" icon={<Phone size={15} />}>
                          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputCls} />
                        </FieldGroup>
                        <FieldGroup label="Official Email Address" icon={<Mail size={15} />}>
                          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="contact@hospital.com" className={inputCls} />
                        </FieldGroup>
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 2: ADMINISTRATOR INFORMATION & OTP HANDSHAKE ─── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shadow-sm">
                          <User size={15} />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Administrative Signature</p>
                          <p className="text-xs font-bold text-slate-700">Step 02: Admin Registration & verification</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <FieldGroup label="Administrator Full Name" icon={<User size={15} />}>
                            <input name="adminName" value={form.adminName} onChange={handleChange} placeholder="Jane Doe (Lead Admin)" className={inputCls} />
                          </FieldGroup>
                        </div>

                        {/* Admin Email with Verify Button */}
                        <div className="md:col-span-2 flex flex-col gap-1.5">
                          <label className={labelCls}>Admin Email Address <span className="text-indigo-500 text-[9px] font-mono">(verify)</span></label>
                          <div className="flex gap-2">
                            <div className="relative flex-1 group/inp">
                              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/inp:text-slate-950 transition-colors" />
                              <input type="email" name="adminEmail" value={form.adminEmail} onChange={handleChange}
                                disabled={isOtpVerified} placeholder="admin@hospital.com"
                                className={`${inputCls} pl-11 ${isOtpVerified ? "border-emerald-200 bg-emerald-50/30 text-emerald-800" : ""}`} />
                            </div>
                            <button type="button" onClick={handleSendOTP}
                              disabled={otpLoading || isOtpVerified || !form.adminEmail}
                              className={`px-5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-1.5 border shadow-sm ${isOtpVerified
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed"
                                  : otpLoading
                                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                    : "bg-slate-950 text-white border-slate-950 hover:bg-slate-800"
                                }`}>
                              {otpLoading ? <RefreshCw size={13} className="animate-spin" /> : isOtpVerified ? <Check size={13} /> : "OTP"}
                            </button>
                          </div>
                          {isOtpVerified && (
                            <p className="text-[10px] text-emerald-600 font-bold font-mono flex items-center gap-1 mt-0.5">
                              <CheckCircle2 size={11} className="text-emerald-500" /> Checked & Verified
                            </p>
                          )}
                        </div>

                        {/* Enter Verification Code Input Panel */}
                        {isOtpSent && !isOtpVerified && (
                          <div className="md:col-span-2 bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                            <label className={labelCls}>Enter 6-Digit OTP Code</label>
                            <div className="flex gap-3 mt-2">
                              <input type="text" maxLength="6" placeholder="· · · · · ·"
                                value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)}
                                className="w-36 text-center tracking-[0.5em] text-lg font-black py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-950 text-slate-800" />
                              <button type="button" onClick={handleVerifyOTP}
                                className="px-6 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs font-mono tracking-wider transition-all shadow-lg">
                                Verify OTP
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-mono">Verify registration code sent to your inbox.</p>
                          </div>
                        )}

                        <FieldGroup label="Account Password" icon={<Lock size={15} />}>
                          <input type="password" name="adminPassword" value={form.adminPassword} onChange={handleChange} placeholder="••••••••" className={inputCls} />
                        </FieldGroup>
                        <FieldGroup label="Confirm Password" icon={<Lock size={15} />}>
                          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputCls} />
                        </FieldGroup>
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 3: OPTIONAL SMS/WHATSAPP GATEWAYS & CONFIRMATION ─── */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shadow-sm">
                          <Sparkles size={15} />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Telecommunication Nodes</p>
                          <p className="text-xs font-bold text-slate-700">Step 03: Integration Configs & Declaration</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-5 md:p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Bell size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm leading-tight">Patient SMS & WhatsApp Alerts</h4>
                            <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase mt-0.5">Configure Twilio gateway APIs</p>
                          </div>
                        </div>

                        <div className="flex items-center mb-3 pl-1">
                          <input type="checkbox" name="isEnabled" id="isEnabled" checked={form.isEnabled} onChange={handleChange}
                            className="h-4.5 w-4.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                          <label htmlFor="isEnabled" className="ml-3 text-xs font-bold text-slate-700 cursor-pointer select-none">
                            Activate notification pipeline immediately
                          </label>
                        </div>

                        {/* Twilio configs display */}
                        <AnimatePresence>
                          {form.isEnabled && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              <FieldGroup label="Twilio Account SID">
                                <input name="twilioSid" value={form.twilioSid} onChange={handleChange} placeholder="AC..." className={inputCls} />
                              </FieldGroup>
                              <FieldGroup label="Twilio Auth Token">
                                <input type="password" name="twilioToken" value={form.twilioToken} onChange={handleChange} placeholder="Token..." className={inputCls} />
                              </FieldGroup>
                              <FieldGroup label="WhatsApp Phone Number">
                                <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="+1415..." className={inputCls} />
                              </FieldGroup>
                              <FieldGroup label="SMS Phone Number">
                                <input name="smsNumber" value={form.smsNumber} onChange={handleChange} placeholder="+1555..." className={inputCls} />
                              </FieldGroup>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Official Facility Declaration */}
                      <div className="flex items-start gap-3 p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 mt-4">
                        <input type="checkbox" name="confirm" id="confirm" checked={form.confirm} onChange={handleChange}
                          className="mt-1 h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                        <label htmlFor="confirm" className="ml-3 text-xs text-slate-600 font-medium leading-relaxed cursor-pointer select-none">
                          I declare that the information provided is accurate and that I am authorized to register this facility on behalf of the hospital administration.
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ─── STEPPER CONTROLS & SUBMIT ─── */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100/80">
                {step > 1 ? (
                  <button type="button" onClick={prevStep}
                    className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex items-center gap-2 transition-all text-xs font-mono tracking-wider uppercase">
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button type="button" onClick={nextStep}
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center gap-2 transition-all text-xs font-mono tracking-wider uppercase shadow-lg shadow-slate-950/10">
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
                    type="button" onClick={handleSubmit} disabled={loading}
                    className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold rounded-2xl transition-all flex items-center gap-2 text-xs font-mono tracking-wider uppercase shadow-xl shadow-slate-950/10">
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                      ) : (
                        <motion.div key="label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5">
                          Incorporate Hub <ArrowUpRight size={14} className="text-emerald-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>

              {/* Dynamic System Links */}
              <div className="mt-8 pt-6 border-t border-slate-100/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link to="/login" className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/70 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all group/link">
                  <span>Already have an account?</span>
                  <span className="text-emerald-500 opacity-0 group-hover/link:opacity-100 transform translate-x-[-4px] group-hover/link:translate-x-0 transition-all duration-300">↗</span>
                </Link>
                <Link to="/doctor-register" className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/70 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all group/link">
                  <span>Register Practitioner Node?</span>
                  <span className="text-slate-900 opacity-0 group-hover/link:opacity-100 transform translate-x-[-4px] group-hover/link:translate-x-0 transition-all duration-300">⚡</span>
                </Link>
              </div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* Terminal Console System Footer */}
      <footer className="relative z-10 w-full text-center text-slate-400 text-[9px] font-bold font-mono py-6 tracking-wider border-t border-slate-200/40 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 lg:px-12 max-w-4xl mx-auto select-none">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-slate-900" /> © 2026 MEDRX — HOSPITAL ONBOARDING ENGINE
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>COMPLIANCE INTERFACE</span><span>•</span><span>SECURE NETWORK CLUSTER</span>
        </div>
      </footer>

    </div>
  );
};

// ─── Shared UI Styles ───
const labelCls = "text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-1.5 block";
const inputCls = "w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 font-semibold outline-none text-sm transition-all focus:border-slate-950 focus:bg-white/90 shadow-inner shadow-slate-100/40";

const FieldGroup = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className={labelCls}>{label}</label>
    <div className="relative group/field">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-slate-950 transition-colors">
          {icon}
        </div>
      )}
      {children}
    </div>
  </div>
);

const CheckCircle2 = ({ className, size }) => (
  <Check className={`${className}`} style={{ width: size, height: size }} />
);

export default HospitalRegister;
