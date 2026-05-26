import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 🛡️ Initialize Sentinel Security SDK
if (window.SentinelSDK) {
  const tracker = new window.SentinelSDK({
    endpoint: process.env.REACT_APP_SENTINEL_URL || "http://localhost:3001/evaluate"
  });
  window.sentinelTracker = tracker;

  // Keep user and session ID synchronized
  const syncSentinelUser = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId) {
      tracker.setUserId(userId);
    }
    if (token) {
      tracker.setSessionId(token);
    }
  };

  // Run immediately and setup a small interval to capture login changes
  syncSentinelUser();
  setInterval(syncSentinelUser, 2000);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);