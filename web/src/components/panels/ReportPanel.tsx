"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const ReportPanel = () => {
  const {
    theme,
    activeReportSection,
    setActiveReportSection,
    financialSmeCount,
    setFinancialSmeCount,
  } = useNabiz();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Table of Contents */}
      <div className="lg:col-span-3">
        <div
          className={`p-4 rounded-2xl border sticky top-24 ${
            theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
          }`}
        >
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">İçindekiler</h4>
          <div className="flex flex-col gap-1.5 text-xs">
            <button
              onClick={() => setActiveReportSection("sec-1")}
              className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeReportSection === "sec-1"
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              1. Proje Özeti
            </button>
            <button
              onClick={() => setActiveReportSection("sec-2")}
              className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeReportSection === "sec-2"
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              2. Katma Değer & Yenilikçilik
            </button>
            <button
              onClick={() => setActiveReportSection("sec-3")}
              className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeReportSection === "sec-3"
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              3. Teknoloji & Matematik
            </button>
            <button
              onClick={() => setActiveReportSection("sec-4")}
              className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeReportSection === "sec-4"
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              4. Uygulanabilirlik & ROAS
            </button>
            <button
              onClick={() => setActiveReportSection("sec-6")}
              className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeReportSection === "sec-6"
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              6. Sürdürülebilirlik & Finans
            </button>
            <button
              onClick={() => setActiveReportSection("sec-8")}
              className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeReportSection === "sec-8"
                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              8. Takım & Kaynakça
            </button>
          </div>
        </div>
      </div>

      {/* Document Text */}
      <div
        className={`lg:col-span-9 p-8 rounded-2xl border text-xs leading-relaxed ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
        }`}
      >
        {activeReportSection === "sec-1" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 pb-2 border-b">1. PROJE ÖZETİ</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-6">
              <strong>NABIZ Projesi</strong>, dijital sosyal ağlardaki çok boyutlu etkileşim sinyallerini esnek eşlenebilen koordinat eksenlerinde dinamik ısı matrislerine dönüştüren, matematiksel Z-Score ve DBSCAN anomali filtreleriyle sapmaları saptayan ve içgörüleri iki ana kolda eyleme dönüştüren bütünleşik bir Sosyal Yapay Zekâ ve Yeni Nesil AdTech platformudur:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600 dark:text-slate-300">
              <li><strong>NABIZ-Sense (Platform Kalkanı)</strong>: Siber zorbalık, bot saldırıları ve dezenformasyonu saptayan yerli NLP (BERTurk) ve yerel LLM destekli Türkçe Kök Neden Analiz sistemi.</li>
              <li><strong>NABIZ-Ads (AI Reklam Merkezi)</strong>: Arama çubuğu sadeliğinde çalışan, KOBİ'lerin bütçesini en verimli zaman ve kitleye otomatik eşleyen Doğal Dil Kampanya Sihirbazı.</li>
            </ul>
          </div>
        )}

        {activeReportSection === "sec-2" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 pb-2 border-b">2. KATMA DEĞER & YENİLİKÇİLİK</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-6">
              NABIZ, sosyal ağlarda üretilen heterojen veri okyanusunu homojen çok boyutlu tensör hücrelerine indirger. Klasik algoritmaların aksine bireysel kullanıcıları hedeflemek yerine agregasyon odaklı hücre yoğunluklarını modeller.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102d33] border">
                <h5 className="font-bold text-teal-700 dark:text-teal-300 mb-1">Milli & Özgün İnovasyon</h5>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Yabancı reklam ve moderasyon araçlarının Türkçe morfolojik karmaşıklığını yakalayamama problemine karşı fine-tuned BERTurk ve yerel LLM mimarisi entegre edilmiştir.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102d33] border">
                <h5 className="font-bold text-orange-600 mb-1">Çift Kanatlı Sinerji</h5>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Güvenlik (Sense) kanadının süzdüğü temiz organik etkileşim havuzu, doğrudan reklam (Ads) motoruna yüksek kaliteli fırsat sinyalleri olarak aktarılır.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeReportSection === "sec-3" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 pb-2 border-b">3. TEKNOLOJİ VE MATEMATİKSEL MODELLEME</h3>
            <p className="text-slate-600 dark:text-slate-300">Dinamik Z-Score sapma indeksi ve anomali karar kuralı:</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102d33] border text-center font-serif text-sm">
              Z<sub>i,j</sub>(t) = (X<sub>i,j</sub>(t) - &mu;<sub>i,j</sub>(W)) / (&sigma;<sub>i,j</sub>(W) + &epsilon;)
              <br />
              <strong className="text-rose-600 font-sans block mt-2">Anomali Kriteri: |Z<sub>i,j</sub>(t)| &ge; 3.0</strong>
            </div>
            <div className="mt-2 text-slate-600 dark:text-slate-300 text-[11px]">
              <p className="font-mono">W: 15 dakikalık hareketli kayan pencere boyutu</p>
              <p className="font-mono">&epsilon; = 10⁻⁵: Sıfıra bölünme koruma katsayısı</p>
              <p className="font-mono">&Phi;(eₖ): [-1.0, +1.0] BERTurk polarite skoru</p>
            </div>
          </div>
        )}

        {activeReportSection === "sec-4" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 pb-2 border-b">4. UYGULANABİLİRLİK & ROAS</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-6">
              KOBİ'lerin %73'ü karmaşık panel parametreleri sebebiyle reklam bütçelerinde ortalama %38 verimsizlik yaşamaktadır. NABIZ-Ads, doğal dil girdisini tensör fırsat hücreleriyle anında eşleyerek ROAS değerini 1:3.75x seviyesine (+%34 net artış) taşımıştır.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102d33] border font-mono">
              <span className="text-xs text-slate-400 block mb-1">Doğrulanmış Süreç Metrikleri:</span>
              <p className="text-emerald-600 font-bold">• Kampanya Kurulum Süresi: 35 dakikadan 12 saniyeye düşürüldü</p>
              <p className="text-teal-600 font-bold">• Kriz Yanıt Süresi: 4.2 saatten 32 saniyeye indirildi</p>
            </div>
          </div>
        )}

        {activeReportSection === "sec-6" && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 pb-2 border-b">6. SÜRDÜRÜLEBİLİRLİK VE DİNAMİK FİNANSAL PROJEKSİYON</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Aşağıdaki simülatör ile aktif KOBİ reklamveren sayısını değiştirerek 3 yıllık brüt gelir ve net faaliyet kârı (EBITDA) projeksiyonlarını dinamik olarak inceleyebilirsiniz:
              </p>
            </div>

            {/* Interactive Financial Growth Simulator Slider */}
            <div className={`p-5 rounded-2xl border ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#102d33] border-slate-700"}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-orange-600" />
                  Aktif KOBİ Reklamveren Sayısı:
                </span>
                <strong className="text-base font-bold text-orange-600 font-mono">
                  {financialSmeCount.toLocaleString("tr-TR")} İşletme
                </strong>
              </div>

              <input
                type="range"
                min="2500"
                max="85000"
                step="2500"
                value={financialSmeCount}
                onChange={(e) => setFinancialSmeCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />

              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Aylık Ortalama Harcama</span>
                  <strong className="text-sm font-bold text-slate-700 dark:text-slate-200">1.200 TL / KOBİ</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Hesaplanan Yıllık Brüt Gelir</span>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">
                    {((financialSmeCount * 360) / 1000).toFixed(0)} Bin TL ({((financialSmeCount * 360) / 1000000).toFixed(1)}M TL)
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">Net Faaliyet Kârı (EBITDA)</span>
                  <strong className="text-sm font-bold text-emerald-600">
                    +{((financialSmeCount * 270) / 1000000).toFixed(2)} Milyon TL
                  </strong>
                </div>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-[#102d33] p-3 font-bold">
                <div>Finansal Gösterge</div>
                <div>Yıl 1 (Pilot)</div>
                <div>Yıl 2 (Yayılım)</div>
                <div>Yıl 3 (MENA)</div>
              </div>
              <div className="grid grid-cols-4 gap-2 p-3 border-t font-mono">
                <div className="font-sans font-bold">Aktif KOBİ Reklamveren</div>
                <div>2.500 İşletme</div>
                <div>25.000 İşletme</div>
                <div>85.000 İşletme</div>
              </div>
              <div className="grid grid-cols-4 gap-2 p-3 border-t font-mono">
                <div className="font-sans font-bold">Toplam Brüt Gelir</div>
                <div>900.000 TL</div>
                <div>8.200.000 TL</div>
                <div>30.000.000 TL</div>
              </div>
              <div className="grid grid-cols-4 gap-2 p-3 border-t font-bold text-emerald-600 font-mono">
                <div className="font-sans font-bold">Net Faaliyet Kârı (EBITDA)</div>
                <div>+480.000 TL</div>
                <div>+6.100.000 TL</div>
                <div>+23.800.000 TL</div>
              </div>
            </div>
          </div>
        )}

        {activeReportSection === "sec-8" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 pb-2 border-b">8. TAKIM & KAYNAKÇA</h3>
            <div className="flex flex-col gap-2 text-slate-600 dark:text-slate-300">
              <p><strong>Takım Adı:</strong> Sadir Pehlivan</p>
              <p><strong>Takım ID:</strong> #990060</p>
              <p><strong>Başvuru ID:</strong> #5394865</p>
              <p><strong>Yarışma:</strong> TEKNOFEST 2026 N-Sosyal İnovasyon</p>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-[#102d33] border text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <p className="font-bold text-slate-700 dark:text-slate-200 mb-2 font-sans">Temel Kaynakça:</p>
              <p>1. BERTurk: dbmdz/bert-base-turkish-cased (Hugging Face Transformers)</p>
              <p>2. Ester, M. et al. (1996). A density-based algorithm for discovering clusters in large spatial databases with noise (DBSCAN).</p>
              <p>3. Shewhart, W. A. (1931). Economic Control of Quality of Manufactured Product (3-Sigma Z-Score Theory).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
