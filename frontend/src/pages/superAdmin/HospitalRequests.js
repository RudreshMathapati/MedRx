import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendHospitalApprovalEmail } from "../../utils/emailjsConfig";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaHospital,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { HiDocumentText, HiClock, HiInbox } from "react-icons/hi";

const HospitalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hospital-requests");
      setRequests(res.data || []);
    } catch (error) {
      toast.error("Failed to load hospital requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      setActionId(request._id);
      const response = await API.put(`/hospital-requests/${request._id}/approve`);
      if (response.data.success) {
        const { hospitalCode, adminEmail, adminName, hospitalName } = response.data.data;
        await sendHospitalApprovalEmail(adminEmail, adminName, hospitalName, hospitalCode);
        toast.success(`Approved successfully. Credentials sent.`);
        fetchRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this hospital registration request?")) return;
    try {
      setActionId(id);
      const response = await API.put(`/hospital-requests/${id}/reject`);
      if (response.data.success) {
        toast.warn("Hospital request rejected.");
        fetchRequests();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Rejection failed");
    } finally {
      setActionId(null);
    }
  };

  const filtered = requests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.adminName?.toLowerCase().includes(search.toLowerCase()) ||
      r.adminEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
              <HiDocumentText className="text-base" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Pending Requests
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-medium ml-10">
            Review and action incoming registration requests from new facilities.
          </p>
        </div>

        {/* Search */}
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors text-xs" />
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full lg:w-72 bg-slate-55 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-550 outline-none transition-all text-xs font-semibold text-slate-700"
          />
        </div>
      </div>

      {/* ── STAT STRIP ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
          <HiClock className="text-teal-650 text-base" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Review</p>
            <p className="text-lg font-black text-slate-800 leading-none mt-0.5">{requests.length}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-semibold italic">
          {requests.length === 0
            ? "All registrations have been actioned."
            : `There are ${requests.length} facility request${requests.length !== 1 ? "s" : ""} active.`}
        </p>
      </div>

      {/* ── REQUESTS ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse h-52"
              />
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-slate-350"
          >
            <HiInbox size={64} className="mb-3 opacity-20" />
            <p className="text-base font-bold text-slate-400">No pending requests</p>
            <p className="text-xs text-slate-350 mt-1">
              {search ? "No results match your search query." : "All registration requests have been actioned."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {filtered.map((req, i) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow hover:border-slate-305 transition-all duration-200 flex flex-col"
              >
                {/* Card top */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <FaHospital className="text-slate-500 text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight truncate">
                      {req.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-semibold">
                      <FaCalendarAlt className="text-slate-300 text-[10px]" />
                      <span>
                        Submitted{" "}
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100/50">
                    Pending
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
                  <div className="bg-slate-50 border border-slate-100/40 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Admin
                    </p>
                    <div className="flex items-center gap-1.5 mb-1">
                      <FaUser className="text-slate-350 text-[10px]" />
                      <p className="text-xs font-semibold text-slate-700 truncate">{req.adminName}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaEnvelope className="text-slate-355 text-[10px]" />
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{req.adminEmail}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100/40 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Contact
                    </p>
                    <div className="flex items-center gap-1.5 mb-1">
                      <FaPhone className="text-slate-350 text-[10px]" />
                      <p className="text-xs font-semibold text-slate-700">{req.phone}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaEnvelope className="text-slate-355 text-[10px]" />
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{req.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 bg-slate-50 border border-slate-100/40 rounded-xl p-3">
                    <div className="flex items-start gap-1.5">
                      <FaMapMarkerAlt className="text-slate-350 text-[10px] flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">{req.address}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={actionId === req._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm disabled:opacity-55"
                  >
                    {actionId === req._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FaCheckCircle className="text-[11px]" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={actionId === req._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold bg-white text-slate-650 hover:bg-slate-50 border border-slate-200 transition-all disabled:opacity-55"
                  >
                    <FaTimesCircle className="text-[11px] text-slate-400" />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default HospitalRequests;
