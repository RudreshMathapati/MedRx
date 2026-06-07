import express from "express";

import { sendRxNotification } from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Sentinel
import sentinelGuard from "../middleware/sentinelGuard.js";

const router = express.Router();

// ========================================
// Send Prescription (WhatsApp / SMS)
// ========================================

router.post(
  "/send-rx",
  verifyToken,
  sentinelGuard("send_prescription"),
  sendRxNotification
);

export default router;