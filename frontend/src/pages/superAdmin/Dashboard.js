import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaHospital,
  FaUserMd,
  FaUsers,
  FaFilePrescription,
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import {
  HiOfficeBuilding,
  HiDocumentText,
  HiPlusCircle,
  HiViewGrid,
  HiUserGroup,
} from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, hospitalsRes, archivedRes, requestsRes] = await Promise.all([
        API.get("/superadmin/stats"),
        API.get("/superadmin/hospitals"),
        API.get("/superadmin/archived-hospitals"),
        API.get("/hospital-requests"),
      ]);
      setStats(statsRes.data);
      setHospitals(hospitalsRes.data);
      setArchivedCount(archivedRes.data.length);
      setPendingCount((requestsRes.data || []).length);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const statCards = [
    {
      title: "Hospitals",
      value: stats.hospitals,
      icon: <FaHospital className="text-teal-600 text-sm" />,
      bgColor: "bg-teal-50 border-teal-100",
    },
    {
      title: "Active Doctors",
      value: stats.doctors,
      icon: <FaUserMd className="text-blue-600 text-sm" />,
      bgColor: "bg-blue-50 border-blue-100",
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: <FaUsers className="text-slate-600 text-sm" />,
      bgColor: "bg-slate-50 border-slate-100",
    },
    {
      title: "Prescriptions",
      value: stats.prescriptions,
      icon: <FaFilePrescription className="text-zinc-650 text-sm" />,
      bgColor: "bg-zinc-150 border-zinc-200/70",
    },
  ];

  const quickActions = [
    {
      title: "Hospitals",
      desc: `${hospitals.length} active · ${archivedCount} archived`,
      icon: <HiOfficeBuilding className="text-lg text-teal-600" />,
      accentColor: "border-slate-200 hover:border-teal-500",
      route: "/super-admin/hospitals",
    },
    {
      title: "Pending Requests",
      desc: pendingCount > 0 ? `${pendingCount} pending review` : "All requests actioned",
      icon: <HiDocumentText className="text-lg text-amber-600" />,
      accentColor: "border-slate-200 hover:border-amber-500",
      route: "/super-admin/hospital-requests",
      badge: pendingCount,
    },
    {
      title: "New Hospital",
      desc: "Add a healthcare facility",
      icon: <HiPlusCircle className="text-lg text-emerald-600" />,
      accentColor: "border-slate-200 hover:border-emerald-500",
      route: "/create-hospital",
    },
    {
      title: "Doctor Log",
      desc: "Global practitioner log",
      icon: <HiUserGroup className="text-lg text-blue-600" />,
      accentColor: "border-slate-200 hover:border-blue-500",
      route: "/doctor-requests",
    },
  ];

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* ── HERO HEADER ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-2xl mb-8 p-6 md:p-8 relative overflow-hidden shadow-sm"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-2 text-slate-400">
            <HiViewGrid className="text-slate-400 text-xs" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Administration
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium max-w-lg">
            Monitor system-wide metrics and manage the healthcare network database.
          </p>
        </div>
      </motion.div>

      {/* ── STAT CARDS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ title, value, icon, bgColor }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {title}
              </p>
              <p className="text-2xl font-black text-slate-850 mt-1">{value ?? 0}</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${bgColor}`}>
              {icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</h2>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ title, desc, icon, accentColor, route, badge }, i) => (
            <button
              key={title}
              onClick={() => navigate(route)}
              className={`relative bg-white rounded-xl p-5 border text-left transition-all duration-150 shadow-sm hover:shadow-md group overflow-hidden ${accentColor}`}
            >
              {badge > 0 && (
                <span className="absolute top-3 right-3 w-4 h-4 bg-teal-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
              <div className="mb-4">
                {icon}
              </div>
              <p className="font-bold text-slate-800 text-sm leading-tight">{title}</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{desc}</p>
              <FaArrowRight className="absolute bottom-5 right-5 text-slate-350 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
            </button>
          ))}
        </div>
      </div>

      {/* ── RECENT HOSPITALS ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Hospitals</h2>
            <div className="h-px w-16 bg-slate-100" />
          </div>
          <button
            onClick={() => navigate("/super-admin/hospitals")}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors group"
          >
            View All
            <FaArrowRight className="text-[9px] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {hospitals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <FaHospital size={48} className="mb-3 opacity-20" />
              <p className="font-bold text-slate-400">No hospitals registered yet</p>
              <button
                onClick={() => navigate("/create-hospital")}
                className="mt-4 px-5 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors"
              >
                Onboard First Hospital
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Access Code
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hospitals.slice(0, 5).map((h, i) => (
                    <motion.tr
                      key={h._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.04 }}
                      className="hover:bg-slate-50/40 transition-colors group"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                            <HiOfficeBuilding className="text-slate-400 text-sm" />
                          </div>
                          <p className="font-bold text-slate-700 text-xs">{h.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 max-w-[200px]">
                          <FaMapMarkerAlt className="flex-shrink-0" />
                          <span className="truncate">{h.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <FaPhone className="flex-shrink-0" />
                          <span>{h.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-teal-700 text-xs bg-teal-50 px-2 py-0.5 rounded border border-teal-100/60">
                            {h.hospitalCode}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
