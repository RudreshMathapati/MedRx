import React, { useState, useRef } from "react";
import { motion, useSpring, useTransform, useScroll, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, ShieldCheck, Activity, Users, Terminal, Layers, 
  HeartPulse, Cpu, ChevronRight, Radio, Fingerprint, Crosshair,
  TrendingUp, Zap, Server, Network, Shield, Database, Eye, Globe,
  FileText, Workflow, Code, Lock, RefreshCw, Key, HardDrive, Stethoscope, Menu
} from "lucide-react";

const fv = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const LandingPage = () => {
  const [activeMatrixNode, setActiveMatrixNode] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  // ─── HIGH-PERFORMANCE SCROLL ENGINE ────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollYSpring = useSpring(scrollYProgress, { stiffness: 60, damping: 30, mass: 0.8 });

  // ─── SCROLL-DRIVEN TRAVEL & TRANSFORMATION ANIMATIONS ──────────────
  const heartScale = useTransform(scrollYSpring, [0, 0.4, 0.8, 1], [1.1, 1.18, 1.05, 0.95]);
  const heartY = useTransform(scrollYSpring, [0, 0.6, 1], [-20, 120, 20]); 
  const heartRotate = useTransform(scrollYSpring, [0, 1], [0, 22]); 


  // Cleaned environment map ensuring beautiful glowing transitions without messy dark boxes
  const heartFilter = useTransform(
    scrollYSpring, 
    [0, 0.2, 0.5, 0.8], 
    [
      "drop-shadow(0px 0px 35px rgba(16,185,129,0.6)) brightness(1.25)",
      "drop-shadow(0px 0px 55px rgba(20,184,166,0.85)) brightness(1.4)",
      "drop-shadow(0px 0px 55px rgba(14,165,233,0.85)) brightness(1.4)",
      "drop-shadow(0px 0px 35px rgba(16,185,129,0.5)) brightness(1.1)"
    ]
  );

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen w-full bg-[#fafbfc] text-[#0f172a] font-sans overflow-x-hidden antialiased relative selection:bg-emerald-500/20 scroll-smooth"
    >
      
      {/* ─── PERSISTENT GLOWING CORE ANATOMICAL CANVAS ─── */}
      <div className="fixed right-[0.01%] top-[18%] w-[550px] h-[550px] pointer-events-none z-30 hidden lg:block overflow-visible" style={{ mixBlendMode: "multiply" }}>
        {/* Scroll Motion Wrapper */}
        <motion.div
          style={{ 
            scale: heartScale, 
            y: heartY, 
            rotate: heartRotate,
          }}
          className="w-full h-full flex items-center justify-center transform-gpu"
        >
          {/* Smooth Continuous Floating Loop Wrapper (Isolates float from scroll properties) */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <img 
              src="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTdvAmPRayrnSH6ngWipgRXVZ6pCWWg7haSrjwAixhuPlFKoFh5V94eQM-fWuaLT7mQ6YOThZ0VXuNMoDM" 
              alt="Clinical Core Anchored Map" 
              className="max-w-full max-h-full object-contain"
              style={{ 
                mixBlendMode: "multiply",
                filter: "contrast(1.1) brightness(1.05)"
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ─── DYNAMIC BACKDROP PLATFORM ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-40" />

        <motion.div 
          animate={{ x: [0, 20, -20, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-tr from-emerald-400/10 via-teal-300/5 to-transparent rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] right-[-5%] w-[900px] h-[900px] bg-gradient-to-br from-blue-400/10 via-indigo-500/5 to-transparent rounded-full blur-[140px]" 
        />

        {/* BACKGROUND ICON CONSTELLATION MATRIX */}
        <div className="absolute inset-0 w-full h-full opacity-60">
          {[
            { Icon: Database, top: "12%", left: "5%", delay: 0 },
            { Icon: Network, top: "22%", left: "38%", delay: 2, pulse: true },
            { Icon: Shield, top: "68%", left: "8%", delay: 1.5 },
            { Icon: Fingerprint, top: "52%", left: "18%", delay: 3 },
            { Icon: Eye, top: "78%", left: "32%", delay: 0.5 },
            { Icon: Globe, top: "32%", left: "24%", delay: 4 },
            { Icon: Activity, top: "8%", left: "48%", delay: 2.5 },
            { Icon: FileText, top: "18%", left: "72%", delay: 1 },
            { Icon: Workflow, top: "42%", left: "82%", delay: 3.5, pulse: true },
            { Icon: Code, top: "62%", left: "68%", delay: 2 },
            { Icon: Lock, top: "85%", left: "78%", delay: 0 },
            { Icon: RefreshCw, top: "28%", left: "58%", delay: 4.5 },
            { Icon: Key, top: "74%", left: "52%", delay: 1.8 },
            { Icon: HardDrive, top: "48%", left: "10%", delay: 2.9 }
          ].map(({ Icon, top, left, delay, pulse }, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 8 + (idx % 3), repeat: Infinity, ease: "easeInOut", delay }}
              className="absolute text-slate-300/60"
              style={{ top, left }}
            >
              <Icon size={14} className={pulse ? "animate-pulse text-emerald-500/50" : ""} />
            </motion.div>
          ))}
        </div>

        {/* Global Continuous Metric SVG Pipeline */}
        <svg className="absolute w-[160vw] h-[400px] left-[-30vw] top-[35%] opacity-30 will-change-transform" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M 0,200 L 600,200 L 630,170 L 650,230 L 680,40 L 710,250 L 730,190 L 750,200 L 1150,200 L 1170,150 L 1190,260 L 1210,20 L 1240,280 L 1260,180 L 1290,200 L 2400,200"
            fill="none"
            stroke="url(#premiumGlow)"
            strokeWidth="2"
            strokeDasharray="2600"
            animate={{ strokeDashoffset: [2600, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          />
          <defs>
            <linearGradient id="premiumGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.1" />
              <stop offset="48%" stopColor="#10b981" stopOpacity="1" />
              <stop offset="52%" stopColor="#0284c7" stopOpacity="1" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ─── PREMIUM FIXED GLASS NAVIGATION ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-6 md:px-12 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-9 h-9 flex items-center justify-center bg-slate-950 text-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <Crosshair size={16} className="text-emerald-400 z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-950 font-mono lowercase">
            med<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 font-sans font-light">rx_</span>
          </span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          <a href="#hero" className="hover:text-slate-950 transition-colors">01 // Home</a>
          <a href="#matrices" className="hover:text-slate-950 transition-colors">02 // Departments</a>
          <a href="#telemetry" className="hover:text-slate-950 transition-colors">03 // Features</a>
          <a href="#compliance" className="hover:text-slate-950 transition-colors">04 // Get Started</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:inline-block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors">
            Login
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-600 tracking-wider bg-white border border-slate-200 px-3 py-2 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM ONLINE
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1 text-slate-700 hover:text-slate-950 transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[73px] bg-white border-b border-slate-200 z-40 p-6 shadow-xl flex flex-col gap-4 font-mono text-xs uppercase font-bold lg:hidden">
          <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600">01 // Home</a>
          <a href="#matrices" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600">02 // Departments</a>
          <a href="#telemetry" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600">03 // Features</a>
          <a href="#compliance" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-600">04 // Get Started</a>
          <Link to="/login" className="py-2 text-emerald-600 border-t border-slate-100 pt-4">Login to Platform</Link>
        </div>
      )}

      {/* ─── SCROLL SECTION 01: HERO MODULE ─── */}
      <section id="hero" className="min-h-[calc(100vh-73px)] py-12 w-full max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-8 items-center relative z-10">
        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="lg:col-span-7 flex flex-col justify-center space-y-6"
        >
          <motion.div variants={fv} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm w-fit text-[10px] font-mono font-bold tracking-tight text-slate-500">
            <Radio size={12} className="text-emerald-500 animate-pulse" /> MEDRX // SYSTEM ONLINE
          </motion.div>
          <motion.h1 variants={fv} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.05] max-w-2xl">
            Smart Hospital <br />Management, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 font-sans font-light">built for doctors.</span>
          </motion.h1>
          <motion.p variants={fv} className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
            MedRx connects doctors, patients, pharmacists, and lab staff into one secure platform — managing prescriptions, appointments, vitals, and medical records in real time.
          </motion.p>
          <motion.div variants={fv} className="flex flex-wrap gap-3 pt-2">
            <Link to="/login" className="px-6 py-3.5 bg-slate-950 text-white text-[11px] font-mono font-bold tracking-tight rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2 group">
              Sign In <ArrowUpRight size={14} className="text-emerald-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link to="/doctor-register" className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-[11px] font-mono font-bold tracking-tight rounded-xl shadow-sm transition-all flex items-center gap-1 group">
              Register as Doctor <ChevronRight size={13} className="text-slate-400 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center min-h-[300px]">
          {/* <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
            className="w-full max-w-[340px] bg-white/90 border border-slate-200 p-5 rounded-2xl shadow-xl backdrop-blur-md font-mono text-[10px] text-slate-500 space-y-3 z-10"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-950 uppercase tracking-wider">HMS Parameters</span>
              <span className="text-emerald-500 flex items-center gap-1 font-bold animate-pulse">● OPERATIONAL</span>
            </div>
            <div className="flex justify-between"><span>ADMISSION_SOCKETS</span><span className="font-bold text-slate-950">94.24/s</span></div>
            <div className="flex justify-between"><span>HL7_EHR_LATENCY</span><span className="font-bold text-slate-950">4.8ms</span></div>
            <div className="flex justify-between"><span>ENCRYPTED_THREADS</span><span className="font-bold text-slate-950">1,240</span></div>
          </motion.div> */}
        </div>
      </section>

      {/* ─── SCROLL-REACTIVE INTERSTITIAL: THE GLOWING DARK ZONE ─── */}
      <section className="bg-[#090d16] text-white py-24 my-12 w-full relative z-20 overflow-hidden border-y border-slate-800">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-widest">
              Unified Patient Records
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Every patient, every visit.<br />
              <span className="text-slate-500 font-light">One complete medical history.</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
              MedRx keeps a full patient timeline — from admission and diagnosis to prescriptions, lab reports, and discharge — accessible instantly by authorized medical staff.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-[#111726]/90 backdrop-blur-md border border-slate-800 p-5 md:p-6 rounded-2xl font-mono text-[11px] text-slate-300 space-y-2.5 shadow-2xl">
              <p className="text-emerald-400 font-bold"># medrx patient --status --all</p>
              <p className="text-slate-400">● Patient: Arjun Mehta &nbsp;| Ward 3B &nbsp;| Dr. Sharma</p>
              <p className="text-slate-400 pl-4">Diagnosis: Hypertension &nbsp;| Rx: Amlodipine 5mg</p>
              <p className="text-cyan-400 pl-4 font-semibold">Vitals: BP 128/82 &nbsp;| SpO2 98% &nbsp;| Temp 98.4°F</p>
              <p className="text-slate-500 italic mt-2">// Next appointment: 2026-07-12 10:30 AM — cardiology follow-up</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCROLL SECTION 02: CLINICAL CONTROL PANEL ─── */}
      <ScrollSection id="matrices">
        <div className="w-full grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
              <Stethoscope size={16} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
              Role-Based Access for Every Department
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
              Doctors, nurses, pharmacists, lab technicians, and admins each get a tailored workspace — with permissions and workflows designed for their role.
            </p>
          </div>
          <div className="lg:col-span-6 w-full flex lg:justify-end">
            <div className="w-full max-w-[460px] bg-white border border-slate-200 rounded-[2rem] p-5 md:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">What MedRx covers</span>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <ShieldCheck size={16} />, label: "Patient Admissions & Records", desc: "Register patients, manage ward assignments, and maintain complete medical histories.", cluster: "PATIENTS" },
                  { icon: <Users size={16} />, label: "Doctor & Staff Management", desc: "Assign roles, manage schedules, and control access for all hospital staff.", cluster: "STAFF" },
                  { icon: <HeartPulse size={16} />, label: "Vitals & Prescription Tracking", desc: "Log vitals, issue digital prescriptions, and track medication compliance in real time.", cluster: "CLINICAL" }
                ].map((node, index) => {
                  const isActive = activeMatrixNode === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveMatrixNode(index)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${
                        isActive ? "bg-slate-50 border-slate-300 shadow-sm" : "bg-white border-slate-100 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        <div className={`p-2 rounded-xl mt-0.5 border transition-colors duration-200 ${
                          isActive ? "bg-slate-950 text-emerald-400 border-slate-950" : "bg-white text-slate-400 border-slate-200"
                        }`}>
                          {node.icon}
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-900 tracking-tight">{node.label}</h4>
                            <span className="text-[8px] font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 font-bold">{node.cluster}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{node.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* ─── SCROLL SECTION 03: LIVE METRIC TELEMETRY GRID ─── */}
      <ScrollSection id="telemetry">
        <div className="w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "APPOINTMENTS", value: "Real-time", sub: "BOOKING & SCHEDULING", icon: <Cpu className="text-blue-500" size={14} /> },
                { title: "PRESCRIPTIONS", value: "Digital", sub: "E-PRESCRIPTION ENGINE", icon: <Zap className="text-emerald-500" size={14} /> },
                { title: "DATA SECURITY", value: "AES-256", sub: "ENCRYPTED PATIENT DATA", icon: <Fingerprint className="text-purple-500" size={14} /> },
                { title: "VITALS MONITOR", value: "Live", sub: "CONTINUOUS HEALTH TRACKING", icon: <Activity className="text-cyan-500" size={14} /> }
              ].map((card, i) => (
                <motion.div 
                  key={i} whileHover={{ y: -4 }}
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400">{card.title}</span>
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 font-mono">{card.value}</h3>
                  <p className="text-[9px] font-mono font-bold text-slate-400 tracking-tight mt-0.5">{card.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shadow-sm">
              <TrendingUp size={16} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
              Everything your hospital needs, in one place.
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
              Book appointments, write prescriptions, monitor vitals, manage lab reports — all within a single secure, HIPAA-compliant platform built for modern healthcare teams.
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* ─── SCROLL SECTION 04: LEDGER SECURITY / CTA ─── */}
      <ScrollSection id="compliance">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-mono font-bold tracking-wider uppercase mx-auto shadow-sm">
            <Server size={11} className="text-emerald-400" /> MedRx Platform
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-950 leading-tight">
            Ready to transform <br />your hospital?
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md mx-auto">
            Join hospitals already using MedRx to streamline patient care, reduce paperwork, and keep every department connected in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/doctor-register" className="px-6 py-3.5 bg-slate-950 text-white text-xs font-mono font-bold tracking-wider uppercase rounded-xl shadow-lg hover:bg-slate-900 transition-all">
              Register as Doctor
            </Link>
            <Link to="/login" className="px-6 py-3.5 bg-white border border-slate-200 text-slate-800 text-xs font-mono font-bold tracking-wider uppercase rounded-xl shadow-sm hover:border-slate-300 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* ─── TERMINAL CONSOLE FOOTER ─── */}
      <footer className="w-full text-center text-slate-400 text-[9px] font-bold font-mono py-6 tracking-wider border-t border-slate-200 bg-white relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 lg:px-12 max-w-[1440px] mx-auto select-none">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-slate-900" /> © 2026 MEDRX — ALL RIGHTS RESERVED
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400">
          <span>HIPAA COMPLIANT</span>
          <span>•</span>
          <span>SECURE PATIENT DATA</span>
          <span>•</span>
          <span>BUILT FOR HEALTHCARE</span>
        </div>
      </footer>

    </div>
  );
};

const ScrollSection = ({ children, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.12 });

  return (
    <section 
      id={id} ref={ref}
      className="py-20 md:py-32 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex items-center relative z-10 min-h-[70vh]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 80, damping: 25 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </section>
  );
};

export default LandingPage;


