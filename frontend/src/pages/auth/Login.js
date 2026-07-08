// import React, { useState, useRef } from "react";
// import API from "../../services/api";
// import Navbar from "../../components/Navbar";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";
// import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
// import { initializeSentinelSession } from "../../services/sentinelClient";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const passwordRef = useRef();

// const handleLogin = async () => {
//   if (!email || !password) {
//     toast.error("Please enter email and password");
//     return;
//   }

//   try {
//     setLoading(true);

//     const telemetry =
//   window.sentinel?.getTelemetry() || {};

// console.log(
//   "[LOGIN TELEMETRY SENT]"
// );

// console.log(
//   telemetry
// );

// const res = await API.post(
//   "/auth/login",
//   {
//     email,
//     password,
//     sentinelTelemetry: telemetry,
//   }
// );
//     console.log("========== LOGIN RESPONSE ==========");
// console.log(res.data);
// console.log("====================================");

//     if (res.data.user) {
//       localStorage.setItem(
//         "user",
//         JSON.stringify(res.data.user)
//       );
//     }

//     localStorage.setItem(
//       "token",
//       res.data.token
//     );

//     localStorage.setItem(
//       "role",
//       res.data.role
//     );

//     // ==========================
//     // Sentinel Session Setup
//     // ==========================

//    const userId =
//   res.data.userId ||
//   res.data.user?._id ||
//   res.data.user?.id ||
//   res.data.user?.userId;

//     // Save for persistence after refresh/navigation
//     localStorage.setItem(
//       "sentinelUserId",
//       String(userId)
//     );

//     localStorage.setItem(
//       "sentinelSessionId",
//       String(res.data.token)
//     );

//     initializeSentinelSession(
//       userId,
//       res.data.token
//     );
// console.log(
//   "ACTUAL USER ID:",
//   userId
// );
//     console.log(
//       "[Sentinel] Session Initialized",
//       {
//         userId,
//         sessionId: res.data.token,
//       }
//     );

//     console.log(
//       "[Sentinel] Telemetry",
//       window.sentinel?.getTelemetry()
//     );

//     toast.success("Login Successful 🚀");

//     setTimeout(() => {
//       const routes = {
//         super_admin: "/super-admin",
//         hospital_admin: "/hospital-admin",
//         doctor: "/doctor",
//         receptionist: "/receptionist",
//       };

//       window.location.href =
//         routes[res.data.role] || "/";
//     }, 1200);

//   } catch (err) {
//     toast.error(
//       err.response?.data?.message ||
//       "Invalid credentials"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] font-sans">
//       <Navbar />
//       <ToastContainer position="top-right" theme="colored" />

//       <div className="flex items-center justify-center px-4 py-12 md:py-24">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden w-full max-w-5xl grid md:grid-cols-2 border border-gray-100"
//         >
//           {/* LEFT SIDE - FORM */}
//           <div className="p-8 md:p-14 flex flex-col justify-center">
//             <header className="mb-10">
//               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
//                 Welcome Back <span className="inline-block animate-bounce">👋</span>
//               </h2>
//               <p className="text-slate-500 text-lg">
//                 Enter your credentials to access your portal.
//               </p>
//             </header>

//             <div className="space-y-5">
//               {/* EMAIL INPUT */}
//               <div className="group">
//                 <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
//                 <div className="flex items-center border-2 border-slate-100 rounded-2xl px-5 py-4 bg-slate-50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 group-focus-within:border-blue-500 group-focus-within:bg-white transition-all duration-300">
//                   <FiMail className="text-slate-400 mr-4 text-xl group-focus-within:text-blue-500 transition-colors" />
//                   <input
//                     type="email"
//                     placeholder="name@hospital.com"
//                     className="w-full text-slate-700 outline-none bg-transparent placeholder-slate-400 font-medium"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && passwordRef.current.focus()}
//                   />
//                 </div>
//               </div>

//               {/* PASSWORD INPUT */}
//               <div className="group">
//                 <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
//                 <div className="flex items-center border-2 border-slate-100 rounded-2xl px-5 py-4 bg-slate-50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 group-focus-within:border-blue-500 group-focus-within:bg-white transition-all duration-300">
//                   <FiLock className="text-slate-400 mr-4 text-xl group-focus-within:text-blue-500 transition-colors" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     className="w-full text-slate-700 outline-none bg-transparent placeholder-slate-400 font-medium tracking-widest"
//                     value={password}
//                     ref={passwordRef}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//                   />
//                   <button
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="text-slate-400 hover:text-slate-600 transition-colors p-1"
//                   >
//                     {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-1">
//                 <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
//                   Forgot Password?
//                 </a>
//               </div>

//               {/* LOGIN BUTTON */}
//               <motion.button
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className={`w-full py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${
//                   loading 
//                     ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
//                     : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
//                 }`}
//               >
//                 {loading ? (
//                   <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     Sign In
//                     <FiArrowRight />
//                   </>
//                 )}
//               </motion.button>
//             </div>

//             {/* REGISTER FOOTER */}
//             <div className="mt-10 pt-8 border-t border-slate-100 text-center flex flex-col items-center gap-2">
//               <div>
//                 <p className="text-slate-500 font-medium">
//                   Are you a healthcare professional?
//                 </p>
//                 <a
//                   href="/doctor-register"
//                   className="inline-block mt-1 text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
//                 >
//                   Register as a Doctor
//                 </a>
//               </div>
//               <div className="mt-2 border-t border-gray-100 w-full pt-2">
//                 <p className="text-slate-500 font-medium">
//                   Want to register your hospital with MedRx?
//                 </p>
//                 <a
//                   href="/hospital-register"
//                   className="inline-block mt-1 text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all"
//                 >
//                   Request Hospital Access
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE - VISUAL */}
//           <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-12 relative overflow-hidden">
//             {/* Abstract background shapes */}
//             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
//             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/30 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="relative z-10 text-center"
//             >
//               <img
//                 src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
//                 alt="Healthcare Professional"
//                 className="w-full max-w-sm rounded-[2.5rem] shadow-2xl border-8 border-white/10 mx-auto"
//               />
//               <div className="mt-10 text-white">
//                 <h3 className="text-2xl font-bold mb-2 tracking-tight">Streamlining Care</h3>
//                 <p className="text-blue-100 opacity-80 max-w-xs mx-auto text-sm leading-relaxed">
//                   Join our secure medical network to manage prescriptions, patients, and healthcare records seamlessly.
//                 </p>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       <footer className="text-center text-slate-400 text-sm pb-10">
//         &copy; 2026 DocConnect. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useRef, useEffect } from "react";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowUpRight, ShieldCheck, Activity, Terminal, Crosshair, Cpu, Pill, Stethoscope, Database, HeartPulse, ShieldAlert, Layers } from "lucide-react";
import { initializeSentinelSession } from "../../services/sentinelClient";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef();

  // ─── DECOUPLED PARALLAX SEPARATION ENGINE ────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Common high-fidelity physics profile
  const physics = { damping: 20, stiffness: 120, mass: 0.3 };
  
  // Layer 1: Background Grid (Slowest Layer - deep backdrop anchor)
  const gridX = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), physics);
  const gridY = useSpring(useTransform(mouseY, [-500, 500], [-15, 15]), physics);
  
  // Layer 2: Core Floating Backdrop Nodes (Medium Speed)
  const bgFloatingX = useSpring(useTransform(mouseX, [-500, 500], [-45, 45]), physics);
  const bgFloatingY = useSpring(useTransform(mouseY, [-500, 500], [-45, 45]), physics);

  // Layer 3: Center Midfield Nodes (Fastest Parallax Speed - floats closer to the glass)
  const centerFloatingX = useSpring(useTransform(mouseX, [-500, 500], [85, -85]), physics);
  const centerFloatingY = useSpring(useTransform(mouseY, [-500, 500], [85, -85]), physics);

  // Layer 4: Interactive Glass Card Tilt (Subtle Angular Rotation)
  const cardRotateX = useSpring(useTransform(mouseY, [-400, 400], [5, -5]), physics);
  const cardRotateY = useSpring(useTransform(mouseX, [-400, 400], [-5, 5]), physics);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      mouseX.set(clientX - width / 2);
      mouseY.set(clientY - height / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const telemetry = window.sentinel?.getTelemetry() || {};

      const res = await API.post("/auth/login", {
        email,
        password,
        sentinelTelemetry: telemetry,
      });

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      const userId = res.data.userId || res.data.user?._id || res.data.user?.id || res.data.user?.userId;

      localStorage.setItem("sentinelUserId", String(userId));
      localStorage.setItem("sentinelSessionId", String(res.data.token));

      initializeSentinelSession(userId, res.data.token);

      toast.success("Identity bridge established");

      setTimeout(() => {
        const routes = {
          super_admin: "/super-admin",
          hospital_admin: "/hospital-admin",
          doctor: "/doctor",
          receptionist: "/receptionist",
        };
        window.location.href = routes[res.data.role] || "/";
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0f172a] selection:bg-emerald-500/20 font-sans flex flex-col justify-between overflow-hidden antialiased relative">
      
      {/* ─── IMMERSIVE FUTURE SCREEN VIEWPORT LAYER ─────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Kinetic Grid Layer (Slowest) */}
        <motion.div 
          style={{ x: gridX, y: gridY }}
          className="absolute inset-[-10%] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-70"
        />

        {/* Ambient Chromatic Orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[650px] h-[650px] bg-gradient-to-tr from-emerald-400/20 via-teal-300/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[750px] h-[750px] bg-gradient-to-br from-blue-400/10 via-indigo-400/15 to-transparent rounded-full blur-[160px]" />

        {/* ─── LAYER A: MID-SPEED BACKGROUND NODES ─────────────────────────── */}
        <motion.div 
          style={{ x: bgFloatingX, y: bgFloatingY }} 
          className="absolute w-full h-full hidden lg:block"
        >
          {/* Node 01: Activity/Pulse */}
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[22%] left-[6%] bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center text-emerald-600"
          >
            <Activity size={20} className="animate-pulse" />
          </motion.div>

          {/* Node 02: Shield/Security */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[28%] left-[10%] bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center text-blue-500"
          >
            <ShieldCheck size={20} />
          </motion.div>

          {/* Node 03: CPU/Processing */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[12%] bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center text-indigo-500"
          >
            <Cpu size={20} className="animate-spin-[spin_12s_linear_infinite]" />
          </motion.div>

          {/* Node 04: Pill/Clinical */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[48%] left-[14%] bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center text-teal-500"
          >
            <Pill size={20} />
          </motion.div>

          {/* Node 05: Stethoscope/Practitioner */}
          <motion.div 
            animate={{ scale: [1, 0.95, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[18%] right-[15%] bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center text-slate-700"
          >
            <Stethoscope size={20} />
          </motion.div>

          {/* Node 06: Database/Cloud Matrix */}
          <motion.div 
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[42%] right-[8%] bg-white/60 border border-white/80 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-center text-sky-500"
          >
            <Database size={20} />
          </motion.div>
        </motion.div>

        {/* ─── LAYER B: HIGH-SPEED PARALLAX CENTER MIDFIELD NODES ──────────── */}
        <motion.div
          style={{ x: centerFloatingX, y: centerFloatingY }}
          className="absolute w-full h-full hidden lg:block"
        >
          {/* Node 07: Center-Left HeartPulse */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            className="absolute top-[45%] left-[38%] bg-white/50 border border-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm flex items-center justify-center text-rose-500"
          >
            <HeartPulse size={20} />
          </motion.div>

          {/* Node 08: Center-Right Infrastructure Layers */}
          <motion.div 
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[52%] right-[36%] bg-white/50 border border-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm flex items-center justify-center text-slate-400"
          >
            <Layers size={20} />
          </motion.div>

          {/* Node 09: Center-Top Secure Firewall Alert */}
          <motion.div 
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[32%] left-[50%] transform translate-x-[-50%] bg-white/50 border border-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm flex items-center justify-center text-amber-500"
          >
            <ShieldAlert size={20} />
          </motion.div>
        </motion.div>
      </div>

      {/* ─── MAIN APP CONTENT INTERFACE ──────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col flex-1 justify-between">
        
        {/* PREMIUM NAVIGATION BAR */}
        <header className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-9 h-9 flex items-center justify-center bg-slate-950 text-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-emerald-500/10">
              <Crosshair size={16} className="text-emerald-400 z-10 transition-transform duration-500 group-hover:rotate-90" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-slate-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-950 font-mono lowercase">
              med<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 font-sans font-light">rx_</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 tracking-wider bg-slate-100 border border-slate-200/50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            CLUSTER_ALPHA_ONLINE
          </div>
        </header>

        <ToastContainer position="top-right" theme="light" toastClassName="bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl text-slate-800 font-semibold" />

        {/* MAIN BODY CORE GRID CONTENT */}
        <main className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-[1400px] w-full mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: BRAND NARRATIVE */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center py-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200/60 bg-white/70 backdrop-blur-sm shadow-sm text-slate-500 text-xs font-bold tracking-tight mb-6 w-fit">
              <Terminal size={12} className="text-slate-900" /> Layer 1 Compliance Protocol
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight text-slate-950 leading-[1.08] mb-6">
              Automated clinical <br />
              <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">identity matrices.</span>
            </h1>
            
            <p className="text-slate-400 text-base font-semibold leading-relaxed max-w-md">
              Secure grid routing engineered to connect high-performance diagnostic modules and dynamic health records fluidly.
            </p>

            {/* Performance Indicators Grid */}
            <div className="flex items-center gap-6 mt-12 border-t border-slate-200/60 pt-8 max-w-md">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">CORE CORE</div>
                <div className="text-base font-black text-slate-800 mt-0.5">V3.4 // PROD</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200/80" />
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">ROUTING</div>
                <div className="text-base font-black text-slate-800 mt-0.5 flex items-center gap-1.5">
                  QUANTUM_E2E
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE FORM CARD */}
          <div className="w-full lg:col-span-6 flex justify-center lg:justify-end items-center perspective-[1200px] z-10">
            <motion.div
              style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 140 }}
              className="w-full max-w-[440px] bg-white/60 border border-white/80 rounded-[2.75rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.06)] backdrop-blur-xl relative group"
            >
              {/* Dynamic Laser Highlight Line */}
              <div className="absolute -top-[1px] left-14 right-14 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent group-hover:via-blue-500 transition-all duration-700" />

              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter mb-1">Identity Vector</h2>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Initialize Secure Authentication Handshake</p>
              </div>

              <div className="space-y-5">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase ml-1">Identity Endpoint</label>
                  <div className="relative flex items-center group/input">
                    <Mail size={16} className="absolute left-4 text-slate-400 group-focus-within/input:text-slate-950 transition-colors duration-200" />
                    <input
                      type="email"
                      placeholder="name@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && passwordRef.current.focus()}
                      className="w-full pl-11 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 font-bold outline-none text-sm transition-all duration-200 focus:border-slate-950 focus:bg-white/90 shadow-inner shadow-slate-100/40"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Access Signature</label>
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-950 font-bold transition-colors">
                      Recover Key?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      ref={passwordRef}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full pl-11 pr-12 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 font-bold tracking-wide outline-none text-sm transition-all duration-200 focus:border-slate-950 focus:bg-white/90 shadow-inner shadow-slate-100/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-4 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-200 text-white disabled:text-slate-400 text-sm font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 mt-4 shadow-xl shadow-slate-950/10 relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin"
                      />
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5"
                      >
                        Authorize Matrix Key <ArrowUpRight size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Advanced System Subroutes */}
              <div className="mt-8 pt-6 border-t border-slate-100/80 grid grid-cols-1 gap-2">
                <a href="/doctor-register" className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/70 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all group/link">
                  <span>Register Practitioner Node</span>
                  <span className="text-emerald-500 opacity-0 group-hover/link:opacity-100 transform translate-x-[-4px] group-hover/link:translate-x-0 transition-all duration-300">↗</span>
                </a>
                <a href="/hospital-register" className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100/70 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all group/link">
                  <span>Incorporate New Network Hub</span>
                  <span className="text-slate-900 opacity-0 group-hover/link:opacity-100 transform translate-x-[-4px] group-hover/link:translate-x-0 transition-all duration-300">⚡</span>
                </a>
              </div>
            </motion.div>
          </div>
        </main>

        <footer className="w-full text-center text-slate-400 text-[10px] font-bold font-mono py-6 tracking-wider border-t border-slate-200/40 backdrop-blur-sm">
          SECURE_SYS_CORE // 2026 MEDRX NETWORKS INC. ISO_27001
        </footer>
      </div>
    </div>
  );
};

export default Login;