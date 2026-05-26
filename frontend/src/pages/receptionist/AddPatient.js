import React, { useEffect, useState } from "react";
import API from "../../services/api";
import socket from "../../utils/socket";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaUserPlus, FaStethoscope, FaHeartbeat, FaUserMd } from "react-icons/fa";

const AddPatient = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialState = {
    name: "",
    phone: "",
    age: "",
    gender: "",
    temperature: "",
    bp: "",
    weight: "",
    pulse: "",
    symptoms: "",
    doctorId: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    fetchDoctors();

    // Connect to WebSocket server & join hospital channel
    socket.connect();
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr);
        if (user.hospitalId) {
          socket.joinHospital(user.hospitalId);
        }
      } catch (e) {
        console.error("AddPatient failed to parse user hospitalId:", e);
      }
    }
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/users/doctors-by-hospital");
      setDoctors(res.data);
    } catch (error) {
      console.error("Fetch doctors failed:", error);
      toast.error("Could not load doctors list");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!form.name || !form.phone || !form.age || !form.doctorId) {
      toast.error("Required fields: Name, Phone, Age, and Assigned Doctor");
      return;
    }

    try {
      setLoading(true);
      await API.post("/patients/add", form);
      
      toast.success("Patient registered and added to clinic queue! 🎉");
      setForm(initialState); // Clear form after success
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error adding patient";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          Register Patient <FaUserPlus className="text-blue-600 animate-bounce" />
        </h1>
        <p className="text-slate-500 font-medium">
          Enter patient details to initiate the clinic queue. The doctor will see this immediately.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PERSONAL INFO */}
          <SectionCard title="Personal Details" icon={<FaUserPlus className="text-blue-500" />}>
            <Input name="name" label="Full Name *" value={form.name} onChange={handleChange} placeholder="John Doe" />
            <Input name="phone" label="Phone Number *" type="tel" value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="age" label="Age *" type="number" value={form.age} onChange={handleChange} placeholder="25" />
              <Select name="gender" label="Gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </SectionCard>

          {/* VITALS */}
          <SectionCard title="Patient Vitals" icon={<FaHeartbeat className="text-rose-500" />}>
            <Input name="temperature" label="Temp (°F)" value={form.temperature} onChange={handleChange} placeholder="e.g. 98.6" />
            <Input name="bp" label="BP (sys/dia)" value={form.bp} onChange={handleChange} placeholder="e.g. 120/80" />
            <Input name="weight" label="Weight (kg)" value={form.weight} onChange={handleChange} placeholder="e.g. 70" />
            <Input name="pulse" label="Pulse (bpm)" value={form.pulse} onChange={handleChange} placeholder="e.g. 72" />
          </SectionCard>

          {/* CLINICAL INFO */}
          <SectionCard title="Clinical Context" icon={<FaStethoscope className="text-amber-500" />}>
            <div className="col-span-full">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Symptoms</label>
              <textarea
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                placeholder="Describe patient complaints (e.g. fever for 2 days, dry cough)..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 min-h-[100px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </SectionCard>

          {/* ASSIGNMENT */}
          <SectionCard title="Assign Consultant" icon={<FaUserMd className="text-indigo-500" />}>
            <div className="col-span-full">
              <Select 
                name="doctorId" 
                label="Select Doctor *" 
                value={form.doctorId} 
                onChange={handleChange}
              >
                <option value="">Choose a consultant...</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} — {doc.specialization}
                  </option>
                ))}
              </Select>
            </div>
          </SectionCard>

          {/* SUBMIT BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[2.5rem] text-lg font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Register & Add to Clinic Queue"
              )}
            </button>
            <button
              type="button"
              onClick={() => setForm(initialState)}
              className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-[2.5rem] transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

/* REUSABLE SUB-COMPONENTS */

const SectionCard = ({ title, children, icon }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
    />
  </div>
);

const Select = ({ label, name, value, onChange, children }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default AddPatient;