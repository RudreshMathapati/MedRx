import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  FaPlus, FaTrash, FaFileMedical, FaUserCircle, 
  FaCalendarAlt, FaChevronLeft, FaRobot, FaShieldAlt 
} from "react-icons/fa";
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
  const [suggestions, setSuggestions] = useState({ diagnosis: "", medicines: [] });

  // Initialize with ONE medicine row
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
      
      // Calculate dynamic clinical AI suggestions based on incoming symptoms
      const symps = res.data.symptoms || "";
      setSuggestions(getSuggestions(symps));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load patient details");
    }
  };

  const getSuggestions = (symptoms = "") => {
    const cleanSym = symptoms.toLowerCase();
    if (cleanSym.includes("fever") || cleanSym.includes("temp") || cleanSym.includes("cold")) {
      return {
        diagnosis: "Acute Pyrexia (Viral Fever)",
        medicines: [
          { name: "Paracetamol 500mg", morning: "1", afternoon: "0", night: "1", days: "5", food: "After Food" },
          { name: "Phenylephrine 10mg", morning: "1", afternoon: "0", night: "1", days: "3", food: "After Food" }
        ]
      };
    }
    if (cleanSym.includes("cough") || cleanSym.includes("throat") || cleanSym.includes("respiratory")) {
      return {
        diagnosis: "Upper Respiratory Infection (URTI)",
        medicines: [
          { name: "Azithromycin 500mg", morning: "1", afternoon: "0", night: "0", days: "5", food: "Before Food" },
          { name: "Dextromethorphan Syrup", morning: "1", afternoon: "1", night: "1", days: "5", food: "After Food" }
        ]
      };
    }
    if (cleanSym.includes("pain") || cleanSym.includes("ache") || cleanSym.includes("headache")) {
      return {
        diagnosis: "Mild Tension Headache / Musculoskeletal Pain",
        medicines: [
          { name: "Ibuprofen 400mg", morning: "1", afternoon: "0", night: "1", days: "3", food: "After Food" }
        ]
      };
    }
    return {
      diagnosis: "General Fatigue & Malaise",
      medicines: [
        { name: "Multivitamin Tabs", morning: "0", afternoon: "0", night: "1", days: "30", food: "After Food" }
      ]
    };
  };

  const applySuggestedMed = (med) => {
    // If the only medicine row is empty, overwrite it
    if (medicines.length === 1 && medicines[0].name.trim() === "") {
      setMedicines([
        { name: med.name, morning: med.morning, afternoon: med.afternoon, night: med.night, days: med.days, food: med.food }
      ]);
    } else {
      // Append a new row
      setMedicines([
        ...medicines,
        { name: med.name, morning: med.morning, afternoon: med.afternoon, night: med.night, days: med.days, food: med.food }
      ]);
    }
    toast.info(`AI Added: ${med.name}`);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", morning: "", afternoon: "", night: "", days: "", food: "After Food" },
    ]);
  };

  const removeMedicine = (index) => {
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

  const savePrescription = async () => {
  const filteredMeds = medicines.filter(
    (m) => m.name.trim() !== ""
  );

  if (!diagnosis.trim()) {
    toast.error("Please add a Diagnosis");
    return;
  }

  if (filteredMeds.length === 0) {
    toast.error(
      "Please add at least one valid Medication"
    );
    return;
  }

  setLoading(true);

  try {
    const response = await API.post(
  "/prescriptions/create",
  {
    patientId,
    diagnosis,
    medicines: filteredMeds,
    tests,
    advice,
    nextVisit,
    hospitalId: patient.hospitalId,
  }
);

const res = response.data;

    if (
      res?.sentinelVerdict ===
      "TERMINATE_SESSION"
    ) {
      toast.error(
        "Security violation detected. Please login again."
      );

      localStorage.clear();

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

      return;
    }

    if (
      res?.sentinelVerdict ===
      "BLOCK"
    ) {
      toast.error(
        "Prescription blocked by security policy."
      );

      return;
    }

    const prescriptionId =
      res.prescriptionId;

    try {
      await API.post(
  "/notifications/send-rx",
  {
    patientPhone: patient.phone,
    patientName: patient.name,
    prescriptionId,
    hospitalId: patient.hospitalId,
  }
);
    } catch (err) {
      console.warn(
        "SMS/WhatsApp notifications not configured",
        err
      );
    }

    toast.success(
      "Prescription successfully saved and sent! 🚀"
    );

    setTimeout(() => {
      navigate("/doctor");
    }, 1500);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Error saving prescription"
    );

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
            <FaChevronLeft size={12} /> Back to Dashboard
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
        
        {/* CLINICAL RX WORKSPACE */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* PATIENT VITALS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm flex items-start gap-5"
          >
            <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center text-blue-500 text-2xl shrink-0">
              <FaUserCircle />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                <h2 className="text-xl font-extrabold text-slate-800">{patient.name}</h2>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {patient.age} Y • {patient.gender || 'Unspecified'}
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
              className="w-full border border-slate-100 bg-slate-50/50 p-4 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none min-h-[100px] text-slate-700 font-bold placeholder:text-slate-300 transition-all"
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
              <button onClick={addMedicine} className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2">
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
                    className="bg-slate-50/50 p-4 rounded-2xl relative border border-slate-100/50 hover:border-blue-200 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Medicine Name</label>
                        <input
                          placeholder="e.g. Azithromycin 500"
                          value={med.name}
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 text-sm font-bold text-slate-700"
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
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold outline-none text-slate-700"
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

        {/* CLINICAL SIDEBAR */}
        <div className="space-y-6">
          
          {/* AI RX CO-PILOT CARD */}
          <SectionCard title="Rx AI Co-Pilot" icon={<FaRobot className="text-blue-500 animate-pulse" />}>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute right-0 top-0 text-white/5 text-6xl font-black translate-x-3 -translate-y-3 select-none">AI</div>
                <p className="text-[9px] text-blue-300 font-bold uppercase tracking-widest mb-1">Queue Symptom Analysis</p>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold italic">
                  "{patient.symptoms || 'General wellness review'}"
                </p>
              </div>

              {suggestions.diagnosis && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Suggested Diagnosis</p>
                  <button
                    type="button"
                    onClick={() => {
                      setDiagnosis(suggestions.diagnosis);
                      toast.success("Applied diagnostic autocomplete");
                    }}
                    className="w-full text-left p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-2xl transition-all active:scale-98 flex items-center justify-between group"
                  >
                    <span className="truncate">🩺 {suggestions.diagnosis}</span>
                    <span className="text-[9px] uppercase font-black tracking-widest bg-emerald-600 group-hover:bg-emerald-700 text-white px-2 py-0.5 rounded shrink-0">AutoFill</span>
                  </button>
                </div>
              )}

              {suggestions.medicines.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Prescriptions</p>
                  <div className="space-y-2">
                    {suggestions.medicines.map((m, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => applySuggestedMed(m)}
                        className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-bold rounded-2xl transition-all active:scale-98 flex items-center justify-between group"
                      >
                        <span className="truncate">💊 {m.name} ({m.morning}-{m.afternoon}-{m.night})</span>
                        <span className="text-[9px] uppercase font-black tracking-widest bg-blue-600 group-hover:bg-blue-700 text-white px-2 py-0.5 rounded shrink-0">Load</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 items-center text-[10px] text-blue-200 bg-blue-500/10 p-3.5 rounded-2xl border border-blue-500/15">
                <FaShieldAlt className="shrink-0 text-blue-400" />
                <span>Validate suggestions against patient status.</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Lab Investigations" icon={<span className="text-blue-500">🧪</span>}>
            <input
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-slate-100 focus:border-blue-500 focus:bg-white text-sm font-bold transition-all text-slate-700"
              placeholder="e.g. CBC, Chest X-Ray..."
              value={tests}
              onChange={(e) => setTests(e.target.value)}
            />
          </SectionCard>

          <SectionCard title="Doctor's Advice" icon={<span className="text-amber-500">📝</span>}>
            <textarea
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-slate-100 focus:border-blue-500 focus:bg-white text-sm font-bold min-h-[100px] transition-all text-slate-700"
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
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-slate-100 focus:border-blue-500 focus:bg-white text-sm font-black cursor-pointer text-center text-slate-700"
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
    className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
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
    <p className={`text-sm sm:text-base font-black tracking-tight ${color}`}>
      {value} <span className="text-[10px] opacity-60 ml-0.5 font-bold">{unit}</span>
    </p>
  </div>
);

const DosageInput = ({ label, value, onChange }) => (
  <div>
    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block text-center tracking-tighter">{label}</label>
    <input
      placeholder="0"
      value={value}
      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-center text-sm font-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
      onChange={onChange}
    />
  </div>
);

export default WriteRX;