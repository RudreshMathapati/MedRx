import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion } from "framer-motion";
import {
  FaUserMd, FaUserNurse, FaUsers, FaClock, FaSearch, 
  FaCheckCircle, FaHospitalSymbol, FaClinicMedical
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const HospitalAdminDashboard = () => {
  const [adminData, setAdminData] = useState({ name: "Admin", hospital: "Medical Center" });
  const [counts, setCounts] = useState({ doctors: 0, receptionists: 0, patients: 0, pendingRequests: 0 });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // 1. Get Data Safely (Fix for SyntaxError: "undefined" is not valid JSON)
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAdminData({
          name: parsedUser.name || "Rudresh",
          hospital: parsedUser.hospitalName || "Mathapati Hospital"
        });
      } catch (e) {
        console.error("JSON Parse Error", e);
      }
    }

    // 2. Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [docsRes, recpsRes, reqsRes] = await Promise.all([
        API.get("/users/doctors").catch(err => ({ data: [] })),
        API.get("/users/receptionists").catch(err => ({ data: [] })),
        API.get("/doctor-requests/hospital").catch(err => {
          console.error("Doctor Requests API 404:", err);
          return { data: [] };
        })
      ]);

      // Handle patients specifically
      let ptsData = [];
      try {
        const ptsRes = await API.get("/patients/receptionist");
        ptsData = ptsRes.data;
      } catch (e) {
        console.warn("Patient API currently unavailable");
      }

      setCounts({
        doctors: docsRes.data.length || 0,
        receptionists: recpsRes.data.length || 0,
        patients: ptsData.length || 0,
        pendingRequests: reqsRes.data.length || 0,
      });

      setRecentDoctors(docsRes.data.slice(0, 5));
      setRecentPatients(ptsData.slice(0, 5));
      setDoctorRequests(reqsRes.data.slice(0, 5));

    } catch (error) {
      console.error("Data sync error:", error);
      toast.error("Partial data sync failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) =>
    data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.specialization && item.specialization.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <DashboardLayout>
      <ToastContainer theme="colored" />
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <FaClinicMedical className="text-blue-600 text-sm" />
             <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">{adminData.hospital}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {greeting}, {adminData.name.split(' ')[0]} <span className="text-blue-600">👋</span>
          </h1>
          <p className="text-slate-500 font-medium">Managing clinical operations for {adminData.hospital}.</p>
        </div>
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search records..."
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 shadow-sm rounded-2xl w-full lg:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Doctors" value={counts.doctors} icon={<FaUserMd />} gradient="from-blue-600 to-indigo-700" />
        <StatCard title="Receptionists" value={counts.receptionists} icon={<FaUserNurse />} gradient="from-emerald-500 to-teal-700" />
        <StatCard title="Patients" value={counts.patients} icon={<FaUsers />} gradient="from-violet-500 to-purple-700" />
        <StatCard title="Pending Requests" value={counts.pendingRequests} icon={<FaClock />} gradient="from-rose-500 to-red-600" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* APPROVAL QUEUE */}
        <Section title="Doctor Approval Queue" icon={<FaHospitalSymbol className="text-blue-500" />}>
          <Table headers={["Doctor", "Specialty", "Action"]}>
            {filterData(doctorRequests).map((d) => (
              <tr key={d._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                <Td>
                  <div className="font-bold text-slate-700">{d.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium tracking-wider">{d.email}</div>
                </Td>
                <Td><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{d.specialization}</span></Td>
                <Td>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 transition-all">
                    Approve
                  </button>
                </Td>
              </tr>
            ))}
            {doctorRequests.length === 0 && <Empty message="No pending approvals" />}
          </Table>
        </Section>

        {/* ACTIVE MEDICAL STAFF */}
        <Section title="Active Medical Staff" icon={<FaUserMd className="text-emerald-500" />}>
          <Table headers={["Doctor Name", "Specialization", "Status"]}>
            {filterData(recentDoctors).map((doc) => (
              <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                <Td className="font-bold text-slate-700">{doc.name}</Td>
                <Td className="text-slate-500 font-medium">{doc.specialization}</Td>
                <Td><div className="flex items-center gap-2 text-emerald-500 font-bold text-xs"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active</div></Td>
              </tr>
            ))}
            {recentDoctors.length === 0 && <Empty message="No active medical staff" />}
          </Table>
        </Section>
        
      </div>
    </DashboardLayout>
  );
};

/* --- SUB-COMPONENTS --- */

const StatCard = ({ title, value, icon, gradient }) => (
  <motion.div whileHover={{ y: -5 }} className={`bg-gradient-to-br ${gradient} p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 relative overflow-hidden group text-white`}>
    <div className="absolute -right-4 -top-4 text-white/10 text-8xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-4 backdrop-blur-md">{icon}</div>
    <h2 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{title}</h2>
    <p className="text-white text-3xl font-black">{value}</p>
  </motion.div>
);

const Section = ({ title, children, icon }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">{title}</h2>
    </div>
    <div className="overflow-hidden">{children}</div>
  </motion.div>
);

const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Td = ({ children, className = "" }) => <td className={`py-4 px-2 text-sm ${className}`}>{children}</td>;
const Empty = ({ message }) => <tr><td colSpan="10" className="py-10 text-center text-slate-300 font-bold italic">{message}</td></tr>;

export default HospitalAdminDashboard;