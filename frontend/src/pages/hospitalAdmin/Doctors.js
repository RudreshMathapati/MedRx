
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaTrash, FaSearch, FaUserMd, FaStethoscope, FaUserSlash } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/doctors");
      setDoctors(res.data);
    } catch (err) {
      toast.error("Could not sync doctors list");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure? This will permanently remove the doctor's access.")) return;

    try {
      await API.delete(`/users/${id}`);
      toast.success("Doctor record removed");
      setDoctors(doctors.filter((d) => d._id !== id));
    } catch {
      toast.error("Delete operation failed");
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Medical Staff <FaUserMd className="text-blue-600" />
          </h1>
          <p className="text-slate-500 font-medium italic">
            Manage your hospital's verified consultants and specialists.
          </p>
        </div>

        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
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
                <Th>Consultant</Th>
                <Th>Specialization</Th>
                <Th>Account Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-blue-600 font-bold">
                      <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Fetching medical records...
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredDoctors.length === 0 ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <FaUserSlash size={48} className="mb-4 opacity-20" />
                          <p className="text-lg font-bold italic">No doctors found</p>
                          <p className="text-sm">Try adjusting your search criteria.</p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    filteredDoctors.map((d) => (
                      <motion.tr
                        key={d._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <Td>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-blue-600 font-black">
                              {d.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-700">{d.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{d.email}</p>
                            </div>
                          </div>
                        </Td>

                        <Td>
                          <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                            <FaStethoscope className="text-blue-400 text-xs" />
                            {d.specialization}
                          </div>
                        </Td>

                        <Td>
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 rounded-full inline-flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Active
                          </span>
                        </Td>

                        <Td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => deleteDoctor(d._id)}
                              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
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
    </DashboardLayout>
  );
};

/* REUSABLE SUB-COMPONENTS */

const Th = ({ children, className = "" }) => (
  <th className={`px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-8 py-5 text-sm ${className}`}>
    {children}
  </td>
);

export default Doctors;