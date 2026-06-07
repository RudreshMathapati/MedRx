// import React, { useState } from "react";
// import API from "../../services/api";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion, AnimatePresence } from "framer-motion";
// import { BuildingOffice2Icon, UserCircleIcon, CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";

// const CreateHospital = () => {
//   const [loading, setLoading] = useState(false);
//   const [hospitalCode, setHospitalCode] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     email: "",
//     adminName: "",
//     adminEmail: "",
//     adminPassword: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !form.adminEmail) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await API.post("/hospitals/create", form);

//       setHospitalCode(res.data.hospitalCode);
//       toast.success("Hospital created successfully 🎉");

//       setForm({
//         name: "",
//         address: "",
//         phone: "",
//         email: "",
//         adminName: "",
//         adminEmail: "",
//         adminPassword: "",
//       });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error creating hospital");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <ToastContainer position="top-right" theme="colored" />

//       <div className="max-w-5xl mx-auto py-8 px-4">
//         {/* HEADER */}
//         <div className="mb-10 text-center md:text-left">
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="flex items-center justify-center md:justify-start gap-3 mb-2"
//           >
//             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
//               <BuildingOffice2Icon className="w-8 h-8" />
//             </div>
//             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
//               Hospital Registration
//             </h1>
//           </motion.div>
//           <p className="text-gray-500 text-lg ml-1">
//             Expand the network by onboarding a new healthcare facility.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* MAIN FORM */}
//           <div className="lg:col-span-2 space-y-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white border border-gray-100 shadow-2xl shadow-blue-100/50 rounded-3xl p-6 md:p-10"
//             >
//               {/* HOSPITAL INFO SECTION */}
//               <Section icon={<SparklesIcon className="w-5 h-5 text-blue-500" />} title="Facility Particulars">
//                 <Input name="name" label="Hospital Name" value={form.name} onChange={handleChange} placeholder="St. Mary's General" />
//                 <Input name="email" label="Official Email" value={form.email} onChange={handleChange} placeholder="admin@hospital.com" />
//                 <Input name="phone" label="Contact Number" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
//                 <Input name="address" label="Physical Address" value={form.address} onChange={handleChange} placeholder="123 Medical Way, NY" />
//               </Section>

//               <hr className="my-8 border-gray-100" />

//               {/* ADMIN INFO SECTION */}
//               <Section icon={<UserCircleIcon className="w-5 h-5 text-indigo-500" />} title="Master Administrator">
//                 <Input name="adminName" label="Full Name" value={form.adminName} onChange={handleChange} placeholder="John Doe" />
//                 <Input name="adminEmail" label="Admin Login Email" value={form.adminEmail} onChange={handleChange} placeholder="john.doe@hospital.com" />
//                 <div className="md:col-span-2">
//                   <Input name="adminPassword" label="Secure Password" type="password" value={form.adminPassword} onChange={handleChange} placeholder="••••••••" />
//                 </div>
//               </Section>

//               {/* ACTION BUTTON */}
//               <motion.button
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className={`w-full mt-10 relative overflow-hidden group py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 ${
//                   loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
//                 }`}
//               >
//                 <span className="relative z-10 flex items-center justify-center gap-2">
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     "Register Hospital"
//                   )}
//                 </span>
//               </motion.button>
//             </motion.div>
//           </div>

//           {/* SIDEBAR / STATUS */}
//           <div className="lg:col-span-1">
//             <AnimatePresence>
//               {hospitalCode ? (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
//                 >
//                   <div className="relative z-10 text-center">
//                     <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-emerald-100 opacity-80" />
//                     <h3 className="text-xl font-bold mb-2">Success!</h3>
//                     <p className="text-emerald-50 text-sm mb-6">The hospital has been provisioned. Share this code with the admin.</p>
//                     <div className="bg-white/20 backdrop-blur-md rounded-2xl py-4 px-2 border border-white/30">
//                       <span className="block text-xs uppercase tracking-widest text-emerald-100 mb-1 font-semibold">Hospital Access Code</span>
//                       <span className="text-3xl font-mono font-black tracking-wider">{hospitalCode}</span>
//                     </div>
//                   </div>
//                   {/* Decorative Circle */}
//                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
//                 </motion.div>
//               ) : (
//                 <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                     <BuildingOffice2Icon className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <h4 className="text-gray-600 font-semibold italic">Awaiting Submission</h4>
//                   <p className="text-gray-400 text-sm mt-2">Complete the form to generate the unique hospital access credentials.</p>
//                 </div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// /* REFINED SUB-COMPONENTS */

// const Section = ({ title, icon, children }) => (
//   <div className="mb-4">
//     <div className="flex items-center gap-2 mb-6">
//       {icon}
//       <h2 className="text-xl font-bold text-gray-800 tracking-tight">
//         {title}
//       </h2>
//     </div>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//       {children}
//     </div>
//   </div>
// );

// const Input = ({ label, name, value, onChange, type = "text", placeholder }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-sm font-semibold text-gray-700 ml-1 italic">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 placeholder:text-gray-300 text-gray-700 font-medium"
//     />
//   </div>
// );

// export default CreateHospital;
import React, { useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BuildingOffice2Icon, 
  UserCircleIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";

const CreateHospital = () => {
  const [loading, setLoading] = useState(false);
  const [hospitalCode, setHospitalCode] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    // NEW: Twilio Communication Fields
    twilioSid: "",
    twilioToken: "",
    whatsappNumber: "",
    smsNumber: "",
    isEnabled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.adminEmail || !form.adminPassword) {
  toast.error("Please fill all required fields including password");
  return;
}

    try {
      setLoading(true);
      // The backend will receive this 'form' object and should nest the twilio 
      // fields inside a 'communicationSettings' object in the Model.
      console.log("Sending data:", form);
      const res = await API.post("/hospitals/create", form);

      setHospitalCode(res.data.hospitalCode);
      toast.success("Hospital & Communication Config saved 🎉");

      setForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
        twilioSid: "",
        twilioToken: "",
        whatsappNumber: "",
        smsNumber: "",
        isEnabled: false,
      });
    } catch (err) {
      console.error("FULL ERROR:", err);

toast.error(
  err.response?.data?.message ||
  err.message ||
  "Error creating hospital"
);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center md:justify-start gap-3 mb-2"
          >
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <BuildingOffice2Icon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Hospital Onboarding
            </h1>
          </motion.div>
          <p className="text-gray-500 text-lg ml-1">
            Setup facility details and automated messaging credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 shadow-2xl shadow-blue-100/50 rounded-3xl p-6 md:p-10"
            >
              {/* HOSPITAL INFO SECTION */}
              <Section icon={<SparklesIcon className="w-5 h-5 text-blue-500" />} title="Facility Particulars">
                <Input name="name" label="Hospital Name" value={form.name} onChange={handleChange} placeholder="MedRx Clinic" />
                <Input name="email" label="Official Email" value={form.email} onChange={handleChange} placeholder="contact@hospital.com" />
                <Input name="phone" label="Contact Number" value={form.phone} onChange={handleChange} placeholder="+91 99999 88888" />
                <Input name="address" label="Physical Address" value={form.address} onChange={handleChange} placeholder="City Center, Mumbai" />
              </Section>

              <hr className="my-10 border-gray-100" />

              {/* TWILIO CONFIG SECTION */}
              <Section icon={<ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-500" />} title="WhatsApp & SMS Config (Twilio)">
                <div className="md:col-span-2 bg-emerald-50/50 p-4 rounded-2xl mb-2 flex items-center justify-between border border-emerald-100">
                   <div>
                      <p className="text-sm font-bold text-emerald-800">Enable Automated Notifications</p>
                      <p className="text-xs text-emerald-600">Allow system to send Rx via WhatsApp/SMS</p>
                   </div>
                   <input 
                    type="checkbox" 
                    name="isEnabled"
                    checked={form.isEnabled}
                    onChange={handleChange}
                    className="w-6 h-6 rounded-md accent-emerald-500 cursor-pointer"
                   />
                </div>
                <Input name="twilioSid" label="Twilio Account SID" value={form.twilioSid} onChange={handleChange} placeholder="ACxxxxxxxxxxxxxx" />
                <Input name="twilioToken" label="Twilio Auth Token" type="password" value={form.twilioToken} onChange={handleChange} placeholder="••••••••" />
                <Input name="whatsappNumber" label="WhatsApp Sender No." value={form.whatsappNumber} onChange={handleChange} placeholder="+14155238886" />
                <Input name="smsNumber" label="SMS Sender No." value={form.smsNumber} onChange={handleChange} placeholder="+1234567890" />
              </Section>

              <hr className="my-10 border-gray-100" />

              {/* ADMIN INFO SECTION */}
              <Section icon={<UserCircleIcon className="w-5 h-5 text-indigo-500" />} title="Master Administrator">
                <Input name="adminName" label="Full Name" value={form.adminName} onChange={handleChange} placeholder="Admin Name" />
                <Input name="adminEmail" label="Admin Login Email" value={form.adminEmail} onChange={handleChange} placeholder="admin@medrx.com" />
                <div className="md:col-span-2">
                  <Input name="adminPassword" label="Secure Password" type="password" value={form.adminPassword} onChange={handleChange} placeholder="••••••••" />
                </div>
              </Section>

              {/* ACTION BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-10 relative overflow-hidden group py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-200"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Processing..." : "Create Hospital & Enable Services"}
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* SIDEBAR STATUS */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {hospitalCode ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl sticky top-8"
                >
                  <div className="text-center">
                    <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-emerald-100" />
                    <h3 className="text-xl font-bold mb-2">Hospital Live!</h3>
                    <p className="text-emerald-50 text-sm mb-6">Configuration and messaging lines are now active.</p>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl py-4 border border-white/30">
                      <span className="block text-xs uppercase text-emerald-100 mb-1 font-semibold tracking-widest">Access Code</span>
                      <span className="text-3xl font-mono font-black tracking-wider">{hospitalCode}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] sticky top-8">
                  <ShieldCheckIcon className="w-12 h-12 text-gray-300 mb-4" />
                  <h4 className="text-gray-600 font-semibold italic">Awaiting Config</h4>
                  <p className="text-gray-400 text-sm mt-2">Hospital credentials and Twilio keys will appear here after registration.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1 italic">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 font-medium"
    />
  </div>
);

export default CreateHospital;