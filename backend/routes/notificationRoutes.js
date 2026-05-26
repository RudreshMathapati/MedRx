import express from "express";
import { sendRxNotification } from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to dispatch digital prescription via Twilio (WhatsApp & SMS)
router.post("/send-rx", verifyToken, sendRxNotification);

export default router;
