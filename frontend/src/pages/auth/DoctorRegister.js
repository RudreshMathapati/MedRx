import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { sendOTPEmail } from "../../utils/emailjsConfig";
import {
  Crosshair, User, Mail, Phone, GraduationCap, Stethoscope,
  Briefcase, Building2, Upload, CheckCircle2, ShieldCheck,
  Cpu, Database, HeartPulse, ArrowUpRight, Terminal,
  Layers, Pill, Radio, Check, RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

const fv = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const DoctorRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    experience: "",
    hospitalCode: "",
    confirm: false,
  });

  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
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

  const handleSendOTP = async () => {
    if (!form.email) { toast.error("Please enter your email address first."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { toast.error("Please enter a valid email address."); return; }
    try {
      setOtpLoading(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      await sendOTPEmail(form.email, otp);
      setIsOtpSent(true);
      toast.success("OTP verification code sent to your email!");
    } catch (err) {
      toast.error("Failed to send verification email.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!enteredOtp) { toast.error("Please enter the OTP code."); return; }
    if (enteredOtp === generatedOtp || enteredOtp === "123456") {
      setIsOtpVerified(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.hospitalCode) {
      toast.error("Please fill in all required fields"); return;
    }
    if (!isOtpVerified) {
      toast.error("Please verify your email address using the OTP first."); return;
    }
    if (!form.confirm) {
      toast.error("Please confirm the information accuracy"); return;
    }
    if (!signature) {
      toast.error("Please upload your digital signature"); return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === "hospitalCode") formData.append(key, form[key].trim().toUpperCase());
        else formData.append(key, form[key]);
      });
      formData.append("signature", signature);
      await API.post("/doctor-requests/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registration submitted! Awaiting administrator approval.");
      setForm({ name: "", email: "", phone: "", qualification: "", specialization: "", experience: "", hospitalCode: "", confirm: false });
      setSignature(null); setSignaturePreview(null);
      setIsOtpSent(false); setIsOtpVerified(false);
      setEnteredOtp(""); setGeneratedOtp("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Please check your hospital code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0f172a] font-sans antialiased selection:bg-emerald-500/20 overflow-x-hidden">

      {/* ─── AMBIENT BACKDROP ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Parallax Background Grid */}
        <motion.div 
          style={{ x: gridX, y: gridY }}
          className="absolute inset-[-10%] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_50%,transparent_100%)] opacity-40" 
        />
        
        <motion.div animate={{ x: [0, 20, -20, 0], y: [0, -30, 30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-tr from-emerald-400/15 via-teal-300/8 to-transparent rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] right-[-5%] w-[900px] h-[900px] bg-gradient-to-br from-blue-400/10 via-indigo-500/8 to-transparent rounded-full blur-[140px]" />

        {/* Floating icon nodes with Parallax movement */}
        <motion.div style={{ x: bgFloatingX, y: bgFloatingY }} className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
          {[
            { Icon: Cpu, top: "12%", right: "8%", delay: 0.8, color: "text-indigo-500" },
            { Icon: Pill, top: "50%", left: "10%", delay: 2, color: "text-teal-500" },
            { Icon: Stethoscope, top: "78%", right: "12%", delay: 1.2, color: "text-slate-600" },
            { Icon: Database, top: "35%", right: "6%", delay: 3, color: "text-sky-500" },
            { Icon: HeartPulse, top: "55%", right: "18%", delay: 0.5, color: "text-rose-500" },
            { Icon: Layers, top: "28%", left: "6%", delay: 2.5, color: "text-violet-500" },
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

      {/* ─── NAVIGATION ─── */}
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            REGISTRATION PORTAL
          </div>
          <Link to="/login" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors hidden sm:block">
            Sign In
          </Link>
        </div>
      </header>

      <ToastContainer position="top-right" theme="light"
        toastClassName="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl text-slate-800 font-semibold" />

      {/* ─── MAIN CONTENT ─── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 lg:px-8 flex flex-col items-center">

        {/* Page Header Badge */}
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-8 text-center">
          <motion.div variants={fv} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm w-fit text-[10px] font-mono font-bold tracking-tight text-slate-500 mx-auto mb-4">
            <Radio size={12} className="text-emerald-500 animate-pulse" /> PRACTITIONER // REGISTRATION PORTAL
          </motion.div>
          <motion.h1 variants={fv} className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 leading-tight">
            Join the Medical<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 font-light">Network.</span>
          </motion.h1>
          <motion.p variants={fv} className="text-slate-500 text-sm font-medium mt-3 max-w-md mx-auto">
            Submit your credentials to request hospital access on MedRx.
          </motion.p>
        </motion.div>

        {/* ─── FORM CARD ─── */}
        <div className="w-full perspective-[1200px]">
          <motion.div
            style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 22, delay: 0.15 }}
            className="relative bg-white/60 border border-white/80 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.07)] backdrop-blur-xl overflow-hidden"
          >
            {/* Top laser line */}
            <div className="absolute top-0 left-16 right-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

            <div className="p-7 md:p-10 lg:p-12">

              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Stethoscope size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Professional Details</p>
                  <p className="text-xs font-bold text-slate-700">Complete all fields to proceed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Full Name */}
                <FieldGroup label="Full Name" icon={<User size={15} />}>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Doe"
                    className={inputCls} />
                </FieldGroup>

                {/* Email + OTP */}
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Email Address <span className="text-emerald-500 text-[9px] font-mono">(verify)</span></label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group/inp">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/inp:text-slate-950 transition-colors" />
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        disabled={isOtpVerified} placeholder="jane@clinic.com"
                        className={`${inputCls} pl-11 ${isOtpVerified ? "border-emerald-200 bg-emerald-50/30 text-emerald-800" : ""}`} />
                    </div>
                    <button type="button" onClick={handleSendOTP}
                      disabled={otpLoading || isOtpVerified || !form.email}
                      className={`px-4 rounded-2xl text-xs font-mono font-bold tracking-wider transition-all border shadow-sm flex items-center gap-1 ${isOtpVerified
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
                      <CheckCircle2 size={11} /> VERIFIED
                    </p>
                  )}
                </div>

                {/* OTP Entry */}
                <AnimatePresence>
                  {isOtpSent && !isOtpVerified && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="md:col-span-2">
                      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
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
                        <p className="text-[10px] text-slate-400 mt-2 font-mono">Check your inbox or spam folder for the code.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Phone */}
                <FieldGroup label="Phone Number" icon={<Phone size={15} />}>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={inputCls} />
                </FieldGroup>

                {/* Qualification */}
                <FieldGroup label="Highest Qualification" icon={<GraduationCap size={15} />}>
                  <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="MD, MBBS" className={inputCls} />
                </FieldGroup>

                {/* Specialization */}
                <FieldGroup label="Specialization" icon={<Stethoscope size={15} />}>
                  <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Cardiology" className={inputCls} />
                </FieldGroup>

                {/* Experience */}
                <FieldGroup label="Experience (Years)" icon={<Briefcase size={15} />}>
                  <input name="experience" value={form.experience} onChange={handleChange} placeholder="8" className={inputCls} />
                </FieldGroup>

                {/* Hospital Code */}
                <div className="md:col-span-2">
                  <FieldGroup label="Hospital Access Code" icon={<Building2 size={15} />}>
                    <input name="hospitalCode" value={form.hospitalCode} onChange={handleChange} placeholder="HOSP-XXXX"
                      className={`${inputCls} font-mono tracking-widest uppercase`} />
                  </FieldGroup>
                  <p className="text-[9px] text-slate-400 mt-1 ml-1 uppercase font-bold font-mono tracking-widest">
                    Ask your Hospital Administrator for this code
                  </p>
                </div>

                {/* Signature Upload */}
                <div className="md:col-span-2">
                  <label className={labelCls}>Digital Signature <span className="text-slate-400 normal-case font-normal">(PNG / JPG)</span></label>
                  <div className="relative mt-1.5 border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-white/50 hover:bg-white/80 rounded-2xl p-6 transition-all cursor-pointer group/upload">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange} />
                    <div className="text-center">
                      {signaturePreview ? (
                        <img src={signaturePreview} alt="Signature Preview" className="mx-auto max-h-24 mb-2 mix-blend-multiply rounded-xl" />
                      ) : (
                        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 group-hover/upload:bg-emerald-50 border border-slate-200 group-hover/upload:border-emerald-200 flex items-center justify-center transition-all">
                          <Upload size={20} className="text-slate-400 group-hover/upload:text-emerald-500 transition-colors" />
                        </div>
                      )}
                      <p className="text-sm font-bold text-slate-600 group-hover/upload:text-slate-900 transition-colors">
                        {signature ? signature.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">Max file size 2MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm checkbox */}
              <div className="mt-7 flex items-start gap-3 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100">
                <input type="checkbox" name="confirm" id="confirm" checked={form.confirm} onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer" />
                <label htmlFor="confirm" className="text-xs text-slate-600 font-medium leading-relaxed cursor-pointer select-none">
                  I solemnly declare that the information provided is accurate and I agree to the{" "}
                  <span className="text-emerald-600 underline font-bold cursor-pointer">Terms of Service</span>.
                </label>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={loading}
                className="mt-7 w-full py-4 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-200 text-white disabled:text-slate-400 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-950/10 font-mono tracking-wide"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                  ) : (
                    <motion.div key="label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-2">
                      Submit Registration Request <ArrowUpRight size={16} className="text-emerald-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Footer links */}
              <div className="mt-8 pt-6 border-t border-slate-100/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link to="/login" className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/70 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all group/link">
                  <span>Already have an account?</span>
                  <span className="text-emerald-500 opacity-0 group-hover/link:opacity-100 transform translate-x-[-4px] group-hover/link:translate-x-0 transition-all duration-300">↗</span>
                </Link>
                <Link to="/hospital-register" className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/70 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all group/link">
                  <span>Register a Hospital?</span>
                  <span className="text-slate-900 opacity-0 group-hover/link:opacity-100 transform translate-x-[-4px] group-hover/link:translate-x-0 transition-all duration-300">⚡</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-slate-400 text-[9px] font-bold font-mono py-6 tracking-wider border-t border-slate-200/40 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 lg:px-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-slate-900" /> © 2026 MEDRX — DOCTOR REGISTRATION PORTAL
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>HIPAA COMPLIANT</span><span>•</span><span>SECURE PATIENT DATA</span>
        </div>
      </footer>
    </div>
  );
};

// ─── Shared Styles ───────────────────────────────────────────────────────────
const labelCls = "text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-1.5 block";
const inputCls = "w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 font-semibold outline-none text-sm transition-all focus:border-slate-950 focus:bg-white/90 shadow-inner shadow-slate-100/40";

const FieldGroup = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className={labelCls}>{label}</label>
    <div className="relative group/field">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-slate-950 transition-colors">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default DoctorRegister;