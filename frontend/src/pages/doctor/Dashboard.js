import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import socket from "../../utils/socket";
import { getVitalStatus } from "../../utils/triage";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaFilePrescription,
  FaUserInjured,
  FaChevronRight,
  FaRobot,
  FaShieldAlt,
  FaHeartbeat
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayPatients: 0,
    pendingPatients: 0,
    completedPatients: 0,
    prescriptions: 0,
  });

  const [patients, setPatients] = useState([]);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [aiInsight, setAiInsight] = useState({
    suggestedAlerts: "Allergy validation engine active. Multi-drug check enabled.",
    trend: "Standard patient volume detected. No acute epidemiological anomalies."
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();

    // 1. Establish connection and join hospital room
    socket.connect();
    
    // Auto-join room based on stored user
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr);
        if (user.hospitalId) {
          socket.joinHospital(user.hospitalId);
        }
      } catch (e) {
        console.error("Dashboard failed to parse user hospitalId:", e);
      }
    }

    // 2. Set up live socket listeners
    socket.on("QUEUE_UPDATED", (data) => {
      console.log("Queue update received via WebSockets, syncing dashboard...", data);
      fetchDashboard();
    });

    // Cleanup listeners
    return () => {
      socket.off("QUEUE_UPDATED");
    };
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/doctor/dashboard");
      setStats(res.data.stats);
      setPatients(res.data.patients || []);
      setCompletedPatients(res.data.completedPatients || []);
      
      // Auto-compute AI trends based on symptoms present in active queue
      if (res.data.patients && res.data.patients.length > 0) {
        const symptomsList = res.data.patients.map(p => (p.symptoms || "").toLowerCase());
        const hasFever = symptomsList.some(s => s.includes("fever") || s.includes("temperature") || s.includes("cold"));
        const hasPain = symptomsList.some(s => s.includes("pain") || s.includes("ache") || s.includes("headache"));
        
        let dynamicTrend = "Standard volume. Monitor normal vitals.";
        if (hasFever && hasPain) {
          dynamicTrend = "Elevated respiratory/seasonal symptoms noted in queue today.";
        } else if (hasFever) {
          dynamicTrend = "Slight uptick in pyrexia cases. Ensure fever protocols.";
        } else if (hasPain) {
          dynamicTrend = "High density of pain symptoms. Review analgesic options.";
        }

        setAiInsight({
          suggestedAlerts: `${res.data.patients.length} patients waiting. Review BP alerts for high risk cases.`,
          trend: dynamicTrend
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const VitalBadge = ({ type, value }) => {
    const { color, bg, status, indicator } = getVitalStatus(type, value);
    return (
      <span 
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${bg} ${color}`}
        title={`${type.toUpperCase()}: ${value || "Not recorded"} (${status})`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${indicator} shrink-0`} />
        {value || "—"}
      </span>
    );
  };

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Dashboard <span className="ml-2">👨‍⚕️</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back! You have <span className="text-blue-600 font-bold">{stats.pendingPatients} patients</span> waiting in queue.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 animate-pulse">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Live Sync Active
          </span>
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold border border-blue-100">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Today's Total" value={stats.todayPatients} icon={<FaUsers />} color="from-blue-600 to-indigo-700" delay={0} />
        <StatCard title="Pending Queue" value={stats.pendingPatients} icon={<FaClock />} color="from-amber-500 to-orange-600" delay={0.1} />
        <StatCard title="Treated Today" value={stats.completedPatients} icon={<FaCheckCircle />} color="from-emerald-500 to-teal-700" delay={0.2} />
        <StatCard title="Prescriptions" value={stats.prescriptions} icon={<FaFilePrescription />} color="from-violet-500 to-purple-700" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LIVE PATIENT QUEUE (Left/Main section - 2/3 width) */}
        <div className="xl:col-span-2 space-y-8">
          <Section title="Live Patient Queue" icon={<FaUserInjured className="text-orange-500" />}>
            <ResponsiveTable>
              <thead>
                <tr className="bg-slate-50">
                  <Th>Patient Name</Th>
                  <Th>Symptoms</Th>
                  <Th>Vitals (BP / Temp / Pulse)</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {patients.length === 0 ? (
                    <EmptyRow message="No patients waiting in the queue." />
                  ) : (
                    patients.map((p, idx) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={p._id}
                        className="border-b border-slate-50 hover:bg-blue-50/20 transition-colors group"
                      >
                        <Td>
                          <div className="font-bold text-slate-800">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{p.gender}, {p.age} Yrs</div>
                        </Td>
                        <Td className="text-slate-600 text-sm max-w-[150px] truncate" title={p.symptoms}>
                          {p.symptoms || <span className="text-slate-300 italic">None reported</span>}
                        </Td>
                        <Td>
                          <div className="flex flex-wrap gap-2">
                            <VitalBadge type="bp" value={p.bp} />
                            <VitalBadge type="temp" value={p.temperature} />
                            <VitalBadge type="pulse" value={p.pulse} />
                          </div>
                        </Td>
                        <Td className="text-right">
                          <button
                            onClick={() => navigate(`/write-rx?patientId=${p._id}`)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5"
                          >
                            Write RX <FaChevronRight className="text-[10px]" />
                          </button>
                        </Td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </ResponsiveTable>
          </Section>
        </div>

        {/* SIDEBAR WIDGETS (Right section - 1/3 width) */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* AI DIAGNOSTIC CO-PILOT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden border border-white/5"
          >
            {/* Background shape */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-blue-500/15 rounded-xl border border-blue-500/20">
                <FaRobot className="text-blue-400 text-xl animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold tracking-tight text-white text-base">Rx AI Co-Pilot</h3>
                <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Clinical Insight System</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Queue Health Insights</p>
                <p className="text-sm font-semibold text-slate-200">{aiInsight.suggestedAlerts}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Active Symptoms Trend</p>
                <p className="text-sm font-semibold text-slate-200">{aiInsight.trend}</p>
              </div>

              <div className="flex gap-2 items-center text-xs text-blue-200 bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                <FaShieldAlt className="shrink-0 text-blue-400" />
                <span className="font-medium">All clinical decisions must be manually validated.</span>
              </div>
            </div>
          </motion.div>

          {/* RECENT CONSULTATIONS */}
          <Section title="Recent Consultations" icon={<FaCheckCircle className="text-emerald-500" />}>
            <ResponsiveTable>
              <thead>
                <tr className="bg-slate-50">
                  <Th>Patient Name</Th>
                  <Th>Time</Th>
                  <Th className="text-right">Result</Th>
                </tr>
              </thead>
              <tbody>
                {completedPatients.length === 0 ? (
                  <EmptyRow message="No consultations completed today." />
                ) : (
                  completedPatients.slice(0, 4).map((p) => (
                    <tr key={p._id} className="border-b border-slate-50 hover:bg-emerald-50/10 transition-colors">
                      <Td className="font-bold text-slate-700">{p.name}</Td>
                      <Td className="text-slate-400 text-xs font-semibold">
                        {new Date(p.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Td>
                      <Td className="text-right">
                        <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-lg border border-emerald-100 uppercase">
                          Done
                        </span>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </ResponsiveTable>
          </Section>
        </div>

      </div>
    </DashboardLayout>
  );
};

/* --- UI COMPONENTS --- */

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className={`relative overflow-hidden bg-gradient-to-br ${color} text-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 group`}
  >
    <div className="relative z-10">
      <div className="text-3xl mb-4 bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h2 className="text-white/70 text-xs font-bold uppercase tracking-widest">{title}</h2>
      <p className="text-4xl font-black mt-1">{value}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
  </motion.div>
);

const Section = ({ title, children, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden flex flex-col h-full"
  >
    <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
      {icon}
      <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
        {title}
      </h2>
    </div>
    <div className="p-4 flex-grow">{children}</div>
  </motion.div>
);

const ResponsiveTable = ({ children }) => (
  <div className="overflow-x-auto custom-scrollbar">
    <table className="w-full text-left border-collapse min-w-[500px] xl:min-w-0">{children}</table>
  </div>
);

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-5 text-sm ${className}`}>{children}</td>
);

const EmptyRow = ({ message }) => (
  <tr>
    <td colSpan="5" className="py-14 text-center">
      <div className="flex flex-col items-center justify-center opacity-30">
        <FaUserInjured className="text-4xl mb-3 text-slate-500" />
        <p className="font-bold text-xs">{message}</p>
      </div>
    </td>
  </tr>
);

export default DoctorDashboard;