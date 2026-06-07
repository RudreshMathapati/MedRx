// services/api.js
import axios from "axios";
import { sentinel } from "./sentinelClient";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api",
});

API.interceptors.request.use(
  (req) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      req.headers.Authorization =
        `Bearer ${token}`;
    }

    const method =
      req.method?.toLowerCase();

    const protectedMethods = [
      "post",
      "put",
      "patch",
      "delete",
    ];

    if (
      protectedMethods.includes(method)
    ) {

      const telemetry =
        sentinel.getTelemetry();

      req.headers["x-session-id"] =
        telemetry.session_id;

      req.data = {
        ...(req.data || {}),
        sentinelTelemetry:
          telemetry,
      };

      console.log(
        `[SENTINEL ${method.toUpperCase()}]`
      );

      console.log(telemetry);
    }

    return req;
  },

  (error) =>
    Promise.reject(error)
);

export default API;