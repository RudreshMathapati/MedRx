import { io } from "socket.io-client";

// Set socket server address
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

class SocketService {
  socket = null;

  connect() {
    if (this.socket && this.socket.connected) return;

    this.socket = io(SOCKET_SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket client connected to MedRX server");
      
      // Auto-join active user room if user exists in localStorage
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        try {
          const user = JSON.parse(userStr);
          if (user.hospitalId) {
            this.joinHospital(user.hospitalId);
          }
        } catch (e) {
          console.error("Socket auto-join failed to parse user:", e);
        }
      }
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket client disconnected");
    });
  }

  joinHospital(hospitalId) {
    if (!this.socket) {
      this.connect();
    }
    if (hospitalId) {
      this.socket.emit("join_hospital", hospitalId.toString());
      console.log(`Socket joining hospital channel: ${hospitalId}`);
    }
  }

  on(eventName, callback) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.on(eventName, callback);
  }

  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  emit(eventName, data) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.emit(eventName, data);
  }
}

const socket = new SocketService();
export default socket;
