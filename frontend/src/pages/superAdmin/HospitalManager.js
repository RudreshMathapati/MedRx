import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSearch,
  FaTrash,
  FaUndo,
  FaHospital,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { HiOfficeBuilding, HiArchive } from "react-icons/hi";

const HospitalManager = () => {
  const [hospitals, setHospitals] = useState([]);
  const [archivedHospitals, setArchivedHospitals] = useState([]);
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activeRes, archivedRes] = await Promise.all([
        API.get("/superadmin/hospitals"),
        API.get("/superadmin/archived-hospitals"),
      ]);
      setHospitals(activeRes.data);
      setArchivedHospitals(archivedRes.data);
    } catch (error) {
      toast.error("Failed to load hospital data");
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this hospital? Associated staff will be deactivated.")) return;
    try {
      setActionId(id);
      await API.delete(`/superadmin/hospital/${id}`);
      toast.success("Hospital archived successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Archive failed");
    } finally {
      setActionId(null);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this hospital and reactivate all its staff?")) return;
    try {
      setActionId(id);
      await API.put(`/superadmin/restore-hospital/${id}`);
      toast.success("Hospital restored successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Restore failed");
    } finally {
      setActionId(null);
    }
  };

  const currentList = tab === "active" ? hospitals : archivedHospitals;
  const filtered = currentList.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address?.toLowerCase().includes(search.toLowerCase()) ||
      h.hospitalCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
              <HiOfficeBuilding className="text-base" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Hospitals
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-medium ml-10">
            Archive, restore, and monitor registered healthcare facilities.
          </p>
        </div>

        {/* Search */}
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 group-focus-within:text-teal-650 transition-colors text-xs" />
          <input
            type="text"
            placeholder="Search by name, address, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full lg:w-72 bg-slate-55 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-xs font-semibold text-slate-700"
          />
        </div>
      </div>

      {/* ── STATS STRIP ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active", value: hospitals.length, color: "text-teal-600" },
          { label: "Archived", value: archivedHospitals.length, color: "text-slate-500" },
          {
            label: "Total Registered",
            value: hospitals.length + archivedHospitals.length,
            color: "text-slate-850",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className={`text-2xl font-black ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── TABS ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs border transition-all ${
            tab === "active"
              ? "bg-teal-600 border-teal-600 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-350"
          }`}
        >
          <HiOfficeBuilding />
          Active
          <span
            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
              tab === "active" ? "bg-teal-700/65 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {hospitals.length}
          </span>
        </button>
        <button
          onClick={() => setTab("archived")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs border transition-all ${
            tab === "archived"
              ? "bg-slate-700 border-slate-700 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-350"
          }`}
        >
          <HiArchive />
          Archived
          <span
            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
              tab === "archived" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {archivedHospitals.length}
          </span>
        </button>
      </div>

      {/* ── HOSPITAL GRID ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse h-48"
              />
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-slate-350"
          >
            <FaHospital size={48} className="mb-3 opacity-20" />
            <p className="text-base font-bold text-slate-400">No hospitals found</p>
            <p className="text-xs text-slate-350 mt-1">
              {search ? "Adjust your search parameters" : `No ${tab} hospitals found`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((h, i) => (
              <motion.div
                key={h._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow hover:border-slate-350 transition-all duration-205 flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      tab === "active" ? "bg-teal-50 border border-teal-100/60" : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <HiOfficeBuilding
                      className={`text-base ${
                        tab === "active" ? "text-teal-600" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-xs leading-snug truncate">
                      {h.name}
                    </h3>
                    <span
                      className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1.5 ${
                        tab === "active"
                          ? "bg-teal-50 text-teal-600 border border-teal-100/40"
                          : "bg-rose-50 text-rose-500 border border-rose-100/40"
                      }`}
                    >
                      {tab === "active" ? "Active" : "Archived"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 flex-1">
                  {h.address && (
                    <div className="flex items-start gap-2 text-xs text-slate-400">
                      <FaMapMarkerAlt className="flex-shrink-0 mt-0.5 text-[10px]" />
                      <span className="line-clamp-2">{h.address}</span>
                    </div>
                  )}
                  {h.phone && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FaPhone className="flex-shrink-0 text-[10px]" />
                      <span>{h.phone}</span>
                    </div>
                  )}
                  {h.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FaEnvelope className="flex-shrink-0 text-[10px]" />
                      <span className="truncate">{h.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-mono font-bold text-teal-700 text-xs bg-teal-50 px-2 py-0.5 rounded border border-teal-100/60">
                      {h.hospitalCode}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                  {tab === "active" ? (
                    <button
                      onClick={() => handleArchive(h._id)}
                      disabled={actionId === h._id}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-rose-500 border border-rose-100 hover:bg-rose-50 hover:text-white hover:border-rose-500 transition-all duration-150 disabled:opacity-55"
                    >
                      {actionId === h._id ? (
                        <div className="w-3 h-3 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaTrash className="text-[10px]" />
                      )}
                      Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRestore(h._id)}
                      disabled={actionId === h._id}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-teal-600 border border-teal-100 hover:bg-teal-500 hover:text-white hover:border-teal-550 transition-all duration-150 disabled:opacity-55"
                    >
                      {actionId === h._id ? (
                        <div className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaUndo className="text-[10px]" />
                      )}
                      Restore
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default HospitalManager;
