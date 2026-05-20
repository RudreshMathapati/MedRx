import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaFilePrescription,
  FaUserInjured,
  FaChevronRight,
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/doctor/dashboard");
      setStats(res.data.stats);
      setPatients(res.data.patients || []);
      setCompletedPatients(res.data.completedPatients || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Dashboard <span className="ml-2">👨‍⚕️</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back! You have <span className="text-blue-600">{stats.pendingPatients} patients</span> waiting in queue.
          </p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold border border-blue-100">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Today's Total" value={stats.todayPatients} icon={<FaUsers />} color="from-blue-600 to-indigo-700" delay={0} />
        <StatCard title="Pending Queue" value={stats.pendingPatients} icon={<FaClock />} color="from-yellow-200 to-yellow-900" delay={0.1} />
        <StatCard title="Treated Today" value={stats.completedPatients} icon={<FaCheckCircle />} color="from-emerald-500 to-teal-700" delay={0.2} />
        <StatCard title="Prescriptions" value={stats.prescriptions} icon={<FaFilePrescription />} color="from-violet-500 to-purple-700" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* PATIENT QUEUE */}
        <Section title="Live Patient Queue" icon={<FaUserInjured className="text-orange-500" />}>
          <ResponsiveTable>
            <thead>
              <tr className="bg-slate-50">
                <Th>Patient Name</Th>
                <Th>Symptoms</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {patients.length === 0 ? (
                  <EmptyRow message="No patients waiting in the queue." />
                ) : (
                  patients.map((p, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={p._id}
                      className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group"
                    >
                      <Td className="font-bold text-slate-700">{p.name}</Td>
                      <Td className="text-slate-500 italic max-w-[200px] truncate">{p.symptoms}</Td>
                      <Td>
                        <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                          {p.status}
                        </span>
                      </Td>
                      <Td className="text-right">
                        <button
                          onClick={() => navigate(`/write-rx?patientId=${p._id}`)}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-200 hover:-translate-y-0.5"
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

        {/* COMPLETED PATIENTS */}
        <Section title="Recent Consultations" icon={<FaCheckCircle className="text-emerald-500" />}>
          <ResponsiveTable>
            <thead>
              <tr className="bg-slate-50">
                <Th>Patient Name</Th>
                <Th>Contact</Th>
                <Th>Date</Th>
                <Th>Result</Th>
              </tr>
            </thead>
            <tbody>
              {completedPatients.length === 0 ? (
                <EmptyRow message="No consultations completed today." />
              ) : (
                completedPatients.map((p) => (
                  <tr key={p._id} className="border-b border-slate-50 hover:bg-emerald-50/30 transition-colors">
                    <Td className="font-semibold text-slate-700">{p.name}</Td>
                    <Td className="text-slate-500 text-xs">{p.phone}</Td>
                    <Td className="text-slate-400 text-xs">
                      {new Date(p.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Td>
                    <Td>
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 uppercase">
                        Finished
                      </span>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </ResponsiveTable>
        </Section>
      </div>
    </DashboardLayout>
  );
};

/* UI COMPONENTS */

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className={`relative overflow-hidden bg-gradient-to-br ${color} text-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/10 group`}
  >
    <div className="relative z-10">
      <div className="text-3xl mb-4 bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h2 className="text-white/70 text-xs font-bold uppercase tracking-widest">{title}</h2>
      <p className="text-4xl font-black mt-1">{value}</p>
    </div>
    {/* Decorative circle */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
  </motion.div>
);

const Section = ({ title, children, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden flex flex-col h-full"
  >
    <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
      {icon}
      <h2 className="text-lg font-black text-slate-800 tracking-tight">
        {title}
      </h2>
    </div>
    <div className="p-4 flex-grow">{children}</div>
  </motion.div>
);

const ResponsiveTable = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">{children}</table>
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
    <td colSpan="5" className="py-20">
      <div className="flex flex-col items-center justify-center opacity-30">
        <FaUserInjured className="text-5xl mb-3" />
        <p className="font-bold text-sm">{message}</p>
      </div>
    </td>
  </tr>
);

export default DoctorDashboard;