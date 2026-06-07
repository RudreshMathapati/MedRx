import React, { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaSms,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiOutlineKey, HiOutlinePhone } from "react-icons/hi";

const TwilioSettings = () => {
  const [form, setForm] = useState({
    twilioSid: "",
    twilioToken: "",
    whatsappNumber: "",
    smsNumber: "",
    isEnabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing settings
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await API.get("/hospitals/my-hospital");
        const h = res.data;
        setForm({
          twilioSid: h.twilioSid || "",
          twilioToken: h.twilioToken || "",
          whatsappNumber: h.whatsappNumber || "",
          smsNumber: h.smsNumber || "",
          isEnabled: h.isEnabled || false,
        });
      } catch (err) {
        toast.error("Failed to load hospital settings.");
      } finally {
        setFetching(false);
      }
    };
    fetchHospital();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleEnabled = () => {
    setForm((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const handleSave = async () => {
    if (form.isEnabled && (!form.twilioSid || !form.twilioToken || !form.whatsappNumber)) {
      toast.error("Please fill in your Twilio SID, Auth Token, and WhatsApp Number before enabling.");
      return;
    }
    try {
      setLoading(true);
      await API.put("/hospitals/twilio-settings", form);
      toast.success("Twilio settings saved successfully! 🚀");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <FaWhatsapp className="text-emerald-500" />
          WhatsApp & SMS Settings
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Configure your Twilio credentials to automatically send prescription links to patients.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* STATUS BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-4 p-5 rounded-2xl border ${
            form.isEnabled
              ? "bg-emerald-50 border-emerald-100"
              : "bg-amber-50 border-amber-100"
          }`}
        >
          {form.isEnabled ? (
            <FaCheckCircle className="text-emerald-500 text-2xl shrink-0" />
          ) : (
            <FaExclamationTriangle className="text-amber-500 text-2xl shrink-0" />
          )}
          <div className="flex-1">
            <p className={`font-extrabold text-sm ${form.isEnabled ? "text-emerald-700" : "text-amber-700"}`}>
              Notifications are currently {form.isEnabled ? "ENABLED" : "DISABLED"}
            </p>
            <p className={`text-xs font-medium mt-0.5 ${form.isEnabled ? "text-emerald-600" : "text-amber-600"}`}>
              {form.isEnabled
                ? "Patients will receive WhatsApp and SMS messages when their Rx is ready."
                : "Enable notifications below to start sending prescription alerts to patients."}
            </p>
          </div>
          <button
            onClick={toggleEnabled}
            className="text-3xl transition-all"
            title="Toggle Notifications"
          >
            {form.isEnabled ? (
              <FaToggleOn className="text-emerald-500" />
            ) : (
              <FaToggleOff className="text-slate-400" />
            )}
          </button>
        </motion.div>

        {/* TWILIO CREDENTIALS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <HiOutlineKey className="text-indigo-500 text-xl" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest">Twilio API Credentials</h2>
              <p className="text-xs text-slate-400 mt-0.5">Found in your Twilio Console → Account Info</p>
            </div>
          </div>

          <Field
            label="Twilio Account SID"
            name="twilioSid"
            value={form.twilioSid}
            onChange={handleChange}
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <Field
            label="Twilio Auth Token"
            name="twilioToken"
            value={form.twilioToken}
            onChange={handleChange}
            placeholder="your_auth_token_here"
            type="password"
          />
        </motion.div>

        {/* PHONE NUMBERS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <HiOutlinePhone className="text-emerald-500 text-xl" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest">Sender Phone Numbers</h2>
              <p className="text-xs text-slate-400 mt-0.5">From your Twilio WhatsApp Sandbox or approved sender</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Field
                label={<><FaWhatsapp className="inline text-emerald-500 mr-1.5" />WhatsApp Number</>}
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="+14155238886"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1 font-semibold">
                Use the Twilio sandbox number (e.g. +14155238886) or your approved business sender.
              </p>
            </div>
            <div>
              <Field
                label={<><FaSms className="inline text-blue-500 mr-1.5" />SMS Number (Optional)</>}
                name="smsNumber"
                value={form.smsNumber}
                onChange={handleChange}
                placeholder="+15674052333"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1 font-semibold">
                Leave blank if you only want WhatsApp messages.
              </p>
            </div>
          </div>
        </motion.div>

        {/* SANDBOX INSTRUCTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-indigo-950 text-white rounded-[2rem] p-6"
        >
          <p className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-3">
            📱 WhatsApp Sandbox Setup (Required for Testing)
          </p>
          <p className="text-sm text-indigo-100 leading-relaxed">
            To receive WhatsApp messages via Twilio sandbox, the patient's phone number must first
            opt-in. Ask patients to send: <br />
            <span className="font-black text-white bg-white/10 px-2 py-1 rounded-lg inline-block mt-2">
              join &lt;your-sandbox-keyword&gt;
            </span>
            <br />
            <span className="text-indigo-300 text-xs mt-2 block">
              to <strong className="text-white">+1 415 523 8886</strong> on WhatsApp. Once joined, they will receive all Rx notifications.
            </span>
          </p>
        </motion.div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-5 rounded-[2.5rem] text-lg font-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
            loading
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><FaSave /> Save Notification Settings</>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
    />
  </div>
);

export default TwilioSettings;
