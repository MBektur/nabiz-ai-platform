"use client";

import React from "react";
import { useNabiz } from "../context/NabizContext";
import { Toast } from "./common/Toast";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { BenchmarkBanner } from "./layout/BenchmarkBanner";
import { KpiCards } from "./common/KpiCards";
import { ScenarioTester } from "./common/ScenarioTester";
import { DashboardPanel } from "./panels/DashboardPanel";
import { AdsPanel } from "./panels/AdsPanel";
import { SensePanel } from "./panels/SensePanel";
import { AnalyticsPanel } from "./panels/AnalyticsPanel";
import { PrivacyPanel } from "./panels/PrivacyPanel";
import { ReportPanel } from "./panels/ReportPanel";

export const NabizApp = () => {
  const { theme, currentPanel } = useNabiz();

  return (
    <div
      className={`h-screen flex flex-col lg:flex-row font-sans selection:bg-orange-600 selection:text-white overflow-hidden ${
        theme === "light" ? "bg-[#f8fafc] text-slate-900" : "bg-[#071317] text-slate-100"
      }`}
    >
      {/* Floating Toast notification overlay */}
      <Toast />

      {/* Ultra-premium solid pinned sidebar */}
      <Sidebar />

      {/* Main scrollable workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Header */}
        <Header />

        {/* Operational Benchmark Banner */}
        <BenchmarkBanner />

        {/* Main Body Content */}
        <div className="p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {/* Top 4 KPI metric cards */}
          <KpiCards />

          {/* Interactive Event & Scenario Tester */}
          <ScenarioTester />

          {/* Dynamic Active View Panel */}
          {currentPanel === "dashboard" && <DashboardPanel />}
          {currentPanel === "ads" && <AdsPanel />}
          {currentPanel === "sense" && <SensePanel />}
          {currentPanel === "analytics" && <AnalyticsPanel />}
          {currentPanel === "privacy" && <PrivacyPanel />}
          {currentPanel === "report" && <ReportPanel />}
        </div>

        {/* Sticky-bottom Footer */}
        <footer
          className={`py-4 text-center text-xs border-t mt-auto shrink-0 ${
            theme === "light"
              ? "bg-white border-slate-200 text-slate-500"
              : "bg-[#0b1d22] border-slate-800 text-slate-500"
          }`}
        >
          <p>© 2026 NABIZ AI Platformu • Sadir Pehlivan Takımı #990060 • TEKNOFEST N-Sosyal İnovasyon</p>
        </footer>
      </main>
    </div>
  );
};
