import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  HiSearch, 
  HiInbox,
  HiShieldCheck,
  HiClock,
  HiOfficeBuilding
} from "react-icons/hi";
import { FaStethoscope, FaUserMd } from "react-icons/fa";

const SuperAdminDoctorMonitor = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setFetching(true);
      // Fetches all requests (approved or pending) for global monitoring
      const res = await API.get("/doctor-requests/all");
      setRequests(res.data);
    } catch (error) {
      toast.error("Error fetching global logs");
    } finally {
      setFetching(false);
    }
  };

  const filtered = requests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.specialization.toLowerCase().includes(search.toLowerCase()) ||
    r.hospitalCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Global Doctor Logs <HiShieldCheck className="text-indigo-600" />
          </h1>
          <p className="text-slate-500 font-medium italic">
            Monitoring all practitioner registrations and hospital approvals across the platform.
          </p>
        </div>

        <div className="relative group">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-xl" />
          <input
            type="text"
            placeholder="Search by name, specialty, or hospital code..."
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 shadow-sm rounded-2xl w-full lg:w-96 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Practitioner</Th>
                <Th>Affiliated Hospital</Th>
                <Th>Specialization</Th>
                <Th>Registration Status</Th>
                <Th className="text-right">Request Date</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300">
                        <HiInbox size={64} className="mb-4 opacity-20" />
                        <p className="text-xl font-bold italic text-slate-400">No records found</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filtered.map((r) => (
                    <motion.tr
                      key={r._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-indigo-50/20 transition-colors group"
                    >
                      <Td>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-700">{r.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">{r.email}</p>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <div className="flex items-center gap-2 text-slate-600 font-semibold">
                          <HiOfficeBuilding className="text-slate-400" />
                          <span>Code: <span className="text-indigo-600 font-black">{r.hospitalCode}</span></span>
                        </div>
                      </Td>
                      
                      <Td>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                          <FaStethoscope className="text-slate-300 text-xs" />
                          {r.specialization}
                        </div>
                      </Td>

                      <Td>
                        {r.status === "approved" ? (
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 rounded-full flex items-center w-fit gap-1.5 border border-emerald-200">
                            <HiShieldCheck className="text-sm" /> Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-600 rounded-full flex items-center w-fit gap-1.5 border border-amber-200">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Pending
                          </span>
                        )}
                      </Td>

                      <Td className="text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-slate-700 font-bold text-sm">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <HiClock /> {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </Td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

/* REUSABLE SUB-COMPONENTS */
const Th = ({ children, className = "" }) => (
  <th className={`px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-8 py-5 text-sm ${className}`}>
    {children}
  </td>
);

export default SuperAdminDoctorMonitor;