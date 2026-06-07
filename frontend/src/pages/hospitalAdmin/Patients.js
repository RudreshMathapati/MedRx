// import React, { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import API from "../../services/api";

// const Patients = () => {
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     const res = await API.get("/patients/receptionist");
//     setPatients(res.data);
//   };

//   return (
//     <DashboardLayout>
//       <h1 className="text-2xl font-bold mb-4">Patients</h1>

//       <table className="w-full bg-white shadow rounded">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2">Name</th>
//             <th className="p-2">Phone</th>
//             <th className="p-2">Age</th>
//             <th className="p-2">Doctor</th>
//             <th className="p-2">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {patients.map((p) => (
//             <tr key={p._id} className="border-t">
//               <td className="p-2">{p.name}</td>
//               <td className="p-2">{p.phone}</td>
//               <td className="p-2">{p.age}</td>
//               <td className="p-2">{p.doctorId}</td>
//               <td className="p-2">{p.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </DashboardLayout>
//   );
// };

// export default Patients;

// import React, { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import API from "../../services/api";
// import { motion } from "framer-motion";
// import { FaEye } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Patients = () => {
//   const [patients, setPatients] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/patients/receptionist");
//       setPatients(res.data);
//     } catch (err) {
//       toast.error("Error fetching patients");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredPatients = patients.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <DashboardLayout>
//       <ToastContainer />

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//           Patients 👨‍⚕️
//         </h1>

//         <input
//           type="text"
//           placeholder="Search patient..."
//           className="mt-3 md:mt-0 border px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* TABLE */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white shadow-xl rounded-xl overflow-hidden"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-gray-600">
//               <tr>
//                 <Th>Name</Th>
//                 <Th>Phone</Th>
//                 <Th>Age</Th>
//                 <Th>Doctor</Th>
//                 <Th>Status</Th>
//                 <Th>Action</Th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="text-center p-6">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredPatients.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="text-center p-6 text-gray-400">
//                     No patients found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredPatients.map((p) => (
//                   <tr
//                     key={p._id}
//                     className="border-t hover:bg-gray-50 transition"
//                   >
//                     <Td className="font-medium">{p.name}</Td>
//                     <Td>{p.phone}</Td>
//                     <Td>{p.age}</Td>

//                     {/* DOCTOR */}
//                     <Td>
//                       <span className="text-blue-600 font-medium">
//                         {p.doctorName || "Not Assigned"}
//                       </span>
//                     </Td>

//                     {/* STATUS */}
//                     <Td>
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           p.status === "pending"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-green-100 text-green-700"
//                         }`}
//                       >
//                         {p.status}
//                       </span>
//                     </Td>

//                     {/* ACTION */}
//                     <Td>
//                       <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm">
//                         <FaEye />
//                       </button>
//                     </Td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </DashboardLayout>
//   );
// };

// export default Patients;

// /* COMPONENTS */

// const Th = ({ children }) => (
//   <th className="p-3 text-left font-semibold">{children}</th>
// );

// const Td = ({ children, className = "" }) => (
//   <td className={`p-3 ${className}`}>{children}</td>
// );
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEye, FaSearch, FaUsers, FaUserClock, 
  FaCheckCircle, FaTimes, FaPhone, FaCalendarAlt, 
  FaUserInjured, FaNotesMedical, FaIdCard 
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NEW STATE: For managing the Modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await API.get("/patients/receptionist");
      setPatients(res.data);
    } catch (err) {
      toast.error("Critical: Could not sync patient records");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Patient Directory <FaUsers className="text-blue-600" />
          </h1>
          <p className="text-slate-500 font-medium italic">Monitor and manage all active patient registrations.</p>
        </div>

        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 shadow-sm rounded-2xl w-full lg:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <Th>Patient Details</Th>
                <Th>Contact</Th>
                <Th>Assigned Physician</Th>
                <Th>Triage Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center font-bold text-blue-600 animate-pulse">Loading Records...</td></tr>
              ) : (
                <AnimatePresence>
                  {filteredPatients.map((p) => (
                    <motion.tr key={p._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-blue-50/30 transition-colors group">
                      <Td>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">{p.name.charAt(0)}</div>
                          <span className="font-black text-slate-700">{p.name}</span>
                        </div>
                      </Td>
                      <Td className="text-slate-500 font-medium">{p.phone}</Td>
                      <Td><span className="text-blue-600 font-black uppercase text-xs">{p.doctorName || "Pending Assignment"}</span></Td>
                      <Td>
                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-2 ${p.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
                          {p.status}
                        </span>
                      </Td>
                      <Td className="text-right">
                        <button 
                          onClick={() => handleViewDetails(p)}
                          className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                          <FaEye size={16} />
                        </button>
                      </Td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* PATIENT DETAILS MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedPatient && (
          <PatientDetailModal 
            patient={selectedPatient} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

/* --- MODAL COMPONENT --- */

const PatientDetailModal = ({ patient, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-blue-600 p-8 text-white flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl font-black backdrop-blur-md">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black">{patient.name}</h2>
              <p className="text-blue-100 flex items-center gap-2 text-sm">
                <FaIdCard /> Patient ID: {patient._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <DetailItem icon={<FaPhone className="text-blue-500" />} label="Phone Number" value={patient.phone} />
          <DetailItem icon={<FaCalendarAlt className="text-emerald-500" />} label="Age" value={`${patient.age} Years Old`} />
          <DetailItem icon={<FaUserInjured className="text-violet-500" />} label="Gender" value={patient.gender || "Not Specified"} />
          <DetailItem icon={<FaUserClock className="text-amber-500" />} label="Current Status" value={patient.status.toUpperCase()} />
          
          <div className="md:col-span-2 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <FaNotesMedical className="text-blue-500" /> Medical Summary / Complaints
            </h3>
            <p className="text-slate-700 font-semibold leading-relaxed">
              {patient.complaints || "No specific complaints recorded at the time of registration."}
            </p>
          </div>

          <div className="md:col-span-2 flex justify-between items-center pt-4 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Physician</p>
              <p className="text-blue-600 font-black">{patient.doctorName || "Awaiting Assignment"}</p>
            </div>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
            >
              Close Record
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 p-2 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-slate-700 font-bold">{value}</p>
    </div>
  </div>
);

const Th = ({ children, className = "" }) => (
  <th className={`px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-8 py-5 text-sm ${className}`}>{children}</td>
);

export default Patients;