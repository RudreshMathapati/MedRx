
// import React, { useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import API from "../../services/api";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CreateReceptionist = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !form.password || !form.phone) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       await API.post("/users/receptionist", form);

//       toast.success("Receptionist Created Successfully 🎉");

//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//       });
//     } catch (err) {
//       toast.error("Error creating receptionist");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <ToastContainer />

//       {/* HEADER */}
//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//           Create Receptionist 👩‍💼
//         </h1>
//         <p className="text-gray-500 text-sm">
//           Add new receptionist to your hospital system
//         </p>
//       </div>

//       {/* FORM CARD */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-3xl"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <Input
//             label="Full Name"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//           />

//           <Input
//             label="Email Address"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//           />

//           <Input
//             label="Password"
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//           />

//           <Input
//             label="Phone Number"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//           />
//         </div>

//         {/* BUTTON */}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition"
//         >
//           {loading ? "Creating..." : "Create Receptionist"}
//         </button>
//       </motion.div>
//     </DashboardLayout>
//   );
// };

// export default CreateReceptionist;

// /* INPUT COMPONENT */
// const Input = ({ label, name, value, onChange, type = "text" }) => (
//   <div>
//     <label className="text-gray-600 text-sm font-medium">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={`Enter ${label}`}
//       className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
//     />
//   </div>
// );

import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserShield, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa";

const CreateReceptionist = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Prevent default if used inside a form tag
    if (e) e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error("All fields are mandatory");
      return;
    }

    try {
      setLoading(true);
      await API.post("/users/receptionist", form);
      
      toast.success("Receptionist account created! 🎉");
      setForm(initialState); // Clear form on success
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create account";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          Create Receptionist <FaUserShield className="text-blue-600 text-2xl" />
        </h1>
        <p className="text-slate-500 font-medium">
          Register new staff to manage patient appointments and registrations.
        </p>
      </div>

      {/* FORM CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="name"
              icon={<FaUserPlus className="text-slate-400" />}
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Connor"
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              icon={<FaEnvelope className="text-slate-400" />}
              value={form.email}
              onChange={handleChange}
              placeholder="sarah@hospital.com"
            />

            <FormInput
              label="Secure Password"
              name="password"
              type="password"
              icon={<FaLock className="text-slate-400" />}
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              icon={<FaPhone className="text-slate-400" />}
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-10 w-full py-4 rounded-2xl text-lg font-black tracking-tight transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 ${
              loading 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Create Staff Account"
            )}
          </button>

          <p className="mt-6 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
            The receptionist will be able to register patients and view doctor queues.
          </p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

/* REUSABLE INPUT COMPONENT */
const FormInput = ({ label, name, value, onChange, type = "text", placeholder, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-700 placeholder:text-slate-300"
      />
    </div>
  </div>
);

export default CreateReceptionist;