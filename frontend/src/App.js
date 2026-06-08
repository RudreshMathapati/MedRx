import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import DoctorRegister from "./pages/auth/DoctorRegister";
import HospitalRegister from "./pages/auth/HospitalRegister";

import SuperAdminDashboard from "./pages/superAdmin/Dashboard";
import CreateHospital from "./pages/superAdmin/CreateHospital";
import DoctorRequests from "./pages/superAdmin/DoctorRequests";
import HospitalManager from "./pages/superAdmin/HospitalManager";
import HospitalRequests from "./pages/superAdmin/HospitalRequests";

import HospitalAdminDashboard from "./pages/hospitalAdmin/Dashboard";
import CreateReceptionist from "./pages/hospitalAdmin/CreateReceptionist";
import Doctors from "./pages/hospitalAdmin/Doctors";
import Receptionists from "./pages/hospitalAdmin/Receptionists";
import Patients from "./pages/hospitalAdmin/Patients";
import DoctorRequestsAdmin from "./pages/hospitalAdmin/DoctorRequests";

import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientList from "./pages/doctor/PatientList";
import WriteRX from "./pages/doctor/WriteRX";

import AddPatient from "./pages/receptionist/AddPatient";

import ProtectedRoute from "./utils/ProtectedRoute";
import PrivateRoute from "./utils/PrivateRoute";
import UploadTemplate from "./pages/hospitalAdmin/UploadTemplate";
import TwilioSettings from "./pages/hospitalAdmin/TwilioSettings";
import LandingPage from "./pages/auth/LandingPage";
import AboutPage from "./pages/auth/AboutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/doctor"
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/about" element={<AboutPage />} />  


        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/hospital-register" element={<HospitalRegister />} />

        {/* Super Admin */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute role="super_admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-hospital"
          element={
            <ProtectedRoute role="super_admin">
              <CreateHospital />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-requests"
          element={
            <ProtectedRoute role="super_admin">
              <DoctorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/hospitals"
          element={
            <ProtectedRoute role="super_admin">
              <HospitalManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin/hospital-requests"
          element={
            <ProtectedRoute role="super_admin">
              <HospitalRequests />
            </ProtectedRoute>
          }
        />

        {/* Hospital Admin */}
        <Route path="/upload-template" element={<UploadTemplate />} />
        <Route
          path="/hospital-admin"
          element={
            <ProtectedRoute role="hospital_admin">
              <HospitalAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-receptionist"
          element={
            <ProtectedRoute role="hospital_admin">
              <CreateReceptionist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute role="hospital_admin">
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionists"
          element={
            <ProtectedRoute role="hospital_admin">
              <Receptionists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients-admin"
          element={
            <ProtectedRoute role="hospital_admin">
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-requests-admin"
          element={
            <ProtectedRoute role="hospital_admin">
              <DoctorRequestsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/twilio-settings"
          element={
            <ProtectedRoute role="hospital_admin">
              <TwilioSettings />
            </ProtectedRoute>
          }
        />

        {/* Doctor */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute role="doctor">
              <PatientList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write-rx"
          element={
            <ProtectedRoute role="doctor">
              <WriteRX />
            </ProtectedRoute>
          }
        />

        {/* Receptionist */}
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute role="receptionist">
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute role={["receptionist", "doctor"]}>
              <AddPatient />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
