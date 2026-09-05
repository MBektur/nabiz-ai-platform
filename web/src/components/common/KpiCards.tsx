"use client";

import React from "react";
import { Activity, Award, Eye, MousePointer } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const KpiCards = () => {
  const {
    theme,
    totalSignalCount,
    anomalyCount,
    sentimentIndex,
    optimizedRoas,
  } = useNabiz();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* KPI 1 */}
      <div
        className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-xl bg-[#0a1e22] text-teal-400 flex items-center justify-center">
            <Eye className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
            ↑ 18.6%
          </span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">Toplam Sinyal Hacmi</span>
          <span className="text-2xl font-bold tracking-tight font-mono">{totalSignalCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 18.6% vs son 15 dk</span>
        </div>
      </div>

      {/* KPI 2 */}
      <div
        className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
            <MousePointer className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
            ↑ 22.4%
          </span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">Saptanan Anomali & Kriz</span>
          <span className="text-2xl font-bold tracking-tight font-mono">{anomalyCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 22.4% vs baz çizgi</span>
        </div>
      </div>

      {/* KPI 3 */}
      <div
        className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-xl bg-[#0f2b2f] text-emerald-400 flex items-center justify-center">
            <Activity className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
            ↑ 6.3%
          </span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">Ortalama Semantik Duygu</span>
          <span className={`text-2xl font-bold tracking-tight font-mono ${sentimentIndex < 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {sentimentIndex >= 0 ? "+" : ""}{sentimentIndex.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 6.3% vs son 1 saat</span>
        </div>
      </div>

      {/* KPI 4 */}
      <div
        className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
            <Award className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
            +34%
          </span>
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-1">Optimize Edilmiş ROAS</span>
          <span className="text-2xl font-bold tracking-tight text-orange-600 font-mono">{optimizedRoas}</span>
          <span className="text-[10px] text-slate-400 block mt-1 font-medium">↓ 4.8% Reklam İsraf Azalımı</span>
        </div>
      </div>
    </div>
  );
};
