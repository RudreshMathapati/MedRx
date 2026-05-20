// import React, { useState } from "react";
// import API from "../../services/api";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UploadTemplate = () => {
//   const [template, setTemplate] = useState(null);

//   const handleUpload = async () => {
//     if (!template) {
//       toast.error("Please select template file");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("template", template);

//       await API.post("/hospitals/upload-template", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Template uploaded successfully");
//     } catch (error) {
//       toast.error("Upload failed");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <ToastContainer />
//       <h1 className="text-2xl font-bold mb-6">Upload Prescription Template</h1>

//       <div className="bg-white p-6 rounded shadow w-1/2">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setTemplate(e.target.files[0])}
//           className="border p-2 w-full"
//         />

//         <button
//           onClick={handleUpload}
//           className="bg-blue-600 text-white px-6 py-2 mt-4"
//         >
//           Upload Template
//         </button>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default UploadTemplate;

import React, { useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaUpload, FaTrash } from "react-icons/fa";

const UploadTemplate = () => {
  const [template, setTemplate] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    setTemplate(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!template) {
      toast.error("Please select template file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("template", template);

      await API.post("/hospitals/upload-template", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Template uploaded successfully 🎉");

      setTemplate(null);
      setPreview(null);
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Upload Prescription Template 📄
        </h1>
        <p className="text-gray-500 text-sm">
          Upload hospital prescription design template
        </p>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-6 max-w-2xl"
      >
        {/* UPLOAD AREA */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            Click or drag file to upload
          </p>
          <p className="text-sm text-gray-400">
            PNG, JPG supported
          </p>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="mt-6">
            <p className="text-gray-600 mb-2">Preview:</p>

            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className="rounded-xl shadow w-full max-h-[300px] object-contain"
              />

              {/* REMOVE */}
              <button
                onClick={() => {
                  setTemplate(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition"
        >
          {loading ? "Uploading..." : "Upload Template"}
        </button>
      </motion.div>
    </DashboardLayout>
  );
};

export default UploadTemplate;