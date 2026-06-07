/**
 * Smart Triage Utility
 * Parses medical vitals and classifies them into standardized clinical risk zones:
 * - Normal (Healthy emerald-600)
 * - Elevated (Amber warning amber-600)
 * - Critical (High-risk rose-600)
 */

export const getVitalStatus = (type, value) => {
  if (!value || value.trim() === "") {
    return {
      color: "text-slate-400 font-medium",
      bg: "bg-slate-50 border-slate-100",
      status: "Unrecorded",
      indicator: "bg-slate-300"
    };
  }

  const cleanVal = value.trim();

  switch (type.toLowerCase()) {
    case "bp": // Blood Pressure format: "120/80"
      const parts = cleanVal.split("/");
      if (parts.length !== 2) {
        return {
          color: "text-slate-500 font-medium",
          bg: "bg-slate-50",
          status: "Normal",
          indicator: "bg-emerald-500"
        };
      }
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      if (isNaN(sys) || isNaN(dia)) {
        return {
          color: "text-slate-500",
          bg: "bg-slate-50",
          status: "Normal",
          indicator: "bg-emerald-500"
        };
      }
      
      if (sys >= 140 || dia >= 90) {
        return {
          color: "text-rose-600 font-bold",
          bg: "bg-rose-50/70 border border-rose-100",
          status: "Critical BP",
          indicator: "bg-rose-500"
        };
      }
      if (sys >= 130 || dia >= 80) {
        return {
          color: "text-amber-600 font-bold",
          bg: "bg-amber-50/70 border border-amber-100",
          status: "Elevated BP",
          indicator: "bg-amber-500"
        };
      }
      return {
        color: "text-emerald-600 font-semibold",
        bg: "bg-emerald-50/50 border border-emerald-100",
        status: "Normal BP",
        indicator: "bg-emerald-500"
      };

    case "temperature":
    case "temp": // Temp in Fahrenheit (e.g. 98.6)
      const tempVal = parseFloat(cleanVal);
      if (isNaN(tempVal)) {
        return {
          color: "text-slate-500",
          bg: "bg-slate-50",
          status: "Normal",
          indicator: "bg-emerald-500"
        };
      }
      if (tempVal >= 100.4) {
        return {
          color: "text-rose-600 font-bold",
          bg: "bg-rose-50/70 border border-rose-100",
          status: "High Fever",
          indicator: "bg-rose-500"
        };
      }
      if (tempVal >= 99.0) {
        return {
          color: "text-amber-600 font-bold",
          bg: "bg-amber-50/70 border border-amber-100",
          status: "Low Grade Fever",
          indicator: "bg-amber-500"
        };
      }
      if (tempVal < 95.0) {
        return {
          color: "text-blue-600 font-bold",
          bg: "bg-blue-50/70 border border-blue-100",
          status: "Hypothermia",
          indicator: "bg-blue-500"
        };
      }
      return {
        color: "text-emerald-600 font-semibold",
        bg: "bg-emerald-50/50 border border-emerald-100",
        status: "Normal Temp",
        indicator: "bg-emerald-500"
      };

    case "pulse": // Heart Rate in bpm (e.g. 72)
      const pulseVal = parseInt(cleanVal, 10);
      if (isNaN(pulseVal)) {
        return {
          color: "text-slate-500",
          bg: "bg-slate-50",
          status: "Normal",
          indicator: "bg-emerald-500"
        };
      }
      if (pulseVal > 100 || pulseVal < 60) {
        return {
          color: "text-rose-600 font-bold",
          bg: "bg-rose-50/70 border border-rose-100",
          status: pulseVal > 100 ? "Tachycardia" : "Bradycardia",
          indicator: "bg-rose-500"
        };
      }
      return {
        color: "text-emerald-600 font-semibold",
        bg: "bg-emerald-50/50 border border-emerald-100",
        status: "Normal Pulse",
        indicator: "bg-emerald-500"
      };

    default:
      return {
        color: "text-slate-700 font-medium",
        bg: "bg-slate-50",
        status: "Recorded",
        indicator: "bg-slate-400"
      };
  }
};
