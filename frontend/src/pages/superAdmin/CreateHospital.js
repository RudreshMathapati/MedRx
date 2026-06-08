import React, { useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOfficeBuilding,
  HiChatAlt2,
  HiUser,
  HiShieldCheck,
  HiCheckCircle,
  HiPlusCircle,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiLockClosed,
  HiKey,
} from "react-icons/hi";

const CreateHospital = () => {
  const [loading, setLoading] = useState(false);
  const [hospitalCode, setHospitalCode] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    twilioSid: "",
    twilioToken: "",
    whatsappNumber: "",
    smsNumber: "",
    isEnabled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.adminEmail || !form.adminPassword) {
      toast.error("Please fill all required fields including password");
      return;
    }

    try {
      setLoading(true);
      console.log("Onboarding hospital:", form);
      const res = await API.post("/hospitals/create", form);

      setHospitalCode(res.data.hospitalCode);
      toast.success("Hospital registered successfully");

      setForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
        twilioSid: "",
        twilioToken: "",
        whatsappNumber: "",
        smsNumber: "",
        isEnabled: false,
      });
    } catch (err) {
      console.error("Onboarding error:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Error creating hospital"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-150 flex items-center justify-center text-teal-600 flex-shrink-0">
                <HiPlusCircle className="text-base" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                New Hospital Onboarding
              </h1>
            </div>
            <p className="text-slate-400 text-xs font-medium ml-10">
              Configure details, notifications, and initial administrative access.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 space-y-6 shadow-sm"
            >
              {/* HOSPITAL INFO SECTION */}
              <Section
                icon={<HiOfficeBuilding className="w-4 h-4" />}
                title="Hospital Details"
              >
                <Input
                  name="name"
                  label="Hospital Name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="St. Mary's General"
                  icon={<HiOfficeBuilding className="text-xs" />}
                />
                <Input
                  name="email"
                  label="Official Email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@hospital.com"
                  icon={<HiMail className="text-xs" />}
                />
                <Input
                  name="phone"
                  label="Contact Number"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 99999 88888"
                  icon={<HiPhone className="text-xs" />}
                />
                <Input
                  name="address"
                  label="Physical Address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Medical Way, NY"
                  icon={<HiLocationMarker className="text-xs" />}
                />
              </Section>

              <hr className="border-slate-100" />

              {/* TWILIO CONFIG SECTION */}
              <Section
                icon={<HiChatAlt2 className="w-4 h-4" />}
                title="Twilio Configuration"
              >
                <div className="md:col-span-2 bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-slate-50/80">
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Automated Rx Notifications
                    </p>
                    <p className="text-[11px] text-slate-450 mt-0.5 font-medium leading-relaxed">
                      Allow system to send digital prescriptions via Twilio SMS/WhatsApp
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isEnabled"
                      checked={form.isEnabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                <Input
                  name="twilioSid"
                  label="Twilio Account SID"
                  value={form.twilioSid}
                  onChange={handleChange}
                  placeholder="ACxxxxxxxxxxxxxx"
                  icon={<HiKey className="text-xs" />}
                />
                <Input
                  name="twilioToken"
                  label="Twilio Auth Token"
                  type="password"
                  value={form.twilioToken}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<HiLockClosed className="text-xs" />}
                />
                <Input
                  name="whatsappNumber"
                  label="WhatsApp Sender No."
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+14155238886"
                  icon={<HiPhone className="text-xs" />}
                />
                <Input
                  name="smsNumber"
                  label="SMS Sender No."
                  value={form.smsNumber}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  icon={<HiPhone className="text-xs" />}
                />
              </Section>

              <hr className="border-slate-100" />

              {/* ADMIN INFO SECTION */}
              <Section
                icon={<HiUser className="w-4 h-4" />}
                title="Administrator Setup"
              >
                <Input
                  name="adminName"
                  label="Full Name"
                  value={form.adminName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  icon={<HiUser className="text-xs" />}
                />
                <Input
                  name="adminEmail"
                  label="Admin Login Email"
                  value={form.adminEmail}
                  onChange={handleChange}
                  placeholder="john.doe@hospital.com"
                  icon={<HiMail className="text-xs" />}
                />
                <div className="md:col-span-2">
                  <Input
                    name="adminPassword"
                    label="Secure Password"
                    type="password"
                    value={form.adminPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<HiLockClosed className="text-xs" />}
                  />
                </div>
              </Section>

              {/* ACTION BUTTON */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full relative overflow-hidden py-3 rounded-lg text-white font-bold text-xs tracking-wider uppercase transition-all duration-150 shadow-sm ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed shadow-none"
                    : "bg-teal-600 hover:bg-teal-700 shadow-teal-50"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering facility...
                    </>
                  ) : (
                    "Register Hospital"
                  )}
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* SIDEBAR STATUS */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {hospitalCode ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-md sticky top-8"
                >
                  <div className="text-center relative z-10">
                    <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <HiCheckCircle className="w-7 h-7 text-teal-400" />
                    </div>
                    <h3 className="text-base font-extrabold mb-1.5 tracking-tight">
                      Onboarding Success
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mb-5 leading-relaxed">
                      The facility access credentials and administrator user have been successfully provisioned.
                    </p>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg py-4 px-3">
                      <span className="block text-[9px] uppercase text-slate-500 mb-1 font-bold tracking-widest">
                        Access Code
                      </span>
                      <span className="text-xl font-mono font-black tracking-wider text-teal-400 select-all">
                        {hospitalCode}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-2.5 font-semibold leading-relaxed">
                        Share this code with the administrator. They will use it to log in and configure their staff profile.
                      </p>
                    </div>
                    <button
                      onClick={() => setHospitalCode("")}
                      className="mt-5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                    >
                      Onboard Another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div
                  key="waiting"
                  className="bg-white border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] sticky top-8"
                >
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mb-4 text-slate-400">
                    <HiShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-slate-700 font-bold text-xs tracking-wide uppercase">
                    Awaiting Onboarding
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-2 max-w-[180px] leading-relaxed font-semibold">
                    Submit the onboarding form to generate access credentials for the new hospital.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="mb-2">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
      <span className="text-teal-650 text-base flex-shrink-0">{icon}</span>
      <h2 className="text-xs font-bold text-slate-850 tracking-wider uppercase">
        {title}
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-650 transition-colors">
          {icon}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${
          icon ? "pl-9" : "px-3.5"
        } pr-3.5 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all duration-150 text-slate-700 font-semibold text-xs`}
      />
    </div>
  </div>
);

export default CreateHospital;