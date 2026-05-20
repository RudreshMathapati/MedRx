import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiShield, FiActivity, 
  FiUsers, FiPlusCircle, FiCheckCircle 
} from "react-icons/fi";
import Navbar from "../../components/Navbar"; // Use your existing Navbar

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-6">
                <FiActivity className="animate-pulse" /> Next-Gen Healthcare Management
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                Streamlining Care for <span className="text-blue-600">Modern Hospitals.</span>
              </h1>
              <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
                MedRX provides hospital admins, doctors, and receptionists with a 
                unified platform to manage records, approvals, and patient care seamlessly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all flex items-center gap-2 group">
                  Access Portal <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/doctor-register" className="px-8 py-4 bg-white border-2 border-slate-100 hover:border-blue-600 text-slate-700 rounded-2xl font-bold transition-all">
                  Join as a Doctor
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[3rem] blur-3xl"></div>
              <img 
                src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" 
                alt="Medical Dashboard Preview"
                className="relative rounded-[2.5rem] shadow-2xl border-8 border-white"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-16 uppercase tracking-widest text-slate-400">
            Engineered for Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FiShield className="text-blue-600" />}
              title="Secure Records"
              desc="End-to-end encrypted medical records ensuring patient privacy and compliance."
            />
            <FeatureCard 
              icon={<FiUsers className="text-emerald-600" />}
              title="Staff Management"
              desc="Real-time control over doctor approvals and receptionist assignments."
            />
            <FeatureCard 
              icon={<FiActivity className="text-rose-600" />}
              title="Live Analytics"
              desc="Track patient traffic and clinical operations through an intuitive dashboard."
            />
          </div>
        </div>
      </section>

      {/* --- ROLE SELECTOR / CTA --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-8">
                Ready to transform your clinical workflow?
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <RoleBadge icon={<FiCheckCircle />} text="Hospital Admin" />
                <RoleBadge icon={<FiCheckCircle />} text="Specialist Doctor" />
                <RoleBadge icon={<FiCheckCircle />} text="Front Desk" />
              </div>
              <Link 
                to="/login" 
                className="mt-12 inline-block px-12 py-5 bg-blue-600 text-white font-black rounded-2xl text-lg hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20"
              >
                Launch MedRX Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center text-slate-400 border-t border-slate-100">
        <p className="font-bold text-slate-900 mb-2 tracking-tighter text-xl">
          Med<span className="text-blue-600">RX</span>
        </p>
        <p className="text-sm">© 2026 DocConnect Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 text-left"
  >
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-8">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-4 text-slate-800">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const RoleBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white font-bold text-sm">
    <span className="text-blue-400">{icon}</span> {text}
  </div>
);

export default LandingPage;