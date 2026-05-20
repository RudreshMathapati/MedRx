
// import React, { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import API from "../../services/api";
// import { motion } from "framer-motion";
// import {
//   FaUserMd,
//   FaUserNurse,
//   FaUsers,
//   FaClock,
//   FaSearch,
//   FaCheckCircle,
//   FaHospitalSymbol,
//   FaClinicMedical
// } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";

// const HospitalAdminDashboard = () => {
//   // --- DYNAMIC DATA STATE ---
//   const [adminData, setAdminData] = useState({ name: "Admin", hospital: "Medical Center" });
//   const [counts, setCounts] = useState({
//     doctors: 0,
//     receptionists: 0,
//     patients: 0,
//     pendingRequests: 0,
//   });

//   const [recentDoctors, setRecentDoctors] = useState([]);
//   const [recentPatients, setRecentPatients] = useState([]);
//   const [doctorRequests, setDoctorRequests] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [greeting, setGreeting] = useState("");
// useEffect(() => {
//   const storedUser = localStorage.getItem("user");
  
//   // ADD THIS CHECK: ONLY PARSE IF DATA IS NOT NULL OR "UNDEFINED"
//   if (storedUser && storedUser !== "undefined") {
//     try {
//       const parsedUser = JSON.parse(storedUser);
//       setAdminData({
//         name: parsedUser.name || "Admin",
//         hospital: parsedUser.hospitalName || "Your Hospital"
//       });
//     } catch (error) {
//       console.error("Failed to parse user data:", error);
//     }
//   }
//   // ... rest of your code
// }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [docs, recps, pts, reqs] = await Promise.all([
//         API.get("/users/doctors"),
//         API.get("/users/receptionists"),
//         API.get("/patients/receptionist"),
//         API.get("/doctor-requests/hospital")
//       ]);

//       setCounts({
//         doctors: docs.data.length,
//         receptionists: recps.data.length,
//         patients: pts.data.length,
//         pendingRequests: reqs.data.length,
//       });

//       setRecentDoctors(docs.data.slice(0, 5));
//       setRecentPatients(pts.data.slice(0, 5));
//       setDoctorRequests(reqs.data.slice(0, 5));
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to sync dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveDoctor = async (id) => {
//     try {
//       await API.put(`/doctor-requests/approve/${id}`);
//       toast.success("Doctor approved successfully!");
//       fetchData(); // Refresh data
//     } catch (error) {
//       toast.error("Approval failed");
//     }
//   };

//   const filterData = (data) =>
//     data.filter((item) =>
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       (item.specialization && item.specialization.toLowerCase().includes(search.toLowerCase()))
//     );

//   return (
//     <DashboardLayout>
//       <ToastContainer theme="colored" />

//       {/* HEADER SECTION */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//              <FaClinicMedical className="text-blue-600 text-sm" />
//              <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">
//                {adminData.hospital}
//              </span>
//           </div>
//           <h1 className="text-3xl font-black text-slate-800 tracking-tight">
//             {greeting}, {adminData.name.split(' ')[0]} <span className="text-blue-600">👋</span>
//           </h1>
//           <p className="text-slate-500 font-medium italic">
//             Overseeing the clinical operations of {adminData.hospital}.
//           </p>
//         </div>

//         <div className="relative group">
//           <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
//           <input
//             type="text"
//             placeholder="Search records..."
//             className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 shadow-sm rounded-2xl w-full lg:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-semibold text-slate-700"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* ANALYTICS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <StatCard title="Total Doctors" value={counts.doctors} icon={<FaUserMd />} gradient="from-blue-600 to-blue-400" />
//         <StatCard title="Receptionists" value={counts.receptionists} icon={<FaUserNurse />} gradient="from-emerald-600 to-emerald-400" />
//         <StatCard title="Patients" value={counts.patients} icon={<FaUsers />} gradient="from-violet-600 to-violet-400" />
//         <StatCard title="Pending Requests" value={counts.pendingRequests} icon={<FaClock />} gradient="from-rose-600 to-rose-400" />
//       </div>

//       {/* DASHBOARD CONTENT GRID */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
//         {/* PENDING REQUESTS */}
//         <Section title="Doctor Approval Queue" icon={<FaHospitalSymbol className="text-blue-500" />}>
//           <Table headers={["Doctor", "Specialty", "Action"]}>
//             {filterData(doctorRequests).map((d) => (
//               <tr key={d._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
//                 <Td>
//                   <div className="font-bold text-slate-700">{d.name}</div>
//                   <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{d.email}</div>
//                 </Td>
//                 <Td><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{d.specialization}</span></Td>
//                 <Td>
//                   <button 
//                     onClick={() => handleApproveDoctor(d._id)}
//                     className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-200"
//                   >
//                     <FaCheckCircle /> Approve
//                   </button>
//                 </Td>
//               </tr>
//             ))}
//             {doctorRequests.length === 0 && <Empty message="No pending approvals" />}
//           </Table>
//         </Section>

//         {/* ACTIVE MEDICAL STAFF */}
//         <Section title="Active Medical Staff" icon={<FaUserMd className="text-emerald-500" />}>
//           <Table headers={["Doctor Name", "Specialization", "Account Status"]}>
//             {filterData(recentDoctors).map((doc) => (
//               <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
//                 <Td className="font-bold text-slate-700">{doc.name}</Td>
//                 <Td className="text-slate-500 font-medium">{doc.specialization}</Td>
//                 <Td>
//                   <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
//                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active
//                   </div>
//                 </Td>
//               </tr>
//             ))}
//           </Table>
//         </Section>

//         {/* RECENT PATIENTS */}
//         <Section title="Recent Patient Traffic" icon={<FaUsers className="text-violet-500" />}>
//           <Table headers={["Patient", "Phone", "Status"]}>
//             {filterData(recentPatients).map((p) => (
//               <tr key={p._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
//                 <Td className="font-bold text-slate-700">{p.name}</Td>
//                 <Td className="text-slate-500 font-medium">{p.phone}</Td>
//                 <Td>
//                   <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
//                     p.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
//                   }`}>
//                     {p.status}
//                   </span>
//                 </Td>
//               </tr>
//             ))}
//           </Table>
//         </Section>

//         {/* DYNAMIC HOSPITAL CAPACITY METRICS */}
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between"
//         >
//           <div>
//             <h2 className="text-xl font-bold mb-2">{adminData.hospital} Overview</h2>
//             <p className="text-slate-400 text-sm mb-6">Live system metrics for {adminData.name}'s portal.</p>
            
//             <div className="space-y-6">
//               <ProgressBar label="Doctor Availability" percent={85} color="bg-blue-400" />
//               <ProgressBar label="Reception Load" percent={40} color="bg-emerald-400" />
//               <ProgressBar label="Patient Queue" percent={65} color="bg-rose-400" />
//             </div>
//           </div>
          
//           <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
//             <p className="text-xs font-medium text-slate-400">Security Log:</p>
//             <p className="text-sm font-bold italic">
//               "Session Active: {adminData.name} verified at {new Date().toLocaleTimeString()}."
//             </p>
//           </div>
//         </motion.div>

//       </div>
//     </DashboardLayout>
//   );
// };

// /* --- ENHANCED UI SUB-COMPONENTS --- */

// const StatCard = ({ title, value, icon, gradient }) => (
//   <motion.div
//     whileHover={{ y: -5 }}
//     className={`bg-gradient-to-br ${gradient} p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 relative overflow-hidden group`}
//   >
//     <div className="absolute -right-4 -top-4 text-white/10 text-8xl group-hover:scale-110 transition-transform duration-500">
//       {icon}
//     </div>
//     <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-4 backdrop-blur-md">
//       {icon}
//     </div>
//     <h2 className="text-white/80 text-xs font-black uppercase tracking-[0.15em] mb-1">{title}</h2>
//     <p className="text-white text-3xl font-black">{value}</p>
//   </motion.div>
// );

// const Section = ({ title, children, icon }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] p-8 h-full"
//   >
//     <div className="flex items-center gap-3 mb-6">
//       <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
//       <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
//     </div>
//     <div className="overflow-hidden">{children}</div>
//   </motion.div>
// );

// const Table = ({ headers, children }) => (
//   <div className="overflow-x-auto">
//     <table className="w-full text-left border-collapse">
//       <thead>
//         <tr>
//           {headers.map((h, i) => (
//             <th key={i} className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{h}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>{children}</tbody>
//     </table>
//   </div>
// );

// const Td = ({ children, className = "" }) => (
//   <td className={`py-4 px-2 text-sm ${className}`}>{children}</td>
// );

// const ProgressBar = ({ label, percent, color }) => (
//   <div>
//     <div className="flex justify-between text-xs font-bold mb-2">
//       <span className="text-slate-400 uppercase tracking-tighter">{label}</span>
//       <span>{percent}%</span>
//     </div>
//     <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
//       <motion.div 
//         initial={{ width: 0 }}
//         animate={{ width: `${percent}%` }}
//         transition={{ duration: 1 }}
//         className={`h-full ${color} rounded-full`} 
//       />
//     </div>
//   </div>
// );

// const Empty = ({ message }) => (
//   <tr>
//     <td colSpan="10" className="py-10 text-center">
//       <div className="text-slate-300 font-bold italic">{message}</div>
//     </td>
//   </tr>
// );

// export default HospitalAdminDashboard;
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
      
      // We use individual try-catches or .catch() to ensure one failure doesn't break the dashboard
      const [docsRes, recpsRes, reqsRes] = await Promise.all([
        API.get("/users/doctors").catch(err => ({ data: [] })),
        API.get("/users/receptionists").catch(err => ({ data: [] })),
        API.get("/doctor-requests/hospital").catch(err => {
          console.error("Doctor Requests API 404:", err);
          return { data: [] };
        })
      ]);

      // Handle patients specifically as it showed 304/404 issues
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
      // Only show toast if all requests fail
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <FaClinicMedical className="text-blue-600 text-sm" />
             <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">{adminData.hospital}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {greeting}, {adminData.name.split(' ')[0]} <span className="text-blue-600">👋</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Managing {adminData.hospital}.</p>
        </div>
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search records..."
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 shadow-sm rounded-2xl w-full lg:w-80 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Doctors" value={counts.doctors} icon={<FaUserMd />} gradient="from-blue-600 to-blue-400" />
        <StatCard title="Receptionists" value={counts.receptionists} icon={<FaUserNurse />} gradient="from-emerald-600 to-emerald-400" />
        <StatCard title="Patients" value={counts.patients} icon={<FaUsers />} gradient="from-violet-600 to-violet-400" />
        <StatCard title="Pending Requests" value={counts.pendingRequests} icon={<FaClock />} gradient="from-rose-600 to-rose-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

        <Section title="Active Medical Staff" icon={<FaUserMd className="text-emerald-500" />}>
          <Table headers={["Doctor Name", "Specialization", "Status"]}>
            {filterData(recentDoctors).map((doc) => (
              <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                <Td className="font-bold text-slate-700">{doc.name}</Td>
                <Td className="text-slate-500 font-medium">{doc.specialization}</Td>
                <Td><div className="flex items-center gap-2 text-emerald-500 font-bold text-xs"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active</div></Td>
              </tr>
            ))}
          </Table>
        </Section>
      </div>
    </DashboardLayout>
  );
};

/* --- SUB-COMPONENTS --- */
const StatCard = ({ title, value, icon, gradient }) => (
  <motion.div whileHover={{ y: -5 }} className={`bg-gradient-to-br ${gradient} p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 relative overflow-hidden group`}>
    <div className="absolute -right-4 -top-4 text-white/10 text-8xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl mb-4 backdrop-blur-md">{icon}</div>
    <h2 className="text-white/80 text-xs font-black uppercase tracking-[0.15em] mb-1">{title}</h2>
    <p className="text-white text-3xl font-black">{value}</p>
  </motion.div>
);

const Section = ({ title, children, icon }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-50 shadow-xl shadow-slate-200/40 rounded-[2.5rem] p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="overflow-hidden">{children}</div>
  </motion.div>
);

const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead><tr>{headers.map((h, i) => (<th key={i} className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{h}</th>))}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const Td = ({ children, className = "" }) => <td className={`py-4 px-2 text-sm ${className}`}>{children}</td>;
const Empty = ({ message }) => <tr><td colSpan="10" className="py-10 text-center text-slate-300 font-bold italic">{message}</td></tr>;

export default HospitalAdminDashboard;