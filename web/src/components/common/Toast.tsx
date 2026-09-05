"use client";

import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const Toast = () => {
  const { toast, hideToast } = useNabiz();

  if (!toast) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 transition-all ${
        toast.type === "alert"
          ? "bg-rose-700 text-white border-rose-600 shadow-rose-900/20"
          : toast.type === "info"
          ? "bg-teal-700 text-white border-teal-600 shadow-teal-900/20"
          : "bg-[#0a1e22] text-teal-300 border-teal-600 shadow-slate-900/20"
      }`}
    >
      {toast.type === "alert" ? (
        <AlertTriangle className="h-5 w-5 shrink-0" />
      ) : (
        <CheckCircle className="h-5 w-5 shrink-0 text-teal-400" />
      )}
      <span className="text-xs font-bold">{toast.message}</span>
      <button onClick={hideToast} className="p-1 hover:opacity-80 cursor-pointer">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
