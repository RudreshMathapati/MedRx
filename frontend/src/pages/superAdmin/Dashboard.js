import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Add this import
import {
  FaHospital,
  FaUserMd,
  FaUsers,
  FaFilePrescription,
  FaTrash,
  FaUndo,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [archivedHospitals, setArchivedHospitals] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
const navigate = useNavigate(); // Initialize the hook
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, hospitalsRes, archivedRes, requestsRes] =
        await Promise.all([
          API.get("/superadmin/stats"),
          API.get("/superadmin/hospitals"),
          API.get("/superadmin/archived-hospitals"),
          API.get("/doctor-requests/all"),
        ]);

      setStats(statsRes.data);
      setHospitals(hospitalsRes.data);
      setArchivedHospitals(archivedRes.data);
      setDoctorRequests(requestsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const handleArchiveHospital = async (id) => {
    if (!window.confirm("Archive this hospital?")) return;
    await API.delete(`/superadmin/hospital/${id}`);
    fetchData();
  };

  const handleRestoreHospital = async (id) => {
    if (!window.confirm("Restore this hospital?")) return;
    await API.put(`/superadmin/restore-hospital/${id}`);
    fetchData();
  };

  const filteredHospitals = (
    tab === "active" ? hospitals : archivedHospitals
  ).filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Super Admin Dashboard <span className="ml-2">👑</span>
          </h1>
          <p className="text-gray-500 mt-1">
            System-wide overview and hospital management.
          </p>
        </div>

        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search hospitals..."
            className="pl-11 pr-4 py-3 w-full lg:w-80 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Hospitals"
          value={stats.hospitals}
          icon={<FaHospital />}
          color="from-blue-600 to-indigo-700"
          delay={0}
        />
        <StatCard
          title="Active Doctors"
          value={stats.doctors}
          icon={<FaUserMd />}
          color="from-emerald-500 to-teal-700"
          delay={0.1}
        />
        <StatCard
          title="Total Patients"
          value={stats.patients}
          icon={<FaUsers />}
          color="from-violet-500 to-purple-700"
          delay={0.2}
        />
        <StatCard
          title="Prescriptions"
          value={stats.prescriptions}
          icon={<FaFilePrescription />}
          color="from-orange-500 to-red-600"
          delay={0.3}
        />
      </div>

      {/* TABS CONTAINER */}
      <div className="bg-white p-1.5 inline-flex gap-2 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <Tab active={tab === "active"} onClick={() => setTab("active")}>
          Active Hospitals
        </Tab>
        <Tab active={tab === "archived"} onClick={() => setTab("archived")}>
          Archived List
        </Tab>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* HOSPITAL TABLE */}
        <div className="xl:col-span-2">
          <Section
            title={
              tab === "active" ? "Managed Hospitals" : "Archived Facilities"
            }
          >
            <Table>
              <thead>
                <tr className="bg-gray-50/50">
                  <Th>Hospital Name</Th>
                  <Th>Contact/Address</Th>
                  <Th>Access Code</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {filteredHospitals.length === 0 ? (
                    <Empty message="No matching hospitals found" />
                  ) : (
                    filteredHospitals.map((h) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={h._id}
                        className="group hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <Td>
                          <div className="font-bold text-gray-800">
                            {h.name}
                          </div>
                        </Td>
                        <Td>
                          <div className="text-xs text-gray-500 uppercase font-semibold">
                            {h.phone}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-[180px]">
                            {h.address}
                          </div>
                        </Td>
                        <Td>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-mono font-bold text-sm border border-blue-100">
                            {h.hospitalCode}
                          </span>
                        </Td>
                        <Td className="text-right">
                          {tab === "active" ? (
                            <button
                              onClick={() => handleArchiveHospital(h._id)}
                              className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Archive"
                            >
                              <FaTrash />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestoreHospital(h._id)}
                              className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                              title="Restore"
                            >
                              <FaUndo />
                            </button>
                          )}
                        </Td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </Table>
          </Section>
        </div>

        {/* DOCTOR REQUESTS SIDEBAR */}
        <div className="xl:col-span-1">
          <Section title="Pending Approvals">
            <div className="space-y-4">
              {doctorRequests.length === 0 ? (
                <p className="text-center py-6 text-gray-400 text-sm italic">
                  No pending requests
                </p>
              ) : (
                doctorRequests.map((d) => (
                  <div
                    key={d._id}
                    className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{d.name}</h4>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          d.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {d.specialization}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 italic">{d.email}</span>
                      <button
                        onClick={() => navigate("/doctor-requests")} // Navigate to the full list
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline group/btn"
                      >
                        Review
                        <FaArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* UI SUB-COMPONENTS */

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className={`relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-3xl shadow-xl shadow-blue-900/10 text-white`}
  >
    <div className="relative z-10">
      <div className="text-3xl bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-4">
        {icon}
      </div>
      <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider">
        {title}
      </h2>
      <p className="text-4xl font-black mt-1">{value || 0}</p>
    </div>
    {/* Decorative Shapes */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
  </motion.div>
);

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden h-full">
    <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white/50">
      <h2 className="text-lg font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Table = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">{children}</table>
  </div>
);

const Th = ({ children, className }) => (
  <th
    className={`px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className }) => (
  <td className={`px-4 py-5 text-sm ${className}`}>{children}</td>
);

const Tab = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

const Empty = ({ message }) => (
  <tr>
    <td colSpan="5" className="text-center py-20">
      <div className="flex flex-col items-center opacity-30">
        <FaHospital className="text-5xl mb-3" />
        <p className="font-medium text-lg">{message}</p>
      </div>
    </td>
  </tr>
);

export default SuperAdminDashboard;
