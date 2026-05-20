// // import express from "express";
// // import {
// //   registerDoctorRequest,
// //   hospitalAdminApprove,
// //   superAdminApprove,
// //   getHospitalDoctorRequests,
// //   getAllDoctorRequests
// // } from "../controllers/doctorRequestController.js";

// // import { verifyToken, isHospitalAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";
// // console.log("Doctor Request Routes Loaded");
// // const router = express.Router();

// // router.post("/register", registerDoctorRequest);

// // router.get("/hospital", verifyToken, isHospitalAdmin, getHospitalDoctorRequests);
// // router.get("/all", verifyToken, isSuperAdmin, getAllDoctorRequests);

// // router.put("/hospital-approve/:id", verifyToken, isHospitalAdmin, hospitalAdminApprove);
// // router.put("/super-approve/:id", verifyToken, isSuperAdmin, superAdminApprove);

// // router.post("/register", (req, res, next) => {
// //   console.log("Doctor Register API Hit");
// //   next();
// // }, registerDoctorRequest);
// // export default router;


// // import express from "express";
// // import {
// //   registerDoctorRequest,
// //   hospitalAdminApprove,
// //   superAdminApprove,
// //   getHospitalDoctorRequests,
// //   getAllDoctorRequests
// // } from "../controllers/doctorRequestController.js";

// // import { verifyToken, isHospitalAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";

// // const router = express.Router();

// // console.log("Doctor Request Routes Loaded");

// // // THIS MUST BE EXACT
// // router.post("/register", registerDoctorRequest);

// // router.get("/hospital", verifyToken, isHospitalAdmin, getHospitalDoctorRequests);
// // router.get("/all", verifyToken, isSuperAdmin, getAllDoctorRequests);

// // router.put("/hospital-approve/:id", verifyToken, isHospitalAdmin, hospitalAdminApprove);
// // router.put("/super-approve/:id", verifyToken, isSuperAdmin, superAdminApprove);
// // router.get("/test", (req, res) => {
// //   res.send("Doctor request route working");
// // });
// // export default router;


// import express from "express";
// import {
//   registerDoctorRequest,
//   hospitalAdminApprove,
//   superAdminApprove,
//   getHospitalDoctorRequests,
//   getAllDoctorRequests
// } from "../controllers/doctorRequestController.js";

// import { verifyToken, isHospitalAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";
// import { uploadSignature } from "../middleware/multer.js";

// const router = express.Router();

// console.log("Doctor Request Routes Loaded");

// // Doctor register with signature upload
// router.post("/register", uploadSignature.single("signature"), registerDoctorRequest);

// router.get("/hospital", verifyToken, isHospitalAdmin, getHospitalDoctorRequests);
// router.get("/all", verifyToken, isSuperAdmin, getAllDoctorRequests);

// router.put("/hospital-approve/:id", verifyToken, isHospitalAdmin, hospitalAdminApprove);
// router.put("/super-approve/:id", verifyToken, isSuperAdmin, superAdminApprove);

// router.get("/test", (req, res) => {
//   res.send("Doctor request route working");
// });

// export default router;

import express from "express";
import {
  registerDoctorRequest,
  hospitalAdminApprove,
  getHospitalDoctorRequests,
  getAllDoctorRequests,
  rejectDoctorRequest
} from "../controllers/doctorRequestController.js";

import { verifyToken, isHospitalAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";
import { uploadSignature } from "../middleware/multer.js";

const router = express.Router();

console.log("Doctor Request Routes Loaded");

// Public: Doctor register with signature upload
router.post("/register", uploadSignature.single("signature"), registerDoctorRequest);

// Hospital Admin Actions
router.get("/hospital", verifyToken, isHospitalAdmin, getHospitalDoctorRequests);
router.put("/hospital-approve/:id", verifyToken, isHospitalAdmin, hospitalAdminApprove);
router.delete("/hospital-reject/:id", verifyToken, isHospitalAdmin, rejectDoctorRequest);

// Super Admin Actions (Overview only)
router.get("/all", verifyToken, isSuperAdmin, getAllDoctorRequests);

router.get("/test", (req, res) => {
  res.send("Doctor request route working");
});

export default router;