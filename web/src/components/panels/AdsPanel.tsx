"use client";

import React from "react";
import { Award, CheckCircle, Rocket, Send, Sparkles } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const AdsPanel = () => {
  const {
    theme,
    promptInput,
    setPromptInput,
    generateAdCampaign,
    handleQuickPrompt,
    aiSuggestions,
    launchCampaign,
    campaigns,
  } = useNabiz();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div
        className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Doğal Dil Güdümlü Kampanya Sihirbazı</h3>
            <p className="text-xs text-slate-400">Meta Ads paneli yerine tek bir Türkçe prompt ile kitle, zaman ve metin optimizasyonu</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kampanya Hedefinizi Yazın</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                placeholder="Örn: Kadıköy'deki 3. nesil kahvecimiz için Reels reklamı yap..."
                className={`w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none pr-12 transition-all border ${
                  theme === "light"
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500"
                    : "bg-[#102d33] border-slate-700 text-slate-100 focus:border-teal-400"
                }`}
              />
              <button
                onClick={generateAdCampaign}
                className="absolute right-2.5 p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-all cursor-pointer active:scale-98"
              >
                <Send className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-slate-400 font-bold self-center mr-1">Örnek Şablonlar:</span>
              <button
                onClick={() => handleQuickPrompt("Kadıköy'deki kahvecimiz için Reels reklamı yap")}
                className="text-xs px-3 py-1 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 font-bold cursor-pointer"
              >
                ☕ Kadıköy Soğuk Kahve
              </button>
              <button
                onClick={() => handleQuickPrompt("Yazılım eğitim kursumuzu yapay zekayla ilgilenen gençlere duyur")}
                className="text-xs px-3 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 font-bold cursor-pointer"
              >
                💻 Yapay Zeka Kursu
              </button>
            </div>
          </div>

          {aiSuggestions && (
            <div className="p-5 rounded-xl border border-orange-300 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20 flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between border-b border-orange-200 dark:border-orange-900 pb-3">
                <span className="text-xs font-bold text-orange-700 dark:text-orange-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-orange-600" /> AI Parametre ve Zamanlama Optimizasyonu
                </span>
                <span className="text-[10px] bg-orange-600 text-white font-bold px-2.5 py-0.5 rounded font-mono">
                  +34% ROAS Eşleşti
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Hedef Lokasyon</span>
                  <strong className="text-sm font-bold">{aiSuggestions.city}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Yaş Segmenti</span>
                  <strong className="text-sm font-bold">{aiSuggestions.age}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">En Yoğun Etkileşim Penceresi</span>
                  <strong className="font-bold text-teal-700 dark:text-teal-300">{aiSuggestions.timeWindow}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] mb-1">Yapay Zekâ Türkçe Reklam Metni:</span>
                  <div
                    className={`p-3.5 rounded-xl border text-xs italic leading-relaxed ${
                      theme === "light" ? "bg-white border-slate-200 text-slate-700" : "bg-[#0b1d22] border-slate-800 text-slate-300"
                    }`}
                  >
                    {aiSuggestions.adCopy}
                  </div>
                </div>
              </div>

              <button
                onClick={launchCampaign}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CheckCircle className="h-4 w-4" /> Kampanyayı Canlıya Al (10 Saniyede Yayında)
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-orange-600" />
          Aktif Reklam Kampanyaları & ROAS
        </h3>

        <div className="flex flex-col gap-3">
          {campaigns.map(camp => (
            <div
              key={camp.id}
              className={`p-4 rounded-xl border text-xs ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#102d33] border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm">{camp.prompt}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20 font-mono">
                  {camp.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700 mt-2 font-mono">
                <div>
                  <span>Bütçe:</span> <strong className="text-slate-700 dark:text-slate-200 block">{camp.budget} TL</strong>
                </div>
                <div>
                  <span>Tıklama:</span> <strong className="text-slate-700 dark:text-slate-200 block">{camp.clicks}</strong>
                </div>
                <div>
                  <span>Gerçekleşen ROAS:</span> <strong className="text-orange-600 block text-xs font-bold">{camp.roas}x</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
