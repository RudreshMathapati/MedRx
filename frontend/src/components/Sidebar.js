import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaUsers,
  FaUserNurse,
  FaSignOutAlt,
  FaChartLine,
  FaClipboardList,
  FaUserPlus,
  FaWhatsapp,
} from "react-icons/fa";
import {
  HiViewGrid,
  HiOfficeBuilding,
  HiDocumentText,
  HiPlusCircle,
  HiUserGroup,
} from "react-icons/hi";
import { motion } from "framer-motion";
import API from "../services/api";

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending hospital request count for badge
  useEffect(() => {
    if (role === "super_admin") {
      API.get("/hospital-requests")
        .then((res) => {
          const pending = (res.data || []).filter((r) => r.status === "pending");
          setPendingCount(pending.length);
        })
        .catch(() => {});
    }
  }, [role, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // =============================================================
  //  SUPER ADMIN SIDEBAR — Premium dark navy/indigo theme
  // =============================================================
  if (role === "super_admin") {
    const superAdminMenus = [
      {
        to: "/super-admin",
        label: "Overview",
        icon: <HiViewGrid className="text-base" />,
        exact: true,
      },
      {
        to: "/super-admin/hospitals",
        label: "Hospitals",
        icon: <HiOfficeBuilding className="text-base" />,
      },
      {
        to: "/super-admin/hospital-requests",
        label: "Pending Requests",
        icon: <HiDocumentText className="text-base" />,
        badge: pendingCount,
      },
      {
        to: "/create-hospital",
        label: "New Hospital",
        icon: <HiPlusCircle className="text-base" />,
      },
      {
        to: "/doctor-requests",
        label: "Doctor Log",
        icon: <HiUserGroup className="text-base" />,
      },
    ];

    return (
      <div className="fixed left-0 top-0 w-72 h-screen flex flex-col justify-between border-r border-slate-800 bg-slate-950 z-50">
        {/* ---- TOP SECTION ---- */}
        <div className="flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/40 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-extrabold text-sm tracking-tighter">Rx</span>
            </div>
            <div>
              <h2 className="text-white font-extrabold text-base tracking-tight leading-none">MedRx</h2>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 block">
                Super Admin
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-4 pt-6 pb-2 overflow-y-auto custom-scrollbar flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">
              Management
            </p>
            <div className="space-y-1">
              {superAdminMenus.map(({ to, label, icon, badge, exact }) => {
                const isActive = exact
                  ? location.pathname === to
                  : location.pathname.startsWith(to) && to !== "/super-admin"
                  ? true
                  : location.pathname === to;

                return (
                  <Link to={to} key={to} className="block group">
                    <motion.div
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150"
                      style={{
                        background: isActive
                          ? "rgba(13, 148, 136, 0.1)"
                          : "transparent",
                        borderLeft: isActive
                          ? "2px solid #0d9488"
                          : "2px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="transition-colors duration-150"
                          style={{ color: isActive ? "#2dd4bf" : "#64748b" }}
                        >
                          {icon}
                        </span>
                        <span
                          className="text-xs font-semibold transition-colors duration-150"
                          style={{ color: isActive ? "#f8fafc" : "#94a3b8" }}
                        >
                          {label}
                        </span>
                      </div>
                      {badge > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-600 text-white flex-shrink-0">
                          {badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* ---- FOOTER ---- */}
        <div className="px-4 pb-5 pt-4 border-t border-slate-800/40 flex-shrink-0">
          {/* User badge */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl bg-slate-900/50">
            <div className="w-8 h-8 rounded bg-teal-600/20 text-teal-400 flex items-center justify-center text-xs font-black flex-shrink-0">
              SA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 leading-none">Super Admin</p>
              <p className="text-[9px] mt-1 leading-none text-slate-500 font-medium">
                System Administrator
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 transition-all duration-200"
          >
            <FaSignOutAlt className="text-xs" />
            Logout Session
          </button>
        </div>
      </div>
    );
  }

  // =============================================================
  //  OTHER ROLES — Existing blue sidebar (untouched)
  // =============================================================
  const menuItem = (to, label, icon) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className="block group" key={to}>
        <motion.div
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 transition-all duration-300 ${
            isActive
              ? "bg-white text-blue-600 shadow-lg shadow-blue-700/20 font-bold"
              : "text-blue-100 hover:bg-blue-500/50 hover:text-white"
          }`}
        >
          <span
            className={`${
              isActive ? "text-blue-600" : "text-blue-300 group-hover:text-white"
            }`}
          >
            {icon}
          </span>
          <span className="text-sm tracking-wide">{label}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="fixed left-0 top-0 w-72 h-screen bg-blue-600 text-white p-6 flex flex-col justify-between shadow-2xl z-50">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-blue-600 font-black text-xl italic">Rx</span>
          </div>
          <h2 className="text-2xl font-black tracking-tighter italic">MedRX</h2>
        </div>

        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
          <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-4 px-4 opacity-70">
            Main Menu
          </p>

          {role === "hospital_admin" && (
            <>
              {menuItem("/hospital-admin", "Admin Dashboard", <FaChartLine />)}
              {menuItem("/doctors", "Manage Doctors", <FaUserMd />)}
              {menuItem("/receptionists", "Staff List", <FaUserNurse />)}
              {menuItem("/create-receptionist", "Add Receptionist", <FaUserPlus />)}
              {menuItem("/patients-admin", "Patient Database", <FaUsers />)}
              {menuItem("/doctor-requests-admin", "Verify Doctors", <FaClipboardList />)}
              {menuItem("/twilio-settings", "WhatsApp/SMS", <FaWhatsapp />)}
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