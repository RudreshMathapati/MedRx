
// import React, { useEffect, useState } from "react";
// import API from "../../services/api";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";

// const AddPatient = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     age: "",
//     gender: "",
//     temperature: "",
//     bp: "",
//     weight: "",
//     pulse: "",
//     symptoms: "",
//     doctorId: "",
//   });

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const fetchDoctors = async () => {
//     try {
//       const res = await API.get("/users/doctors-by-hospital");
//       setDoctors(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.phone || !form.age) {
//       toast.error("Please fill required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       await API.post("/patients/add", form);

//       toast.success("Patient added successfully 🎉");

//       setForm({
//         name: "",
//         phone: "",
//         age: "",
//         gender: "",
//         temperature: "",
//         bp: "",
//         weight: "",
//         pulse: "",
//         symptoms: "",
//         doctorId: "",
//       });
//     } catch (error) {
//       toast.error("Error adding patient");
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
//           Add Patient 🧾
//         </h1>
//         <p className="text-gray-500 text-sm">
//           Register new patient into system
//         </p>
//       </div>

//       {/* FORM CARD */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white shadow-xl rounded-2xl p-6 md:p-8 max-w-4xl"
//       >
//         {/* PERSONAL INFO */}
//         <Section title="Personal Information">
//           <Input name="name" label="Full Name" value={form.name} onChange={handleChange} />
//           <Input name="phone" label="Phone Number" value={form.phone} onChange={handleChange} />
//           <Input name="age" label="Age" value={form.age} onChange={handleChange} />

//           <Select name="gender" label="Gender" value={form.gender} onChange={handleChange}>
//             <option value="">Select Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//           </Select>
//         </Section>

//         {/* VITALS */}
//         <Section title="Vitals">
//           <Input name="temperature" label="Temperature" value={form.temperature} onChange={handleChange} />
//           <Input name="bp" label="Blood Pressure" value={form.bp} onChange={handleChange} />
//           <Input name="weight" label="Weight" value={form.weight} onChange={handleChange} />
//           <Input name="pulse" label="Pulse" value={form.pulse} onChange={handleChange} />
//         </Section>

//         {/* SYMPTOMS */}
//         <Section title="Symptoms">
//           <textarea
//             name="symptoms"
//             value={form.symptoms}
//             onChange={handleChange}
//             placeholder="Enter symptoms..."
//             className="input col-span-2"
//           />
//         </Section>

//         {/* DOCTOR */}
//         <Section title="Assign Doctor">
//           <Select name="doctorId" value={form.doctorId} onChange={handleChange}>
//             <option value="">Select Doctor</option>
//             {doctors.map((doc) => (
//               <option key={doc._id} value={doc._id}>
//                 {doc.name} - {doc.specialization}
//               </option>
//             ))}
//           </Select>
//         </Section>

//         {/* BUTTON */}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition"
//         >
//           {loading ? "Adding..." : "Add Patient"}
//         </button>
//       </motion.div>
//     </DashboardLayout>
//   );
// };

// export default AddPatient;

// /* COMPONENTS */

// const Section = ({ title, children }) => (
//   <div className="mb-6">
//     <h2 className="text-lg font-semibold mb-3 text-gray-700">
//       {title}
//     </h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {children}
//     </div>
//   </div>
// );

// const Input = ({ label, name, value, onChange }) => (
//   <div>
//     <label className="label">{label}</label>
//     <input
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={`Enter ${label}`}
//       className="input"
//     />
//   </div>
// );

// const Select = ({ label, children, ...props }) => (
//   <div>
//     {label && <label className="label">{label}</label>}
//     <select {...props} className="input">
//       {children}
//     </select>
//   </div>
// );

// /* STYLES */
// const styles = `
// .input {
//   @apply border border-gray-200 rounded-xl px-4 py-3 w-full bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition;
// }
// .label {
//   @apply text-gray-600 text-sm font-medium;
// }
// `;

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaUserPlus, FaStethoscope, FaHeartbeat, FaUserMd } from "react-icons/fa";

const AddPatient = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialState = {
    name: "",
    phone: "",
    age: "",
    gender: "",
    temperature: "",
    bp: "",
    weight: "",
    pulse: "",
    symptoms: "",
    doctorId: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/users/doctors-by-hospital");
      setDoctors(res.data);
    } catch (error) {
      console.error("Fetch doctors failed:", error);
      toast.error("Could not load doctors list");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logical Check: Required fields
    if (!form.name || !form.phone || !form.age || !form.doctorId) {
      toast.error("Required: Name, Phone, Age, and Assigned Doctor");
      return;
    }

    try {
      setLoading(true);
      await API.post("/patients/add", form);
      
      toast.success("Patient registered successfully 🎉");
      setForm(initialState); // Clean reset
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error adding patient";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" theme="colored" />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          Register Patient <FaUserPlus className="text-blue-600" />
        </h1>
        <p className="text-slate-500 font-medium">
          Enter patient details to initiate the consultation queue.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PERSONAL INFO */}
          <SectionCard title="Personal Details" icon={<FaUserPlus className="text-blue-500" />}>
            <Input name="name" label="Full Name *" value={form.name} onChange={handleChange} placeholder="John Doe" />
            <Input name="phone" label="Phone Number *" type="tel" value={form.phone} onChange={handleChange} placeholder="01XXX-XXXXXX" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="age" label="Age *" type="number" value={form.age} onChange={handleChange} placeholder="25" />
              <Select name="gender" label="Gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </SectionCard>

          {/* VITALS */}
          <SectionCard title="Patient Vitals" icon={<FaHeartbeat className="text-rose-500" />}>
            <Input name="temperature" label="Temp (°F)" value={form.temperature} onChange={handleChange} placeholder="98.6" />
            <Input name="bp" label="BP (sys/dia)" value={form.bp} onChange={handleChange} placeholder="120/80" />
            <Input name="weight" label="Weight (kg)" value={form.weight} onChange={handleChange} placeholder="70" />
            <Input name="pulse" label="Pulse (bpm)" value={form.pulse} onChange={handleChange} placeholder="72" />
          </SectionCard>

          {/* CLINICAL INFO */}
          <SectionCard title="Clinical Context" icon={<FaStethoscope className="text-amber-500" />}>
            <div className="col-span-full">
              <label className="block text-sm font-bold text-slate-700 mb-2">Primary Symptoms</label>
              <textarea
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                placeholder="Briefly describe the patient's complaints..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[100px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>
          </SectionCard>

          {/* ASSIGNMENT */}
          <SectionCard title="Assign Consultant" icon={<FaUserMd className="text-indigo-500" />}>
            <div className="col-span-full">
              <Select 
                name="doctorId" 
                label="Select Doctor *" 
                value={form.doctorId} 
                onChange={handleChange}
              >
                <option value="">Choose a specialized consultant...</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.name} — {doc.specialization}
                  </option>
                ))}
              </Select>
            </div>
          </SectionCard>

          {/* SUBMIT */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[2rem] text-lg font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Register & Add to Queue"
              )}
            </button>
            <button
              type="button"
              onClick={() => setForm(initialState)}
              className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-[2rem] transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

/* REUSABLE SUB-COMPONENTS */

const SectionCard = ({ title, children, icon }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] p-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
    />
  </div>
);

const Select = ({ label, name, value, onChange, children }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700 appearance-none cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default AddPatient;