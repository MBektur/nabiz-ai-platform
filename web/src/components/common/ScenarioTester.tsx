"use client";

import React from "react";
import { AlertTriangle, Flame, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const ScenarioTester = () => {
  const {
    triggerIzmirCrisis,
    triggerKadikoyOpportunity,
    triggerBursaBotAttack,
    resetAll,
  } = useNabiz();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange-600" />
          İnteraktif Olay ve Senaryo Test Merkezi
        </h3>
        <span className="text-[10px] text-slate-400 font-medium">Rapor Bölüm 3 Senaryo Doğrulama</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Button 1: İzmir Krizi */}
        <button
          onClick={triggerIzmirCrisis}
          className="p-5 rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-left transition-all shadow-sm cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono">
              Z: +5.12 (3σ)
            </span>
          </div>
          <h4 className="font-bold text-sm text-rose-800 dark:text-rose-300 block mb-1">
            1. İzmir Ulaşım Kriz Senaryosu
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            3σ anomali eşiği aşılır, BERTurk negatif polarite (Φ = -0.92) ile alarm üretir.
          </p>
        </button>

        {/* Button 2: Kadıköy Trendi */}
        <button
          onClick={triggerKadikoyOpportunity}
          className="p-5 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-left transition-all shadow-sm cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <Flame className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-600 text-white font-mono">
              ROAS +%34
            </span>
          </div>
          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 block mb-1">
            2. Kadıköy Trend & Fırsat Senaryosu
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            AdTech tensör hücre eşlemesi ile KOBİ'ler için anlık reklam fırsatı oluşturulur.
          </p>
        </button>

        {/* Button 3: Bursa Bot Saldırısı */}
        <button
          onClick={triggerBursaBotAttack}
          className="p-5 rounded-2xl border border-teal-300 dark:border-teal-900/60 bg-teal-50/70 dark:bg-teal-950/20 hover:bg-teal-100 dark:hover:bg-teal-950/40 text-left transition-all shadow-sm cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <ShieldAlert className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-700 text-white font-mono">
              w_k &lt; 0.1 (Bot)
            </span>
          </div>
          <h4 className="font-bold text-sm text-teal-900 dark:text-teal-300 block mb-1">
            3. Bursa Bot Saldırısı & İzolasyon
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            DBSCAN yoğunluk algoritması ile 280 sahte hesap organik akıştan temizlenir.
          </p>
        </button>

        {/* Button 4: Sıfırla */}
        <button
          onClick={resetAll}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#102d33] hover:bg-slate-100 dark:hover:bg-[#153840] text-left transition-all shadow-sm cursor-pointer active:scale-98"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
              SIFIRLA
            </span>
          </div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 block mb-1">
            4. Fabrika Normlarına Döndür
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Tensör matrisi ve anomali radarını başlangıç referans durumuna sıfırlar.
          </p>
        </button>
      </div>
    </div>
  );
};
