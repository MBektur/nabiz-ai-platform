"use client";

import React from "react";
import { AlertTriangle, Bell, CheckCircle, UserCheck } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const SensePanel = () => {
  const { theme, alerts, handleAction } = useNabiz();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div
        className={`lg:col-span-8 p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <h3 className="font-bold text-base mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-rose-600" />
          Aktif Siber Güvenlik ve Moderasyon Alarmları
        </h3>

        <div className="flex flex-col gap-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border flex flex-col gap-4 ${
                alert.status === "RESOLVED"
                  ? "bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-900/40"
                  : alert.type === "CRISIS"
                  ? "bg-rose-50/50 border-rose-300 dark:bg-rose-950/20 dark:border-rose-900"
                  : "bg-orange-50/50 border-orange-300 dark:bg-orange-950/20 dark:border-orange-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-sm font-mono">
                  <AlertTriangle className={`h-5 w-5 ${alert.type === "CRISIS" ? "text-rose-600" : "text-orange-600"}`} />
                  {alert.city} × {alert.topic} (Z-Score: {alert.zScore.toFixed(2)})
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded ${
                    alert.status === "RESOLVED"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-mono"
                      : "bg-rose-600 text-white font-mono"
                  }`}
                >
                  {alert.status === "RESOLVED" ? "KONTROL ALTINDA" : "MODERASYON GEREKLİ"}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  theme === "light" ? "bg-white border-slate-200" : "bg-[#0b1d22] border-slate-800"
                }`}
              >
                <strong className="text-orange-600 block mb-1 text-xs">Yerli LLM Türkçe Kök Neden Açıklaması:</strong>
                {alert.rootCause}
              </div>

              {alert.status !== "RESOLVED" && (
                <div className="flex flex-wrap gap-3">
                  {alert.recommendedActions.map(act => (
                    <button
                      key={act}
                      onClick={() => handleAction(alert.id, act)}
                      className="px-4 py-2 rounded-xl bg-[#0a1e22] text-white hover:bg-[#133e42] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-teal-400" /> {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className={`lg:col-span-4 p-6 rounded-2xl border transition-all flex flex-col gap-6 ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <h4 className="font-bold text-sm flex items-center gap-2">
          <UserCheck className="h-4.5 w-4.5 text-emerald-600" /> Doğrulama ve NLP Metrikleri
        </h4>
        <div className="flex flex-col gap-4 text-xs font-mono">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-400 block text-[10px] font-sans">BERTurk Duygu Eşleşme Doğruluğu</span>
            <strong className="text-sm font-bold">%92.4 Accuracy (5-Fold CV)</strong>
          </div>
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-slate-400 block text-[10px] font-sans">Yerel LLM Çıkarım Gecikmesi</span>
            <strong className="text-sm font-bold">1.24 saniye (AWQ 4-bit)</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-sans">DBSCAN Kümeleme F1-Skoru</span>
            <strong className="text-sm font-bold">0.920 F1-Harmonik Başarım</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
