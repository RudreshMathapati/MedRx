import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaTrash, FaFileMedical, FaUserCircle, FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

const WriteRX = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientId = new URLSearchParams(location.search).get("patientId");

  // States
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState("");
  const [advice, setAdvice] = useState("");
  const [nextVisit, setNextVisit] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Initialize with ONE mandatory medicine row
  const [medicines, setMedicines] = useState([
    { name: "", morning: "", afternoon: "", night: "", days: "", food: "After Food" },
  ]);

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    } else {
      toast.error("No Patient ID provided");
    }
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const res = await API.get(`/patients/${patientId}`);
      setPatient(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load patient details");
    }
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", morning: "", afternoon: "", night: "", days: "", food: "After Food" },
    ]);
  };

  const removeMedicine = (index) => {
    // Prevent removing the last medicine row
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    } else {
      toast.warning("At least one medicine is required");
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // Inside WriteRX.jsx

const savePrescription = async () => {
  // ... existing validations (Diagnosis and Medicines)

  setLoading(true);
  try {
    // 1. Send the prescription data to save it
    const res = await API.post("/prescriptions/create", {
      patientId,
      diagnosis,
      medicines: medicines.filter(m => m.name.trim() !== ""),
      tests,
      advice,
      nextVisit,
      // Pass hospitalId so backend knows which hospital this Rx belongs to
      hospitalId: patient.hospitalId 
    });

    const prescriptionId = res.data._id;

    // 2. TRIGGER NOTIFICATION (Multi-Hospital Aware)
    // We call a separate endpoint to handle the Twilio/WhatsApp logic
    await API.post("/notifications/send-rx", {
      patientPhone: patient.phone, // Ensure your patient model has a 'phone' field
      patientName: patient.name,
      prescriptionId: prescriptionId,
      hospitalId: patient.hospitalId // Backend uses this to fetch Twilio SID/Token
    });
    
    toast.success("Prescription saved and sent via WhatsApp! 🚀");
    
    setTimeout(() => navigate("/patients"), 2000);
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Error saving prescription");
  } finally {
    setLoading(false);
  }
};

  if (!patient) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
        <p className="text-slate-400 font-medium">Loading Patient Record...</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-2 font-bold text-sm"
          >
            <FaChevronLeft size={12} /> Back to List
          </button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Digital Prescription <span className="text-blue-600 font-serif italic text-4xl">Rx</span>
          </h1>
        </div>
        <div className="flex gap-3">
            <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold text-sm shadow-sm">
                ID: {patientId?.slice(-6).toUpperCase()}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          
          {/* PATIENT VITALS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-blue-50 p-6 rounded-[2rem] shadow-sm flex items-start gap-5"
          >
            <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center text-blue-500 text-2xl">
                <FaUserCircle />
            </div>
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                    <h2 className="text-xl font-extrabold text-slate-800">{patient.name}</h2>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {patient.age} Y • {patient.gender || 'Male'}
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <Vital label="BP" value={patient.bp || '120/80'} unit="mmHg" color="text-rose-500" />
                    <Vital label="Temp" value={patient.temperature || '98.6'} unit="°F" color="text-orange-500" />
                    <Vital label="Weight" value={patient.weight || '70'} unit="kg" color="text-emerald-500" />
                    <Vital label="Symptoms" value={patient.symptoms || 'General'} color="text-blue-500 underline decoration-blue-200 underline-offset-4" />
                </div>
            </div>
          </motion.div>

          {/* DIAGNOSIS SECTION */}
          <SectionCard title="Clinical Diagnosis" icon={<FaFileMedical className="text-blue-500" />}>
            <textarea
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none min-h-[100px] text-slate-700 font-bold placeholder:text-slate-300 transition-all"
              placeholder="e.g. Acute Respiratory Infection..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </SectionCard>

          {/* MEDICINES SECTION */}
          <SectionCard 
            title="Medications" 
            icon={<span className="text-emerald-500">💊</span>}
            action={
              <button onClick={addMedicine} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-all flex items-center gap-2">
                <FaPlus /> Add Medicine
              </button>
            }
          >
            <div className="space-y-4">
              <AnimatePresence>
                {medicines.map((med, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-50 p-4 rounded-2xl relative border border-transparent hover:border-blue-200 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Medicine Name</label>
                        <input
                          placeholder="e.g. Azithromycin 500"
                          value={med.name}
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 text-sm font-bold"
                          onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-5 grid grid-cols-4 gap-2">
                        <DosageInput label="M" value={med.morning} onChange={(e) => handleMedicineChange(index, "morning", e.target.value)} />
                        <DosageInput label="A" value={med.afternoon} onChange={(e) => handleMedicineChange(index, "afternoon", e.target.value)} />
                        <DosageInput label="N" value={med.night} onChange={(e) => handleMedicineChange(index, "night", e.target.value)} />
                        <DosageInput label="Days" value={med.days} onChange={(e) => handleMedicineChange(index, "days", e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Timing</label>
                        <select 
                          value={med.food}
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold outline-none"
                          onChange={(e) => handleMedicineChange(index, "food", e.target.value)}
                        >
                          <option>After Food</option>
                          <option>Before Food</option>
                          <option>Empty Stomach</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 flex items-end justify-end">
                        <button 
                          onClick={() => removeMedicine(index)} 
                          className={`w-10 h-10 rounded-xl transition flex items-center justify-center ${medicines.length > 1 ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SectionCard>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <SectionCard title="Lab Investigations" icon={<span className="text-blue-500">🧪</span>}>
            <input
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-slate-50 focus:border-blue-500 focus:bg-white text-sm font-bold transition-all"
              placeholder="e.g. CBC, Chest X-Ray..."
              value={tests}
              onChange={(e) => setTests(e.target.value)}
            />
          </SectionCard>

          <SectionCard title="Doctor's Advice" icon={<span className="text-amber-500">📝</span>}>
            <textarea
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-slate-50 focus:border-blue-500 focus:bg-white text-sm font-bold min-h-[100px] transition-all"
              placeholder="e.g. Drink warm water, avoid cold food..."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </SectionCard>

          <SectionCard title="Next Appointment" icon={<FaCalendarAlt className="text-indigo-500" />}>
            <DatePicker
              selected={nextVisit}
              onChange={(date) => setNextVisit(date)}
              minDate={new Date()}
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-slate-50 focus:border-blue-500 focus:bg-white text-sm font-black cursor-pointer text-center"
            />
          </SectionCard>

          <button
            onClick={savePrescription}
            disabled={loading}
            className={`w-full py-5 rounded-[2.5rem] text-lg font-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
              loading ? "bg-slate-300 text-slate-500" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Save & Print Rx"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* REUSABLE UI COMPONENTS */

const SectionCard = ({ title, children, action, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
          {title}
        </h2>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
);

const Vital = ({ label, value, unit, color }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-base font-black tracking-tight ${color}`}>
      {value} <span className="text-[10px] opacity-60 ml-0.5">{unit}</span>
    </p>
  </div>
);

const DosageInput = ({ label, value, onChange }) => (
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block text-center tracking-tighter">{label}</label>
    <input
      placeholder="0"
      value={value}
      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-center text-sm font-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
      onChange={onChange}
    />
  </div>
);

export default WriteRX;