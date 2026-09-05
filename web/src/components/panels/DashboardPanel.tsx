"use client";

import React from "react";
import {
  Calculator,
  Compass,
  Gauge,
  MapPin,
  Radio,
  RefreshCw,
  Users,
  Zap,
} from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const DashboardPanel = () => {
  const {
    theme,
    radarData,
    radarPolygon,
    sentimentNeedleAngle,
    sentimentIndex,
    alerts,
    wavePoints1,
    wavePoints2,
    wavePoints3,
    activeAxisDimension,
    setActiveAxisDimension,
    selectedCell,
    setSelectedCell,
    resetAll,
    activeMatrix,
    activeCellData,
  } = useNabiz();

  const radarScale = (val: number) => Math.min(100, Math.max(20, (val / 6.0) * 80 + 20));
  const rIst = radarScale(radarData["İstanbul"] || 1.5);
  const rAnk = radarScale(radarData["Ankara"] || 0.67);
  const rIzm = radarScale(radarData["İzmir"] || 3.92);
  const rBur = radarScale(radarData["Bursa"] || 1.0);
  const rAnt = radarScale(radarData["Antalya"] || 0.75);

  return (
    <>
      {/* RADAR CHART & SENTIMENT TACHOMETER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart A: 5-City Anomaly Radar (7/12) */}
        <div
          className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${
            theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-teal-600" />
                5 Şehir Anomali Radarı (Z-Score Polar Poligonu)
              </h4>
              <span className="text-[11px] text-slate-400">Şehir bazlı anomali sapmalarının polar koordinat ağı</span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono">
              CANLI POLAR AĞ
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* SVG Radar Spider Web */}
            <div className="relative h-56 w-56 flex items-center justify-center shrink-0">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Background Concentric Radar Webs */}
                <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />
                <polygon points="100,45 152,82 133,143 67,143 48,82" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />
                <polygon points="100,70 128,90 119,122 81,122 72,90" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />

                {/* Radar Axis Lines */}
                <line x1="100" y1="100" x2="100" y2="20" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
                <line x1="100" y1="100" x2="176" y2="75" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
                <line x1="100" y1="100" x2="147" y2="165" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
                <line x1="100" y1="100" x2="53" y2="165" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
                <line x1="100" y1="100" x2="24" y2="75" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />

                {/* Solid Anomaly Polygon */}
                <polygon
                  points={radarPolygon}
                  fill={(radarData["İzmir"] || 0) >= 3.0 ? "rgba(220, 38, 38, 0.2)" : "rgba(13, 148, 136, 0.2)"}
                  stroke={(radarData["İzmir"] || 0) >= 3.0 ? "#dc2626" : "#0d9488"}
                  strokeWidth="2"
                  className="transition-all duration-500"
                />

                {/* Radar Nodes */}
                <circle cx="100" cy={100 - rIst * 0.8} r="3.5" fill="#2563eb" />
                <circle cx={100 + rAnk * 0.76} cy={100 - rAnk * 0.25} r="3.5" fill="#7c3aed" />
                <circle cx={100 + rIzm * 0.47} cy={100 + rIzm * 0.65} r="5" fill="#dc2626" />
                <circle cx={100 - rBur * 0.47} cy={100 + rBur * 0.65} r="3.5" fill="#059669" />
                <circle cx={100 - rAnt * 0.76} cy={100 - rAnt * 0.25} r="3.5" fill="#d97706" />
              </svg>

              {/* City Axis Labels */}
              <span className="absolute -top-1 font-bold text-[10px] text-blue-600">İstanbul</span>
              <span className="absolute top-12 -right-4 font-bold text-[10px] text-purple-600">Ankara</span>
              <span className="absolute -bottom-2 right-4 font-bold text-[10px] text-rose-600">İzmir (3σ)</span>
              <span className="absolute -bottom-2 left-4 font-bold text-[10px] text-emerald-600">Bursa</span>
              <span className="absolute top-12 -left-4 font-bold text-[10px] text-amber-600">Antalya</span>
            </div>

            {/* Radar Live Metrics List */}
            <div className="flex-1 flex flex-col gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-sans font-bold text-rose-600">İzmir Z-Score:</span>
                <strong className="font-bold text-rose-600">+{(radarData["İzmir"] || 0).toFixed(2)} (Kritik)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-sans font-bold text-slate-600 dark:text-slate-300">İstanbul Z-Score:</span>
                <strong className="font-bold text-orange-600">+{(radarData["İstanbul"] || 0).toFixed(2)} (Fırsat)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-sans font-bold text-slate-600 dark:text-slate-300">Ankara Z-Score:</span>
                <strong className="font-bold text-slate-700 dark:text-slate-300">+{(radarData["Ankara"] || 0).toFixed(2)} (Norm)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Chart B: Semantic Sentiment Tachometer Gauge (5/12) */}
        <div
          className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between transition-all ${
            theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Gauge className="h-4.5 w-4.5 text-orange-600" />
                Duygu Takometresi (BERTurk Φ)
              </h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20 font-mono">
                SEMANTİK İBRE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mb-4">NLP modelinin ürettiği canlı polarite skalası (-1.0 ile +1.0)</span>

            {/* Semicircle Speedometer SVG with Solid Arcs */}
            <div className="relative h-36 w-full flex items-center justify-center overflow-hidden">
              <svg className="w-64 h-36" viewBox="0 0 200 110">
                {/* Solid Color Arc Segments */}
                {/* Left Negative Arc (Rose) */}
                <path d="M 20 100 A 80 80 0 0 1 75 25" fill="none" stroke="#dc2626" strokeWidth="12" strokeLinecap="round" />
                {/* Middle Neutral Arc (Amber) */}
                <path d="M 78 23 A 80 80 0 0 1 122 23" fill="none" stroke="#d97706" strokeWidth="12" />
                {/* Right Positive Arc (Emerald) */}
                <path d="M 125 25 A 80 80 0 0 1 180 100" fill="none" stroke="#059669" strokeWidth="12" strokeLinecap="round" />

                {/* Needle Pivot Center */}
                <circle cx="100" cy="100" r="8" fill="#0a1e22" stroke="#ffffff" strokeWidth="2" />

                {/* Rotating Needle Pointer */}
                <g
                  style={{
                    transformOrigin: "100px 100px",
                    transform: `rotate(${sentimentNeedleAngle}deg)`,
                    transition: "transform 0.6s ease-out",
                  }}
                >
                  <line x1="100" y1="100" x2="100" y2="35" stroke="#0a1e22" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="32" r="3.5" fill="#ea580c" />
                </g>
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-400 px-4 -mt-2 font-mono">
              <span className="text-rose-600">-1.0 (Negatif)</span>
              <span>0.0 (Nötr)</span>
              <span className="text-emerald-600">+1.0 (Pozitif)</span>
            </div>
          </div>

          {/* Digital Readout */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500">Hesaplanan Anlık Polarite:</span>
            <strong className={`font-mono text-base font-bold ${sentimentIndex < 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {sentimentIndex >= 0 ? "+" : ""}{sentimentIndex.toFixed(2)} Φ(eₖ)
            </strong>
          </div>
        </div>
      </div>

      {/* ULTRA-SMOOTH SPLINE WAVE CHART WITH VERTICAL FADE GRADIENT & THIN LINE */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="font-bold text-sm flex items-center gap-2">
              <Radio className="h-4.5 w-4.5 text-teal-600" />
              Canlı Çok Eksenli Tensör Sinyal Akış Grafiği
            </h4>
            <span className="text-[11px] text-slate-400">15 dakikalık kayan pencerelerde sinyal dağılımı</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 font-mono">400ms CANLI AKIŞ</span>
          </div>
        </div>

        {/* SVG High-Res Smooth Spline Chart with Hairline Thin Vector Lines */}
        <div className="h-40 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="vert-fade-teal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#0d9488" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.00" />
              </linearGradient>

              <linearGradient id="vert-fade-orange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.20" />
                <stop offset="60%" stopColor="#ea580c" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.00" />
              </linearGradient>

              <linearGradient id="vert-fade-blue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                <stop offset="60%" stopColor="#2563eb" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
              </linearGradient>

              <linearGradient id="vert-fade-crisis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.30" />
                <stop offset="60%" stopColor="#dc2626" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Gridlines */}
            <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" strokeWidth="1" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" strokeWidth="1" />
            <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" strokeWidth="1" />

            {/* Layer 3: Blue #Teknoloji */}
            {(() => {
              const step = 1000 / (wavePoints3.length - 1);
              const coords = wavePoints3.map((val, i) => ({ x: i * step, y: 200 - (val / 55) * 175 }));
              let d = `M ${coords[0].x} ${coords[0].y}`;
              for (let i = 0; i < coords.length - 1; i++) {
                const midX = (coords[i].x + coords[i + 1].x) / 2;
                d += ` Q ${coords[i].x} ${coords[i].y}, ${midX} ${(coords[i].y + coords[i + 1].y) / 2}`;
              }
              d += ` T ${coords[coords.length - 1].x} ${coords[coords.length - 1].y}`;
              return (
                <g>
                  <path d={`${d} L 1000 200 L 0 200 Z`} fill="url(#vert-fade-blue)" />
                  <path d={d} fill="none" stroke="#2563eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </g>
              );
            })()}

            {/* Layer 2: Orange #Kültür */}
            {(() => {
              const step = 1000 / (wavePoints2.length - 1);
              const coords = wavePoints2.map((val, i) => ({ x: i * step, y: 200 - (val / 55) * 175 }));
              let d = `M ${coords[0].x} ${coords[0].y}`;
              for (let i = 0; i < coords.length - 1; i++) {
                const midX = (coords[i].x + coords[i + 1].x) / 2;
                d += ` Q ${coords[i].x} ${coords[i].y}, ${midX} ${(coords[i].y + coords[i + 1].y) / 2}`;
              }
              d += ` T ${coords[coords.length - 1].x} ${coords[coords.length - 1].y}`;
              return (
                <g>
                  <path d={`${d} L 1000 200 L 0 200 Z`} fill="url(#vert-fade-orange)" />
                  <path d={d} fill="none" stroke="#ea580c" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </g>
              );
            })()}

            {/* Layer 1: Teal/Crisis #Ulaşım */}
            {(() => {
              const isCrisis = alerts.some(a => a.status === "UNRESOLVED" && a.type === "CRISIS");
              const step = 1000 / (wavePoints1.length - 1);
              const coords = wavePoints1.map((val, i) => ({ x: i * step, y: 200 - (val / 55) * 175 }));
              let d = `M ${coords[0].x} ${coords[0].y}`;
              for (let i = 0; i < coords.length - 1; i++) {
                const midX = (coords[i].x + coords[i + 1].x) / 2;
                d += ` Q ${coords[i].x} ${coords[i].y}, ${midX} ${(coords[i].y + coords[i + 1].y) / 2}`;
              }
              const last = coords[coords.length - 1];
              d += ` T ${last.x} ${last.y}`;
              return (
                <g>
                  <path d={`${d} L 1000 200 L 0 200 Z`} fill={isCrisis ? "url(#vert-fade-crisis)" : "url(#vert-fade-teal)"} />
                  <path d={d} fill="none" stroke={isCrisis ? "#dc2626" : "#0d9488"} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                  <circle cx={last.x} cy={last.y} r="4" fill={isCrisis ? "#dc2626" : "#0d9488"} />
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
          <span>-10 Saniye</span>
          <span className="text-slate-600 dark:text-slate-300 font-bold flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded-sm bg-[#0d9488] inline-block"></span> #Ulaşım Sinyalleri</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded-sm bg-[#ea580c] inline-block"></span> #Kültür & Etkinlik</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded-sm bg-[#2563eb] inline-block"></span> #Teknoloji</span>
          </span>
          <span>Şimdi (T)</span>
        </div>
      </div>

      {/* DYNAMIC MULTI-AXIS HEATMAP MATRIX */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Çok Eksenli Tensör İzdüşümü Matrisi
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rapor Bölüm 1.1 & 3.1: Esnek eşlenebilen koordinat eksenlerinde anlık tensör izdüşümü M<sub>i,j</sub>(t)
            </p>
          </div>

          {/* Multi-Axis Dimension Selector Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-[#102d33] p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => { setActiveAxisDimension("city_topic"); setSelectedCell({ row: "İzmir", col: "#Ulaşım" }); }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAxisDimension === "city_topic" ? "bg-teal-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                [Şehir × Konu]
              </button>
              <button
                onClick={() => { setActiveAxisDimension("age_format"); setSelectedCell({ row: "18-24 Yaş", col: "Reels" }); }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeAxisDimension === "age_format" ? "bg-teal-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                [Yaş Grubu × Format]
              </button>
            </div>

            <button
              onClick={resetAll}
              className={`text-xs px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer active:scale-98 ${
                theme === "light" ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200" : "bg-[#102d33] border-slate-700 text-slate-300 hover:bg-[#153840]"
              }`}
            >
              <RefreshCw className="h-3 w-3" /> Sıfırla
            </button>
          </div>
        </div>

        {/* Matrix Grid Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-6 gap-3 mb-3 text-center text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="text-left pl-2">
                {activeAxisDimension === "city_topic" ? "Bölge / Şehir" : "Yaş Segmenti"}
              </div>
              {Object.keys(Object.values(activeMatrix)[0]).map(col => (
                <div key={col}>{col}</div>
              ))}
            </div>

            {Object.keys(activeMatrix).map(row => (
              <div key={row} className="grid grid-cols-6 gap-3 mb-3 items-center text-center">
                <div className="text-left font-bold text-sm flex items-center gap-1.5 pl-1">
                  {activeAxisDimension === "city_topic" ? <MapPin className="h-4 w-4 text-slate-400" /> : <Users className="h-4 w-4 text-slate-400" />}
                  {row}
                </div>

                {Object.keys(activeMatrix[row]).map(col => {
                  const cell = activeMatrix[row][col];
                  let cellStyle = theme === "light"
                    ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                    : "bg-[#102d33] hover:bg-[#153840] border-[#1b4d57] text-slate-200";
                  let badge = null;

                  if (cell.isAnomaly) {
                    cellStyle = "bg-rose-50 border-rose-400 text-rose-700 dark:bg-rose-950/30 dark:border-rose-700 dark:text-rose-300";
                    badge = <span className="absolute top-1 right-1 text-[8px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded font-mono">⚠ Z: {cell.zScore}</span>;
                  } else if (cell.isOpportunity) {
                    cellStyle = "bg-orange-50 border-orange-400 text-orange-700 dark:bg-orange-950/30 dark:border-orange-700 dark:text-orange-300";
                    badge = <span className="absolute top-1 right-1 text-[8px] font-bold bg-orange-600 text-white px-1.5 py-0.2 rounded">FIRSAT</span>;
                  }

                  const isSelected = selectedCell?.row === row && selectedCell?.col === col;

                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedCell({ row, col })}
                      className={`h-16 rounded-xl border flex flex-col justify-center items-center relative transition-all cursor-pointer ${cellStyle} ${
                        isSelected ? "ring-2 ring-teal-600 scale-[1.02]" : ""
                      }`}
                    >
                      {badge}
                      <span className="text-sm font-bold font-mono">{cell.volume}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Norm: {cell.mean}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* LIVE MATHEMATICAL FORMULA INSPECTION DRAWER */}
        {selectedCell && activeCellData && (
          <div
            className={`mt-6 p-5 rounded-2xl border flex flex-col gap-4 ${
              theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#0b1d22] border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4.5 w-4.5 text-orange-600" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Canlı Matematiksel Formül Çözümlemesi (Tensör Motoru Çıktısı)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20 font-mono">
                  {selectedCell.row}
                </span>
                <span className="px-3 py-0.5 rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold border border-orange-500/20 font-mono">
                  {selectedCell.col}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Formula Step 1: Z-Score */}
              <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#102d33] border-slate-700"}`}>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Z-Score Sapma Denklemi</span>
                <div className="font-mono text-xs text-teal-700 dark:text-teal-300 font-bold mb-1">
                  Z = (X - μ) / (σ + ε)
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  = ({activeCellData.volume} - {activeCellData.mean}) / ({activeCellData.std} + 10⁻⁵)
                  <strong className="block text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                    = {activeCellData.zScore >= 0 ? "+" : ""}{activeCellData.zScore.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Formula Step 2: Anomaly Decision */}
              <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#102d33] border-slate-700"}`}>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">3σ Karar Kuralı (|Z| ≥ 3.0)</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    activeCellData.zScore >= 3.0
                      ? "bg-rose-600 text-white"
                      : activeCellData.isOpportunity
                      ? "bg-orange-600 text-white"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  }`}>
                    {activeCellData.zScore >= 3.0 ? "KRİTİK ANOMALİ" : activeCellData.isOpportunity ? "ROAS FIRSATI" : "NORM DÂHİLİNDE"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-2">
                  {activeCellData.zScore >= 3.0 ? "3σ eşiği aşıldı, Sense kalkanı devrede." : "İstatistiksel baz çizgi sınırlarında."}
                </span>
              </div>

              {/* Formula Step 3: NLP & Reputation */}
              <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#102d33] border-slate-700"}`}>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Duygu Polaritesi & DBSCAN Ağırlığı</span>
                <div className="flex justify-between items-center text-xs">
                  <span>BERTurk Φ(eₖ):</span>
                  <strong className={`font-mono font-bold ${activeCellData.sentiment < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {activeCellData.sentiment >= 0 ? "+" : ""}{activeCellData.sentiment.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span>DBSCAN İtibar wₖ:</span>
                  <strong className="font-mono text-slate-700 dark:text-slate-200">0.95 (Organik)</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
