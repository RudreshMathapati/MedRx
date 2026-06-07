import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiOutlineUserGroup, HiOutlinePencilAlt, HiOutlineDotsVertical } from "react-icons/hi";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients/doctor");
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            My Patients <HiOutlineUserGroup className="text-blue-500" />
          </h1>
          <p className="text-slate-500 mt-1">Manage and review your patient history and active records.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-4 py-3 w-full lg:w-80 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <Th>Patient Info</Th>
                <Th>Age</Th>
                <Th>Contact</Th>
                <Th>Symptoms</Th>
                <Th>Current Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <HiOutlineUserGroup className="text-6xl mb-2" />
                        <p className="text-lg font-medium tracking-tight">No patients matching your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                            {p.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800 tracking-tight">{p.name}</span>
                        </div>
                      </Td>
                      
                      <Td className="text-slate-600 font-medium">{p.age} yrs</Td>
                      
                      <Td className="text-slate-500 font-mono text-xs">{p.phone}</Td>

                      <Td>
                        <p className="max-w-[180px] truncate text-slate-600 text-sm italic">
                          "{p.symptoms}"
                        </p>
                      </Td>

                      <Td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                            p.status === "pending"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {p.status}
                        </span>
                      </Td>

                      <Td className="text-right">
                        <button
                          onClick={() => navigate(`/write-rx?patientId=${p._id}`)}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-200 hover:-translate-y-0.5 active:scale-95"
                        >
                          <HiOutlinePencilAlt className="text-sm" />
                          Write RX
                        </button>
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

/* UI COMPONENTS */

const Th = ({ children, className = "" }) => (
  <th className={`px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-5 text-sm ${className}`}>{children}</td>
);

export default PatientList;