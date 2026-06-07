import React, { useState, useRef } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { initializeSentinelSession } from "../../services/sentinelClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef();

const handleLogin = async () => {
  if (!email || !password) {
    toast.error("Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    const telemetry =
  window.sentinel?.getTelemetry() || {};

console.log(
  "[LOGIN TELEMETRY SENT]"
);

console.log(
  telemetry
);

const res = await axios.post(
  `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/login`,
  {
    email,
    password,
    sentinelTelemetry: telemetry,
  }
);
    console.log("========== LOGIN RESPONSE ==========");
console.log(res.data);
console.log("====================================");

    if (res.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
    }

    localStorage.setItem(
      "token",
      res.data.token
    );

    localStorage.setItem(
      "role",
      res.data.role
    );

    // ==========================
    // Sentinel Session Setup
    // ==========================

   const userId =
  res.data.userId ||
  res.data.user?._id ||
  res.data.user?.id ||
  res.data.user?.userId;

    // Save for persistence after refresh/navigation
    localStorage.setItem(
      "sentinelUserId",
      String(userId)
    );

    localStorage.setItem(
      "sentinelSessionId",
      String(res.data.token)
    );

    initializeSentinelSession(
      userId,
      res.data.token
    );
console.log(
  "ACTUAL USER ID:",
  userId
);
    console.log(
      "[Sentinel] Session Initialized",
      {
        userId,
        sessionId: res.data.token,
      }
    );

    console.log(
      "[Sentinel] Telemetry",
      window.sentinel?.getTelemetry()
    );

    toast.success("Login Successful 🚀");

    setTimeout(() => {
      const routes = {
        super_admin: "/super-admin",
        hospital_admin: "/hospital-admin",
        doctor: "/doctor",
        receptionist: "/receptionist",
      };

      window.location.href =
        routes[res.data.role] || "/";
    }, 1200);

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Invalid credentials"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar />
      <ToastContainer position="top-right" theme="colored" />

      <div className="flex items-center justify-center px-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden w-full max-w-5xl grid md:grid-cols-2 border border-gray-100"
        >
          {/* LEFT SIDE - FORM */}
          <div className="p-8 md:p-14 flex flex-col justify-center">
            <header className="mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Welcome Back <span className="inline-block animate-bounce">👋</span>
              </h2>
              <p className="text-slate-500 text-lg">
                Enter your credentials to access your portal.
              </p>
            </header>

            <div className="space-y-5">
              {/* EMAIL INPUT */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                <div className="flex items-center border-2 border-slate-100 rounded-2xl px-5 py-4 bg-slate-50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 group-focus-within:border-blue-500 group-focus-within:bg-white transition-all duration-300">
                  <FiMail className="text-slate-400 mr-4 text-xl group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="name@hospital.com"
                    className="w-full text-slate-700 outline-none bg-transparent placeholder-slate-400 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && passwordRef.current.focus()}
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                <div className="flex items-center border-2 border-slate-100 rounded-2xl px-5 py-4 bg-slate-50 group-focus-within:ring-4 group-focus-within:ring-blue-500/10 group-focus-within:border-blue-500 group-focus-within:bg-white transition-all duration-300">
                  <FiLock className="text-slate-400 mr-4 text-xl group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full text-slate-700 outline-none bg-transparent placeholder-slate-400 font-medium tracking-widest"
                    value={password}
                    ref={passwordRef}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* LOGIN BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${
                  loading 
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </div>

            {/* REGISTER FOOTER */}
            <div className="mt-10 pt-8 border-t border-slate-100 text-center flex flex-col items-center gap-2">
              <div>
                <p className="text-slate-500 font-medium">
                  Are you a healthcare professional?
                </p>
                <a
                  href="/doctor-register"
                  className="inline-block mt-1 text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                >
                  Register as a Doctor
                </a>
              </div>
              <div className="mt-2 border-t border-gray-100 w-full pt-2">
                <p className="text-slate-500 font-medium">
                  Want to register your hospital with MedRx?
                </p>
                <a
                  href="/hospital-register"
                  className="inline-block mt-1 text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all"
                >
                  Request Hospital Access
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - VISUAL */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-12 relative overflow-hidden">
            {/* Abstract background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/30 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-center"
            >
              <img
                src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                alt="Healthcare Professional"
                className="w-full max-w-sm rounded-[2.5rem] shadow-2xl border-8 border-white/10 mx-auto"
              />
              <div className="mt-10 text-white">
                <h3 className="text-2xl font-bold mb-2 tracking-tight">Streamlining Care</h3>
                <p className="text-blue-100 opacity-80 max-w-xs mx-auto text-sm leading-relaxed">
                  Join our secure medical network to manage prescriptions, patients, and healthcare records seamlessly.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <footer className="text-center text-slate-400 text-sm pb-10">
        &copy; 2026 DocConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;