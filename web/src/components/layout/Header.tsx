"use client";

import React from "react";
import { Moon, Play, Rocket, Shield, Sun } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const Header = () => {
  const {
    theme,
    setTheme,
    isJuryTourRunning,
    runJuryAutoTour,
    activeWing,
    setActiveWing,
    setCurrentPanel,
  } = useNabiz();

  return (
    <header
      className={`px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b shrink-0 ${
        theme === "light" ? "bg-white border-slate-200" : "bg-[#0b1d22] border-slate-800"
      }`}
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          NABIZ AI Karar Destek Platformu
        </h2>
        <p className={`text-xs font-medium mt-0.5 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
          TEKNOFEST 2026 N-Sosyal İnovasyon • Çok Eksenli Tensör & Anomali Karar Destek Merkezi
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
        {/* Automated Jury Tour Button */}
        <button
          onClick={runJuryAutoTour}
          disabled={isJuryTourRunning}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a1e22] hover:bg-[#133e42] text-white text-xs font-bold border border-teal-600/40 transition-all cursor-pointer active:scale-98"
        >
          <Play className="h-3 w-3 fill-current text-orange-400" />
          <span>{isJuryTourRunning ? "Demo Turu Aktif..." : "Jüri Otomatik Demosu"}</span>
        </button>

        {/* Double-Wing Architecture Quick Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-[#102d33] p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => { setActiveWing("all"); setCurrentPanel("dashboard"); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeWing === "all" ? "bg-[#0a1e22] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => { setActiveWing("sense"); setCurrentPanel("sense"); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === "sense" ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Shield className="h-3 w-3" /> Kanat 1: Sense
          </button>
          <button
            onClick={() => { setActiveWing("ads"); setCurrentPanel("ads"); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === "ads" ? "bg-orange-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Rocket className="h-3 w-3" /> Kanat 2: Ads
          </button>
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={() => setTheme(prev => (prev === "light" ? "dark" : "light"))}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            theme === "light"
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              : "bg-[#0f282e] border-slate-700 text-amber-400 hover:bg-[#15343c]"
          }`}
          title={theme === "light" ? "Karanlık Moda Geç" : "Aydınlık Moda Geç"}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
