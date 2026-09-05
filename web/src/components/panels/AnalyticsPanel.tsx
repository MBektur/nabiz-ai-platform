"use client";

import React from "react";
import { useNabiz } from "../../context/NabizContext";

export const AnalyticsPanel = () => {
  const { theme, wavePoints1 } = useNabiz();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div
        className={`lg:col-span-8 p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <h3 className="font-bold text-base mb-6">Detaylı Platform Etkileşim Hacmi</h3>
        <div className="h-64 flex items-end justify-between gap-4 px-4 pt-4 border-b border-slate-200 dark:border-slate-800">
          {wavePoints1.slice(-10).map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-400 mb-1">{val * 10}k</span>
              <div
                className="w-full rounded-t-lg bg-teal-700 transition-all duration-300"
                style={{ height: `${val * 2}%` }}
              ></div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">12:0{idx}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`lg:col-span-4 p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <h4 className="font-bold text-sm mb-4">Popüler Kategori Trendleri</h4>
        <div className="flex flex-col gap-4 text-xs font-mono">
          <div>
            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1 font-sans">
              <span>#Ulaşım</span> <span>%50.5</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600" style={{ width: "50.5%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1 font-sans">
              <span>#Kültür</span> <span>%31.7</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600" style={{ width: "31.7%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1 font-sans">
              <span>#Teknoloji</span> <span>%17.8</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: "17.8%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
