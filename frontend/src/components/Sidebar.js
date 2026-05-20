
// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   FaHospital,
//   FaUserMd,
//   FaUsers,
//   FaUserNurse,
//   FaSignOutAlt,
// } from "react-icons/fa";

// const Sidebar = () => {
//   const role = localStorage.getItem("role");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const menuItem = (to, label, icon) => (
//     <Link
//       to={to}
//       className={`flex items-center gap-3 p-3 rounded mb-2 transition-all duration-200 ${
//         location.pathname === to
//           ? "bg-white text-blue-600"
//           : "hover:bg-blue-500"
//       }`}
//     >
//       {icon}
//       {label}
//     </Link>
//   );

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/");
//   };

//   return (
//     <div className="w-64 h-screen bg-blue-600 text-white p-5 flex flex-col justify-between">
//       <div>
//         <h2 className="text-2xl font-bold mb-8">MedRX</h2>

//         {/* SUPER ADMIN */}
//         {role === "super_admin" && (
//           <>
//             {menuItem("/super-admin", "Dashboard", <FaHospital />)}
//             {menuItem("/create-hospital", "Create Hospital", <FaHospital />)}
//             {menuItem("/doctor-requests", "Doctor Requests", <FaUserMd />)}
//           </>
//         )}

//         {/* HOSPITAL ADMIN */}
//         {role === "hospital_admin" && (
//           <>
//             {menuItem("/hospital-admin", "Dashboard", <FaHospital />)}
//             {menuItem("/doctors", "Doctors", <FaUserMd />)}
//             {menuItem("/receptionists", "Receptionists", <FaUserNurse />)}
//             {menuItem("/patients-admin", "Patients", <FaUsers />)}
//             {menuItem("/doctor-requests-admin", "Doctor Requests", <FaUserMd />)}
//             {menuItem("/create-receptionist", "Add Receptionist", <FaUserNurse />)}
//           </>
//         )}

//         {/* DOCTOR */}
//         {role === "doctor" && (
//           <>
//             {menuItem("/doctor", "Dashboard", <FaHospital />)}
//             {menuItem("/patients", "Patients", <FaUsers />)}
//             {menuItem("/add-patient", "Add Patient", <FaUsers />)}
//           </>
//         )}

//         {/* RECEPTIONIST */}
//         {role === "receptionist" && (
//           <>
//             {menuItem("/receptionist", "Dashboard", <FaHospital />)}
//             {menuItem("/add-patient", "Add Patient", <FaUsers />)}
//           </>
//         )}
//       </div>

//       {/* LOGOUT BUTTON */}
//       <button
//         onClick={handleLogout}
//         className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 p-3 rounded transition-all"
//       >
//         <FaSignOutAlt />
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHospital,
  FaUserMd,
  FaUsers,
  FaUserNurse,
  FaSignOutAlt,
  FaChartLine,
  FaClipboardList,
  FaUserPlus
} from "react-icons/fa";
import { motion } from "framer-motion";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItem = (to, label, icon) => {
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} className="block group">
        <motion.div
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 transition-all duration-300 ${
            isActive
              ? "bg-white text-blue-600 shadow-lg shadow-blue-700/20 font-bold"
              : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
          }`}
        >
          <span className={`${isActive ? "text-blue-600" : "text-blue-300 group-hover:text-white"}`}>
            {icon}
          </span>
          <span className="text-sm tracking-wide">{label}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    /* ADDED: 'fixed left-0 top-0' to keep it pinned. 
       'z-50' ensures it stays above content. */
    <div className="fixed left-0 top-0 w-72 h-screen bg-blue-600 text-white p-6 flex flex-col justify-between shadow-2xl z-50">
      <div>
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-blue-600 font-black text-xl italic">Rx</span>
          </div>
          <h2 className="text-2xl font-black tracking-tighter italic">MedRX</h2>
        </div>

        {/* Navigation scroll area if menu is too long */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
          <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-4 px-4 opacity-70">
            Main Menu
          </p>

          {role === "super_admin" && (
            <>
              {menuItem("/super-admin", "Dashboard", <FaChartLine />)}
              {menuItem("/create-hospital", "Create Hospital", <FaHospital />)}
              {menuItem("/doctor-requests", "Doctor Requests", <FaClipboardList />)}
            </>
          )}

          {role === "hospital_admin" && (
            <>
              {menuItem("/hospital-admin", "Admin Dashboard", <FaChartLine />)}
              {menuItem("/doctors", "Manage Doctors", <FaUserMd />)}
              {menuItem("/receptionists", "Staff List", <FaUserNurse />)}
              {menuItem("/create-receptionist", "Add Receptionist", <FaUserPlus />)}
              {menuItem("/patients-admin", "Patient Database", <FaUsers />)}
              {menuItem("/doctor-requests-admin", "Verify Doctors", <FaClipboardList />)}
            </>
          )}

          {role === "doctor" && (
            <>
              {menuItem("/doctor", "Doctor Dashboard", <FaChartLine />)}
              {menuItem("/patients", "My Patients", <FaUsers />)}
              {menuItem("/add-patient", "Quick Register", <FaUserPlus />)}
            </>
          )}

          {role === "receptionist" && (
            <>
              {menuItem("/receptionist", "Reception Desk", <FaChartLine />)}
              {menuItem("/add-patient", "Register Patient", <FaUserPlus />)}
            </>
          )}
        </nav>
      </div>

      {/* FOOTER / LOGOUT */}
      <div className="pt-6 border-t border-blue-500/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-100 hover:text-white py-4 rounded-2xl transition-all duration-300 font-bold group"
        >
          <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
          Logout Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;