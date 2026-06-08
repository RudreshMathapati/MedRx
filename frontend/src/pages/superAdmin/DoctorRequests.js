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
  HiOfficeBuilding,
  HiUserGroup,
} from "react-icons/hi";
import { FaStethoscope } from "react-icons/fa";

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
      const res = await API.get("/doctor-requests/all");
      setRequests(res.data);
    } catch (error) {
      toast.error("Error fetching global doctor logs");
    } finally {
      setFetching(false);
    }
  };

  const filtered = requests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.specialization.toLowerCase().includes(search.toLowerCase()) ||
      r.hospitalCode?.toLowerCase().includes(search.toLowerCase())
  );

  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
              <HiUserGroup className="text-base" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Doctor Log
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-medium ml-10">
            Global register of all medical practitioner verification histories.
          </p>
        </div>

        {/* Search */}
        <div className="relative group">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-650 transition-colors text-xs" />
          <input
            type="text"
            placeholder="Search log..."
            className="pl-10 pr-4 py-2.5 w-full lg:w-72 bg-slate-55 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-xs font-semibold text-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── STAT STRIP ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
          <HiUserGroup className="text-slate-400 text-base" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Logged</p>
            <p className="text-lg font-black text-slate-800 leading-none mt-0.5">{requests.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
          <HiShieldCheck className="text-teal-600 text-base" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
            <p className="text-lg font-black text-teal-700 leading-none mt-0.5">{approvedCount}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
          <HiClock className="text-amber-600 text-base" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
            <p className="text-lg font-black text-amber-750 leading-none mt-0.5">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* ── DATA TABLE ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <Th>Practitioner</Th>
                <Th>Affiliated Hospital</Th>
                <Th>Specialization</Th>
                <Th>Status</Th>
                <Th className="text-right">Date Registered</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {fetching ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-300">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin mb-3" />
                        <p className="text-xs font-bold text-slate-400">Loading records...</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : filtered.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-350">
                        <HiInbox size={48} className="mb-3 opacity-20" />
                        <p className="text-sm font-bold text-slate-450">No practitioner records found</p>
                        <p className="text-xs text-slate-350 mt-1">Try adjusting your search criteria</p>
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
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 font-extrabold text-xs flex-shrink-0">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-700 text-xs">{r.name}</p>
                            <p className="text-[10px] text-slate-450 font-semibold tracking-tight uppercase mt-0.5">
                              {r.email}
                            </p>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <div className="flex items-center gap-2 text-slate-650 font-semibold text-xs">
                          <HiOfficeBuilding className="text-slate-400 flex-shrink-0 text-sm" />
                          <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-150/40">
                            {r.hospitalCode}
                          </span>
                        </div>
                      </Td>

                      <Td>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                          <FaStethoscope className="text-slate-300 text-[10px] flex-shrink-0" />
                          {r.specialization}
                        </div>
                      </Td>

                      <Td>
                        {r.status === "approved" ? (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-teal-50 text-teal-600 rounded flex items-center w-fit gap-1 border border-teal-100/50">
                            <HiShieldCheck className="text-xs" /> Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 rounded flex items-center w-fit gap-1 border border-amber-100/50">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            Pending
                          </span>
                        )}
                      </Td>

                      <Td className="text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-slate-700 font-bold text-xs">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold mt-0.5">
                            <HiClock />
                            {new Date(r.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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

/* ── SUB-COMPONENTS ──────────────────────────────────────────── */
const Th = ({ children, className = "" }) => (
  <th
    className={`px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-3.5 text-xs ${className}`}>{children}</td>
);

export default SuperAdminDoctorMonitor;