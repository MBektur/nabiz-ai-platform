"use client";

import React from "react";
import {
  Activity,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Lock,
  Play,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const Sidebar = () => {
  const {
    currentPanel,
    setCurrentPanel,
    setActiveWing,
    isJuryTourRunning,
    runJuryAutoTour,
  } = useNabiz();

  return (
    <aside className="w-full lg:w-68 lg:h-screen bg-[#0a1e22] text-slate-300 flex flex-col p-5 shrink-0 justify-between border-r border-[#133e42]/50 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-md">
            <Activity className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">NABIZ</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-600 text-white uppercase tracking-wider">AI</span>
            </div>
            <span className="text-[10px] text-teal-400 font-bold block uppercase tracking-wider">
              Karar & AdTech Motoru
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => { setCurrentPanel("dashboard"); setActiveWing("all"); }}
            className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
              currentPanel === "dashboard"
                ? "bg-[#16383e] text-teal-300 border border-teal-600/30"
                : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className={`h-4.5 w-4.5 ${currentPanel === "dashboard" ? "text-teal-400" : "text-slate-400"}`} />
            Genel Bakış (Overview)
          </button>

          <button
            onClick={() => { setCurrentPanel("ads"); setActiveWing("ads"); }}
            className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
              currentPanel === "ads"
                ? "bg-[#16383e] text-teal-300 border border-teal-600/30"
                : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
            }`}
          >
            <Rocket className={`h-4.5 w-4.5 ${currentPanel === "ads" ? "text-orange-500" : "text-slate-400"}`} />
            NABIZ-Ads Kampanyalar
          </button>

          <button
            onClick={() => { setCurrentPanel("sense"); setActiveWing("sense"); }}
            className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
              currentPanel === "sense"
                ? "bg-[#16383e] text-teal-300 border border-teal-600/30"
                : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
            }`}
          >
            <Shield className={`h-4.5 w-4.5 ${currentPanel === "sense" ? "text-rose-500" : "text-slate-400"}`} />
            NABIZ-Sense Kalkanı
          </button>

          <button
            onClick={() => { setCurrentPanel("analytics"); }}
            className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
              currentPanel === "analytics"
                ? "bg-[#16383e] text-teal-300 border border-teal-600/30"
                : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
            }`}
          >
            <TrendingUp className={`h-4.5 w-4.5 ${currentPanel === "analytics" ? "text-teal-400" : "text-slate-400"}`} />
            Detaylı Analitik & Eksenler
          </button>

          <button
            onClick={() => { setCurrentPanel("privacy"); }}
            className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
              currentPanel === "privacy"
                ? "bg-[#16383e] text-teal-300 border border-teal-600/30"
                : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
            }`}
          >
            <Lock className={`h-4.5 w-4.5 ${currentPanel === "privacy" ? "text-teal-400" : "text-slate-400"}`} />
            KVKK & Sıfır Profilleme
          </button>

          <button
            onClick={() => { setCurrentPanel("report"); }}
            className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
              currentPanel === "report"
                ? "bg-[#16383e] text-teal-300 border border-teal-600/30"
                : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
            }`}
          >
            <FileText className={`h-4.5 w-4.5 ${currentPanel === "report" ? "text-amber-400" : "text-slate-400"}`} />
            Proje Teknik Raporu (HTML)
          </button>
        </nav>
      </div>

      {/* Bottom Promo & Profile Cards */}
      <div className="flex flex-col gap-4 mt-8">
        {/* Promo Card */}
        <div className="bg-[#102d33] border border-[#1b4d57] rounded-2xl p-4 flex flex-col gap-3 relative">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Milli Çift Kanatlı AdTech</h4>
              <span className="text-[10px] text-teal-300 font-medium">TEKNOFEST 2026</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Z-Score ve DBSCAN filtreleri ile +%34 ROAS ve 32 saniyede kriz müdahalesi devrede.
          </p>
          <button
            onClick={runJuryAutoTour}
            disabled={isJuryTourRunning}
            className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Play className="h-3 w-3 fill-current" /> {isJuryTourRunning ? "Demo Çalışıyor..." : "Jüri Canlı Demosu"}
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e272c] border border-[#16383e]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center font-bold text-xs text-white">
              SP
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white leading-none">Sadir Pehlivan</h5>
              <span className="text-[9px] text-slate-400 font-medium">Takım ID: #990060</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </aside>
  );
};
