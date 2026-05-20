import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTrash, FaEye, FaSearch, FaUserNurse, 
  FaTimes, FaEnvelope, FaPhone, FaIdBadge, FaCalendarCheck 
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Receptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const fetchReceptionists = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/receptionists");
      setReceptionists(res.data);
    } catch (err) {
      toast.error("Failed to sync staff records");
    } finally {
      setLoading(false);
    }
  };

  const deleteReceptionist = async (id) => {
    if (!window.confirm("Remove this staff member? This will revoke their dashboard access.")) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success("Receptionist removed successfully");
      setReceptionists(receptionists.filter((r) => r._id !== id));
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const filtered = receptionists.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Front Desk Staff <FaUserNurse className="text-blue-600" />
          </h1>
          <p className="text-slate-500 font-medium italic">Manage receptionists and hospital administrative personnel.</p>
        </div>

        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 shadow-sm rounded-2xl w-full lg:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <Th>Receptionist Name</Th>
                <Th>Contact Information</Th>
                <Th>Account Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center font-bold text-blue-600 animate-pulse text-sm">Synchronizing Database...</td></tr>
              ) : (
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center text-slate-400 italic font-medium">No front desk staff records found.</td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <motion.tr 
                        key={r._id} 
                        layout 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <Td>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black">
                              {r.name.charAt(0)}
                            </div>
                            <span className="font-black text-slate-700">{r.name}</span>
                          </div>
                        </Td>
                        <Td>
                          <div className="text-slate-600 font-medium">{r.email}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black">{r.phone || "No Phone Recorded"}</div>
                        </Td>
                        <Td>
                          <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 rounded-full inline-flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Active
                          </span>
                        </Td>
                        <Td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewDetails(r)}
                              className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                              <FaEye size={14} />
                            </button>
                            <button 
                              onClick={() => deleteReceptionist(r._id)}
                              className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </Td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* STAFF DETAIL MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedStaff && (
          <StaffDetailModal 
            staff={selectedStaff} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

/* --- MODAL COMPONENT --- */

const StaffDetailModal = ({ staff, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="bg-emerald-600 p-8 text-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl font-black backdrop-blur-md">
              {staff.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black">{staff.name}</h2>
              <p className="text-emerald-100 flex items-center gap-2 text-sm">
                <FaIdBadge /> Receptionist ID: {staff._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><FaTimes /></button>
        </div>

        <div className="p-8 space-y-6">
          <DetailRow icon={<FaEnvelope className="text-emerald-500" />} label="Email Address" value={staff.email} />
          <DetailRow icon={<FaPhone className="text-blue-500" />} label="Mobile Phone" value={staff.phone || "Not Provided"} />
          <DetailRow icon={<FaCalendarCheck className="text-violet-500" />} label="Account Type" value="Hospital Front Desk" />
          
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
            >
              Close Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-slate-700 font-bold">{value}</p>
    </div>
  </div>
);

const Th = ({ children, className = "" }) => (
  <th className={`px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}>{children}</th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-8 py-5 text-sm ${className}`}>{children}</td>
);

export default Receptionists;