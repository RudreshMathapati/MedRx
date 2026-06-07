import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiActivity } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Doctors", path: "/doctor-register" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-100 py-3" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <FiActivity className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">
            Med<span className="text-blue-600">RX</span>
          </span>
        </motion.div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              {link.name}
            </button>
          ))}
          
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Login
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden text-2xl text-slate-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-50 p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
              className="text-left py-2 font-bold text-slate-600"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
          >
            Login
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;