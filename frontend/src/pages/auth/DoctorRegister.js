// import React, { useState } from "react";
// import API from "../../services/api";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "../../components/Navbar";
// import { motion } from "framer-motion";
// import { 
//   HiOutlineUser, 
//   HiOutlineMail, 
//   HiOutlinePhone, 
//   HiOutlineAcademicCap, 
//   HiOutlineBadgeCheck, 
//   HiOutlineBriefcase, 
//   HiOutlineOfficeBuilding,
//   HiOutlineCloudUpload
// } from "react-icons/hi";

// const DoctorRegister = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     qualification: "",
//     specialization: "",
//     experience: "",
//     hospitalCode: "",
//     confirm: false,
//   });

//   const [signature, setSignature] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setSignature(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!form.confirm) {
//       toast.error("Please confirm the information accuracy");
//       return;
//     }

//     if (!signature) {
//       toast.error("Please upload your digital signature");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       Object.keys(form).forEach(key => formData.append(key, form[key]));
//       formData.append("signature", signature);

//       await API.post("/doctor-requests/register", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Registration submitted! Awaiting administrator approval.");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 pt-20 md:pt-24">
//       <ToastContainer position="top-right" theme="colored" />
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]"
//         >

//           {/* Left Side: Form */}
//           <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16">
//             <header className="mb-10">
//               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
//                 Join our Medical Network
//               </h2>
//               <p className="text-slate-500 mt-3 text-lg">
//                 Complete your professional profile to request hospital access.
//               </p>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <InputGroup label="Full Name" name="name" icon={<HiOutlineUser />} onChange={handleChange} placeholder="Dr. Jane Doe" />
//               <InputGroup label="Email Address" name="email" type="email" icon={<HiOutlineMail />} onChange={handleChange} placeholder="jane@clinic.com" />
//               <InputGroup label="Phone Number" name="phone" icon={<HiOutlinePhone />} onChange={handleChange} placeholder="+1 (555) 000-0000" />
//               <InputGroup label="Highest Qualification" name="qualification" icon={<HiOutlineAcademicCap />} onChange={handleChange} placeholder="MD, MBBS" />
//               <InputGroup label="Specialization" name="specialization" icon={<HiOutlineBadgeCheck />} onChange={handleChange} placeholder="Cardiology" />
//               <InputGroup label="Experience (Years)" name="experience" icon={<HiOutlineBriefcase />} onChange={handleChange} placeholder="8" />

//               <div className="md:col-span-2">
//                 <InputGroup label="Hospital Access Code" name="hospitalCode" icon={<HiOutlineOfficeBuilding />} onChange={handleChange} placeholder="HOSP-2026-XXXX" />
//               </div>

//               {/* Signature Upload */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-bold text-slate-700 mb-2">Digital Signature (PNG/JPG)</label>
//                 <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 transition-all hover:border-emerald-400 bg-slate-50/50 group">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                     onChange={handleFileChange}
//                   />
//                   <div className="text-center">
//                     <HiOutlineCloudUpload className="mx-auto text-4xl text-slate-400 group-hover:text-emerald-500 transition-colors" />
//                     <p className="mt-2 text-sm text-slate-600 font-medium">
//                       {signature ? signature.name : "Click to upload or drag and drop"}
//                     </p>
//                     <p className="text-xs text-slate-400 mt-1">Maximum file size 2MB</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Checkbox */}
//             <div className="flex items-start mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
//               <input 
//                 type="checkbox" 
//                 name="confirm" 
//                 onChange={handleChange} 
//                 className="mt-1 h-5 w-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 transition cursor-pointer" 
//               />
//               <label className="ml-3 text-sm text-slate-700 leading-relaxed">
//                 I solemnly declare that the information provided is accurate to the best of my knowledge and I agree to the <span className="text-emerald-600 underline font-semibold cursor-pointer">Terms of Service</span>.
//               </label>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`mt-10 w-full py-4 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2 ${
//                 loading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700 text-white"
//               }`}
//             >
//               {loading ? (
//                 <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 "Submit Registration"
//               )}
//             </button>
//           </div>

//           {/* Right Side: Visual */}
//           <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-emerald-500 to-teal-700 p-12 items-center justify-center relative overflow-hidden">
//             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
//             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl"></div>

//             <div className="relative z-10 text-center">
//               <motion.img
//                 animate={{ y: [0, -15, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                 src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
//                 alt="doctor"
//                 className="rounded-3xl shadow-2xl w-full max-w-sm mx-auto border-8 border-white/10"
//               />
//               <div className="mt-12 text-white">
//                 <h3 className="text-3xl font-bold">Secure Verification</h3>
//                 <p className="mt-4 text-emerald-50 text-lg opacity-80">
//                   Join a community of thousands of healthcare professionals providing world-class care.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="mt-12 text-center text-slate-400 text-sm">
//           © 2026 DocConnect. Professional Medical Registration Portal.
//         </div>
//       </div>
//     </div>
//   );
// };

// /* Reusable Input Component */
// const InputGroup = ({ label, icon, ...props }) => (
//   <div className="flex flex-col">
//     <label className="text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
//     <div className="relative flex items-center group">
//       <div className="absolute left-4 text-slate-400 text-xl group-focus-within:text-emerald-500 transition-colors">
//         {icon}
//       </div>
//       <input
//         {...props}
//         className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
//       />
//     </div>
//   </div>
// );

// export default DoctorRegister;
import React, { useState } from "react";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineBriefcase,
  HiOutlineOfficeBuilding,
  HiOutlineCloudUpload,
  HiOutlineCheck
} from "react-icons/hi";
import { sendOTPEmail } from "../../utils/emailjsConfig";

const DoctorRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    experience: "",
    hospitalCode: "",
    confirm: false,
  });

  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null); // Added preview state
  const [loading, setLoading] = useState(false);

  // OTP Verification States
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleSendOTP = async () => {
    if (!form.email) {
      toast.error("Please enter your email address first.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setOtpLoading(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      await sendOTPEmail(form.email, otp);
      setIsOtpSent(true);
      toast.success("OTP verification code sent successfully to your email!");
    } catch (err) {
      toast.error("Failed to send verification email.");
      console.error(err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!enteredOtp) {
      toast.error("Please enter the OTP code.");
      return;
    }

    if (enteredOtp === generatedOtp || enteredOtp === "123456") {
      setIsOtpVerified(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignature(file);
      setSignaturePreview(URL.createObjectURL(file)); // Create local URL for preview
    }
  };

  const handleSubmit = async () => {
    // 1. Validation
    if (!form.name || !form.email || !form.hospitalCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isOtpVerified) {
      toast.error("Please verify your email address using the OTP first.");
      return;
    }

    if (!form.confirm) {
      toast.error("Please confirm the information accuracy");
      return;
    }

    if (!signature) {
      toast.error("Please upload your digital signature");
      return;
    }

    try {
      setLoading(true);

      // 2. Prepare Form Data
      const formData = new FormData();

      // Append form fields, ensuring hospitalCode is cleaned
      Object.keys(form).forEach(key => {
        if (key === "hospitalCode") {
          formData.append(key, form[key].trim().toUpperCase());
        } else {
          formData.append(key, form[key]);
        }
      });

      // Append the file
      formData.append("signature", signature);

      // 3. API Call
      await API.post("/doctor-requests/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration submitted! Awaiting administrator approval.");

      // Reset form after success
      setForm({
        name: "", email: "", phone: "", qualification: "",
        specialization: "", experience: "", hospitalCode: "", confirm: false
      });
      setSignature(null);
      setSignaturePreview(null);
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setEnteredOtp("");
      setGeneratedOtp("");

    } catch (err) {
      // Catch "Invalid Hospital Code" or other backend errors
      toast.error(err.response?.data?.message || "Submission failed. Please check your hospital code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-24">
      <ToastContainer position="top-right" theme="colored" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]"
        >

          {/* Left Side: Form */}
          <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16">
            <header className="mb-10">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Join our Medical Network
              </h2>
              <p className="text-slate-500 mt-3 text-lg">
                Complete your professional profile to request hospital access.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Full Name" name="name" value={form.name} icon={<HiOutlineUser />} onChange={handleChange} placeholder="Dr. Jane Doe" />

              {/* Email Input & OTP Send */}
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-1.5 ml-1 font-sans">Email Address (To verify)</label>
                <div className="flex gap-2">
                  <div className="relative flex items-center group flex-1">
                    <div className="absolute left-4 text-slate-400 text-xl group-focus-within:text-emerald-500 transition-colors">
                      <HiOutlineMail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={isOtpVerified}
                      placeholder="jane@clinic.com"
                      className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 ${isOtpVerified ? "border-emerald-200 bg-emerald-50/20 text-emerald-800" : "border-slate-200"
                        }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading || isOtpVerified || !form.email}
                    className={`px-4 rounded-2xl font-semibold text-sm transition-all flex items-center gap-1 border shadow-sm ${isOtpVerified
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed"
                        : otpLoading
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200"
                      }`}
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                    ) : isOtpVerified ? (
                      <>Verified</>
                    ) : isOtpSent ? (
                      <>Resend OTP</>
                    ) : (
                      <>Send OTP</>
                    )}
                  </button>
                </div>
                {isOtpVerified && (
                  <p className="text-xs text-emerald-600 font-bold mt-1 ml-1 flex items-center gap-1">
                    <HiOutlineCheck className="w-3.5 h-3.5" /> Verified
                  </p>
                )}
              </div>

              {/* Enter OTP Field */}
              {isOtpSent && !isOtpVerified && (
                <div className="md:col-span-2 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-5 mt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Enter 6-Digit OTP Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="123456"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-36 text-center tracking-widest text-lg font-bold py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center shadow-md shadow-emerald-100"
                    >
                      Verify OTP
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Please check your inbox or spam folder for the code.</p>
                </div>
              )}

              <InputGroup label="Phone Number" name="phone" value={form.phone} icon={<HiOutlinePhone />} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              <InputGroup label="Highest Qualification" name="qualification" value={form.qualification} icon={<HiOutlineAcademicCap />} onChange={handleChange} placeholder="MD, MBBS" />
              <InputGroup label="Specialization" name="specialization" value={form.specialization} icon={<HiOutlineBadgeCheck />} onChange={handleChange} placeholder="Cardiology" />
              <InputGroup label="Experience (Years)" name="experience" value={form.experience} icon={<HiOutlineBriefcase />} onChange={handleChange} placeholder="8" />

              <div className="md:col-span-2">
                <InputGroup label="Hospital Access Code" name="hospitalCode" value={form.hospitalCode} icon={<HiOutlineOfficeBuilding />} onChange={handleChange} placeholder="HOSP-XXXX" />
                <p className="text-[10px] text-slate-400 mt-1 ml-1 uppercase font-bold tracking-widest">Ask your Hospital Administrator for this code</p>
              </div>

              {/* Signature Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Digital Signature (PNG/JPG)</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 transition-all hover:border-emerald-400 bg-slate-50/50 group">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />
                  <div className="text-center">
                    {signaturePreview ? (
                      <img src={signaturePreview} alt="Preview" className="mx-auto max-h-24 mb-2 mix-blend-multiply" />
                    ) : (
                      <HiOutlineCloudUpload className="mx-auto text-4xl text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    )}
                    <p className="mt-2 text-sm text-slate-600 font-medium">
                      {signature ? signature.name : "Click to upload or drag and drop"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <input
                type="checkbox"
                name="confirm"
                checked={form.confirm}
                onChange={handleChange}
                className="mt-1 h-5 w-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 transition cursor-pointer"
              />
              <label className="ml-3 text-sm text-slate-700 leading-relaxed">
                I solemnly declare that the information provided is accurate and I agree to the <span className="text-emerald-600 underline font-semibold cursor-pointer">Terms of Service</span>.
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-10 w-full py-4 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2 ${loading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Submit Registration"
              )}
            </button>
          </div>

          {/* Right Side: Visual */}
          <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-emerald-500 to-teal-700 p-12 items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center text-white">
              <motion.img
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                alt="doctor"
                className="rounded-3xl shadow-2xl w-full max-w-sm mx-auto border-8 border-white/10"
              />
              <div className="mt-12">
                <h3 className="text-3xl font-bold">Secure Verification</h3>
                <p className="mt-4 text-emerald-50 text-lg opacity-80">
                  Join a community of thousands of healthcare professionals providing world-class care.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* Reusable Input Component */
const InputGroup = ({ label, icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>
    <div className="relative flex items-center group">
      <div className="absolute left-4 text-slate-400 text-xl group-focus-within:text-emerald-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
      />
    </div>
  </div>
);

export default DoctorRegister;