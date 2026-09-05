"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useNabiz } from "../../context/NabizContext";

export const PrivacyPanel = () => {
  const { theme } = useNabiz();

  return (
    <div
      className={`p-8 rounded-2xl border transition-all ${
        theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#0d2227] border-slate-800"
      }`}
    >
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-emerald-600" />
        Sıfır Bireysel Profilleme & KVKK Güvenlik Uyumluluğu
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        NABIZ Platformu; KVKK Madde 5 ve 6 çerçevesinde geliştirilmiş Sıfır Bireysel Profilleme (Zero-Profiling) prensibiyle çalışır. Kişisel veri ve üçüncü taraf çerezler kullanılmaz; yalnızca toplu tensör dağılımları işlenir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102d33]">
          <strong className="text-xs font-bold block mb-1">Kimliksizleştirme (SHA-256)</strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
            Kullanıcı kimlikleri veri giriş boru hattında SHA-256 hash algoritmalarıyla anında temizlenir.
          </span>
        </div>
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102d33]">
          <strong className="text-xs font-bold block mb-1">Yerli Sunucu & AES-256 Şifreleme</strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
            Tüm veri boru hatları ve açık kaynaklı yerli dil modelleri Türkiye sınırları içindeki yerel sunucularda çalıştırılır.
          </span>
        </div>
      </div>
    </div>
  );
};
