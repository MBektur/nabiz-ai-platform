"use client";

import React from "react";
import { Award } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const BenchmarkBanner = () => {
  const { theme } = useNabiz();

  return (
    <div
      className={`px-8 py-3 border-b flex flex-wrap items-center justify-between gap-4 text-xs shrink-0 ${
        theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#0d2227] border-slate-800"
      }`}
    >
      <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
        <Award className="h-4 w-4 text-orange-600" />
        Doğrulanmış Rapor Başarım Metrikleri:
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Sense Moderasyon SUS:</span>
          <strong className="text-teal-700 dark:text-teal-300 font-bold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md font-mono">
            86.4 / 100 (A+)
          </strong>
          <span className="text-[11px] text-slate-500">(4.2 saat → 32 sn)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Ads Reklamveren SUS:</span>
          <strong className="text-orange-700 dark:text-orange-300 font-bold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md font-mono">
            91.2 / 100 (A+)
          </strong>
          <span className="text-[11px] text-slate-500">(35 dk → 12 sn)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">ROAS Verim Artışı:</span>
          <strong className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono">
            +%34 (1:3.75x)
          </strong>
        </div>
      </div>
    </div>
  );
};
