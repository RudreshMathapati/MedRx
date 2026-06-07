import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { FiTarget, FiShield, FiCpu, FiCheckCircle } from "react-icons/fi";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans pt-24">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
              Revolutionizing <span className="text-blue-600">Patient Care</span> Through Technology.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              MedRX is more than just a management tool; it's a digital ecosystem 
              designed to eliminate healthcare friction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight uppercase">Our Mission</h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                Our mission is to empower healthcare providers by giving them 
                smarter tools to manage their clinical operations. We believe that 
                every minute a doctor saves on paperwork is a minute they can 
                spend saving a life.
              </p>
              <ul className="space-y-4">
                {[
                  "Reducing administrative overhead by 40%",
                  "Instant access to secure medical records",
                  "Seamless communication across staff layers"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                    <FiCheckCircle className="text-blue-600" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] blur-2xl opacity-50"></div>
              <img 
                src="https://img.freepik.com/free-vector/health-professional-team-illustration_23-2148493139.jpg" 
                alt="Healthcare Team" 
                className="relative rounded-[2.5rem] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 md:mx-10 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="container mx-auto px-10 relative z-10 text-center">
          <h2 className="text-3xl font-black mb-16 uppercase tracking-[0.2em] opacity-50">The MedRX Standard</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <PillarCard 
              icon={<FiShield />} 
              title="Secure" 
              desc="Built with enterprise-grade encryption to ensure patient data stays private." 
            />
            <PillarCard 
              icon={<FiTarget />} 
              title="Accurate" 
              desc="Precise tracking of prescriptions, diagnostics, and patient history." 
            />
            <PillarCard 
              icon={<FiCpu />} 
              title="Advanced" 
              desc="A cloud-native platform that grows with your hospital's needs." 
            />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="pb-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 mb-8">Join the Healthcare Revolution</h2>
          <button 
             onClick={() => window.location.href = '/login'}
             className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all text-lg"
          >
            Get Started with MedRX
          </button>
        </div>
      </section>

      <footer className="py-10 text-center border-t border-slate-100 text-slate-400 text-sm">
        &copy; 2026 MedRX Systems. Empowering Mathapati Hospital & Beyond.
      </footer>
    </div>
  );
};

const PillarCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-sm"
  >
    <div className="text-4xl text-blue-400 mb-6 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export default AboutPage;