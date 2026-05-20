// import React, { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import API from "../../services/api";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaUserMd, FaSearch, FaCheckCircle, FaInbox, FaStethoscope } from "react-icons/fa";

// const DoctorRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loadingId, setLoadingId] = useState(null);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setFetching(true);
//       const res = await API.get("/doctor-requests/hospital");
//       setRequests(res.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load requests");
//     } finally {
//       setFetching(false);
//     }
//   };

//   const approveDoctor = async (id) => {
//     try {
//       setLoadingId(id);
//       await API.put(`/doctor-requests/hospital-approve/${id}`);
      
//       toast.success("Doctor Access Granted! ✅");
      
//       // Update local state immediately for better UX
//       setRequests(prev => prev.filter(req => req._id !== id));
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Approval failed");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const filtered = requests.filter((r) =>
//     r.name.toLowerCase().includes(search.toLowerCase()) ||
//     r.specialization.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <DashboardLayout>
//       <ToastContainer position="top-right" theme="colored" />

//       {/* HEADER SECTION */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
//             Doctor Verification <FaUserMd className="text-blue-600" />
//           </h1>
//           <p className="text-slate-500 font-medium italic">
//             Review and approve medical staff requesting access to your hospital.
//           </p>
//         </div>

//         <div className="relative group">
//           <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//           <input
//             type="text"
//             placeholder="Search by name or specialty..."
//             className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 shadow-sm rounded-2xl w-full lg:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-semibold"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* DATA TABLE */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <Th>Medical Professional</Th>
//                 <Th>Specialization</Th>
//                 <Th>Status</Th>
//                 <Th className="text-right">Action</Th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-50">
//               <AnimatePresence>
//                 {filtered.length === 0 ? (
//                   <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                     <td colSpan="4" className="py-20 text-center">
//                       <div className="flex flex-col items-center justify-center text-slate-300">
//                         <FaInbox size={48} className="mb-4 opacity-20" />
//                         <p className="text-lg font-bold italic">No pending requests found</p>
//                         <p className="text-sm">All doctors are currently verified.</p>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ) : (
//                   filtered.map((r) => (
//                     <motion.tr
//                       key={r._id}
//                       layout
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0, x: -20 }}
//                       className="hover:bg-blue-50/30 transition-colors group"
//                     >
//                       <Td>
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
//                             {r.name.charAt(0)}
//                           </div>
//                           <div>
//                             <p className="font-black text-slate-700">{r.name}</p>
//                             <p className="text-xs text-slate-400 font-medium">{r.email}</p>
//                           </div>
//                         </div>
//                       </Td>
                      
//                       <Td>
//                         <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
//                           <FaStethoscope className="text-blue-400 text-xs" />
//                           {r.specialization}
//                         </div>
//                       </Td>

//                       <Td>
//                         <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-600 rounded-full flex items-center w-fit gap-1.5">
//                           <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
//                           Pending
//                         </span>
//                       </Td>

//                       <Td className="text-right">
//                         <button
//                           onClick={() => approveDoctor(r._id)}
//                           disabled={loadingId === r._id}
//                           className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
//                             loadingId === r._id
//                               ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//                               : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
//                           }`}
//                         >
//                           {loadingId === r._id ? (
//                             <>
//                               <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
//                               Processing
//                             </>
//                           ) : (
//                             <>
//                               <FaCheckCircle /> Approve
//                             </>
//                           )}
//                         </button>
//                       </Td>
//                     </motion.tr>
//                   ))
//                 )}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </DashboardLayout>
//   );
// };

// /* REUSABLE SUB-COMPONENTS */

// const Th = ({ children, className = "" }) => (
//   <th className={`px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}>
//     {children}
//   </th>
// );

// const Td = ({ children, className = "" }) => (
//   <td className={`px-8 py-5 text-sm ${className}`}>
//     {children}
//   </td>
// );

// export default DoctorRequests;

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaUserMd, FaSearch, FaCheckCircle, FaInbox, 
  FaStethoscope, FaTimesCircle, FaEye, FaArrowLeft 
} from "react-icons/fa";

const DoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null); // To view details

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setFetching(true);
      const res = await API.get("/doctor-requests/hospital");
      setRequests(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests. Ensure you are logged in as Admin.");
    } finally {
      setFetching(false);
    }
  };

  const approveDoctor = async (id) => {
    if (!window.confirm("Approve this doctor? This will automatically create their login account.")) return;
    
    try {
      setLoadingId(id);
      // Calls the backend we updated earlier: marks request as approved + creates User record
      await API.put(`/doctor-requests/hospital-approve/${id}`);
      
      toast.success("Doctor Approved! Credentials sent to their email.");
      setRequests(prev => prev.filter(req => req._id !== id));
      setSelectedRequest(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  const rejectDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this request?")) return;
    
    try {
      setLoadingId(id);
      await API.delete(`/doctor-requests/hospital-reject/${id}`);
      
      toast.warn("Request rejected and deleted.");
      setRequests(prev => prev.filter(req => req._id !== id));
      setSelectedRequest(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = requests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Staff Verification <FaUserMd className="text-blue-600" />
          </h1>
          <p className="text-slate-500 font-medium italic">
            Approve medical staff to grant them access to your hospital.
          </p>
        </div>

        {!selectedRequest && (
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
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedRequest ? (
          /* DETAIL VIEW */
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100"
          >
            <button 
              onClick={() => setSelectedRequest(null)}
              className="mb-6 flex items-center gap-2 text-blue-600 font-bold hover:underline"
            >
              <FaArrowLeft /> Back to List
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-4">{selectedRequest.name}</h2>
                <div className="space-y-3 text-slate-600">
                  <p><strong>Email:</strong> {selectedRequest.email}</p>
                  <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                  <p><strong>Qualification:</strong> {selectedRequest.qualification}</p>
                  <p><strong>Specialization:</strong> {selectedRequest.specialization}</p>
                  <p><strong>Experience:</strong> {selectedRequest.experience} Years</p>
                </div>
                
                <div className="mt-10 flex gap-4">
                  <button
                    onClick={() => approveDoctor(selectedRequest._id)}
                    disabled={loadingId === selectedRequest._id}
                    className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    <FaCheckCircle /> Approve Access
                  </button>
                  <button
                    onClick={() => rejectDoctor(selectedRequest._id)}
                    className="bg-rose-50 text-rose-600 px-8 py-3 rounded-xl font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Digital Signature</p>
                {selectedRequest.signatureFile ? (
                  <img 
                    src={`${process.env.REACT_APP_API_URL}/${selectedRequest.signatureFile}`} 
                    alt="Signature" 
                    className="max-h-48 mx-auto mix-blend-multiply"
                  />
                ) : (
                  <p className="text-slate-400 italic">No signature uploaded</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* LIST VIEW */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <Th>Medical Professional</Th>
                    <Th>Specialization</Th>
                    <Th>Exp.</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {fetching ? (
                    <tr><td colSpan="4" className="py-20 text-center font-bold text-slate-400 animate-pulse">Fetching requests...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <FaInbox size={48} className="mb-4 opacity-20" />
                          <p className="text-lg font-bold italic">No pending requests</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <motion.tr key={r._id} className="hover:bg-slate-50/50 transition-colors group">
                        <Td>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">
                              {r.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-700">{r.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{r.email}</p>
                            </div>
                          </div>
                        </Td>
                        
                        <Td>
                          <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                            <FaStethoscope className="text-blue-400 text-xs" />
                            {r.specialization}
                          </div>
                        </Td>

                        <Td>
                          <span className="font-bold text-slate-600">{r.experience}y</span>
                        </Td>

                        <Td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedRequest(r)}
                              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => approveDoctor(r._id)}
                              disabled={loadingId === r._id}
                              className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                              title="Quick Approve"
                            >
                              {loadingId === r._id ? <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /> : <FaCheckCircle />}
                            </button>
                            <button
                              onClick={() => rejectDoctor(r._id)}
                              className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </div>
                        </Td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default DoctorRequests;