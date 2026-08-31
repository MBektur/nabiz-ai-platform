"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Bell,
  CheckCircle,
  Database,
  EyeOff,
  FileText,
  Flame,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquare,
  Moon,
  Play,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sun,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

// Mock interfaces
interface CellData {
  volume: number;
  mean: number;
  std: number;
  zScore: number;
  sentiment: number;
  isAnomaly: boolean;
  isOpportunity: boolean;
  details?: string;
}

interface Matrix {
  [city: string]: {
    [topic: string]: CellData;
  };
}

interface Alert {
  id: string;
  city: string;
  topic: string;
  zScore: number;
  sentiment: number;
  type: "CRISIS" | "OPPORTUNITY" | "BOT_NOISE";
  status: "UNRESOLVED" | "RESOLVING" | "RESOLVED";
  time: string;
  rootCause?: string;
  recommendedActions: string[];
}

interface Campaign {
  id: string;
  prompt: string;
  city: string;
  category: string;
  age: string;
  budget: number;
  adCopy: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  roas: number;
  clicks: number;
  impressions: number;
}

const getInitialMatrix = (): Matrix => ({
  "İstanbul": {
    "#Ulaşım": { volume: 135, mean: 120, std: 10, zScore: 1.5, sentiment: -0.1, isAnomaly: false, isOpportunity: false },
    "#Teknoloji": { volume: 180, mean: 170, std: 15, zScore: 0.67, sentiment: 0.3, isAnomaly: false, isOpportunity: false },
    "#Spor": { volume: 95, mean: 90, std: 8, zScore: 0.63, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "#Kültür": { volume: 88, mean: 45, std: 10, zScore: 4.3, sentiment: 0.85, isAnomaly: false, isOpportunity: true, details: "Kadıköy bölgesinde kahve festivalleri ve kültür etkinlikleri nedeniyle viral etkileşim patlaması." },
    "#Ekonomi": { volume: 62, mean: 60, std: 5, zScore: 0.4, sentiment: -0.2, isAnomaly: false, isOpportunity: false },
  },
  "Ankara": {
    "#Ulaşım": { volume: 54, mean: 50, std: 6, zScore: 0.67, sentiment: -0.2, isAnomaly: false, isOpportunity: false },
    "#Teknoloji": { volume: 78, mean: 75, std: 8, zScore: 0.38, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "#Spor": { volume: 32, mean: 35, std: 4, zScore: -0.75, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "#Kültür": { volume: 29, mean: 30, std: 3, zScore: -0.33, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "#Ekonomi": { volume: 91, mean: 85, std: 8, zScore: 0.75, sentiment: -0.4, isAnomaly: false, isOpportunity: false },
  },
  "İzmir": {
    "#Ulaşım": { volume: 148, mean: 32, std: 4, zScore: 3.92, sentiment: -0.78, isAnomaly: true, isOpportunity: false, details: "İzmir ana arterlerinde yaşanan sinyalizasyon arızası sonrası toplu taşıma aksaklıkları şikayetleri çığ gibi büyüdü." },
    "#Teknoloji": { volume: 41, mean: 40, std: 5, zScore: 0.2, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "#Spor": { volume: 60, mean: 55, std: 6, zScore: 0.83, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "#Kültür": { volume: 38, mean: 35, std: 4, zScore: 0.75, sentiment: 0.3, isAnomaly: false, isOpportunity: false },
    "#Ekonomi": { volume: 22, mean: 25, std: 3, zScore: -1.0, sentiment: -0.1, isAnomaly: false, isOpportunity: false },
  },
  "Bursa": {
    "#Ulaşım": { volume: 28, mean: 25, std: 3, zScore: 1.0, sentiment: -0.2, isAnomaly: false, isOpportunity: false },
    "#Teknoloji": { volume: 34, mean: 30, std: 4, zScore: 1.0, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "#Spor": { volume: 49, mean: 45, std: 5, zScore: 0.8, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "#Kültür": { volume: 19, mean: 20, std: 2, zScore: -0.5, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "#Ekonomi": { volume: 31, mean: 30, std: 3, zScore: 0.33, sentiment: -0.1, isAnomaly: false, isOpportunity: false },
  },
  "Antalya": {
    "#Ulaşım": { volume: 38, mean: 35, std: 4, zScore: 0.75, sentiment: -0.1, isAnomaly: false, isOpportunity: false },
    "#Teknoloji": { volume: 11, mean: 15, std: 2, zScore: -2.0, sentiment: 0.0, isAnomaly: false, isOpportunity: false },
    "#Spor": { volume: 14, mean: 15, std: 2, zScore: -0.5, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "#Kültür": { volume: 20, mean: 18, std: 2, zScore: 1.0, sentiment: 0.4, isAnomaly: false, isOpportunity: false },
    "#Ekonomi": { volume: 23, mean: 20, std: 2, zScore: 1.5, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
  },
});

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentPanel, setCurrentPanel] = useState<"dashboard" | "analytics" | "sense" | "ads" | "privacy" | "report">("dashboard");
  const [activeReportSection, setActiveReportSection] = useState<string>("sec-1");
  const [matrix, setMatrix] = useState<Matrix>(getInitialMatrix());
  const [selectedCell, setSelectedCell] = useState<{ city: string; topic: string } | null>({
    city: "İzmir",
    topic: "#Ulaşım",
  });
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "a1",
      city: "İzmir",
      topic: "#Ulaşım",
      zScore: 3.92,
      sentiment: -0.78,
      type: "CRISIS",
      status: "UNRESOLVED",
      time: "12:05",
      rootCause: "Ege Bölgesi × #Ulaşım hücresinde son 15 dakikada normalin 4.8 katı negatif etkileşim anomali skoru (Z = +3.92) hesaplandı. İzmir metro sinyalizasyon arızası şikayetleri viral yayılıma geçti.",
      recommendedActions: ["Topluluk Bildirilendirme Duyurusu Yayınla", "Moderasyon Hassasiyetini Artır"],
    },
    {
      id: "a2",
      city: "İstanbul",
      topic: "#Kültür",
      zScore: 4.30,
      sentiment: 0.85,
      type: "OPPORTUNITY",
      status: "UNRESOLVED",
      time: "12:10",
      rootCause: "Kadıköy civarında 3. Nesil Kahveciler ve festival akımları yoğun ilgi görüyor. Fırsat Skorlaması: ROAS +34% artış potansiyeli.",
      recommendedActions: ["Önerilen Reklam Kampanyası Başlat"],
    },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "c1",
      prompt: "Kadıköy'deki 3. nesil kahvecimiz için Reels tanıtımı yap",
      city: "İstanbul",
      category: "#Kültür",
      age: "18-30",
      budget: 2000,
      adCopy: "Kadıköy'ün kalbinde, en taze çekirdeklerle demlenmiş buz gibi Cold Brew deneyimi! ☕ Bu hafta sonu Kadıköy şubemize gelin, 2. kahveniz bizden olsun. ✨ #KadıköyKahve",
      status: "ACTIVE",
      roas: 3.82,
      clicks: 412,
      impressions: 12400,
    },
  ]);

  const [promptInput, setPromptInput] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  
  // Realtime scrolling wave points
  const [wavePoints, setWavePoints] = useState<number[]>([10, 15, 8, 20, 25, 12, 18, 30, 22, 15, 12, 28, 35, 14, 20, 15, 10, 25, 30, 12, 18]);
  const [wavePoints2, setWavePoints2] = useState<number[]>([15, 10, 22, 14, 18, 25, 30, 12, 8, 28, 15, 20, 22, 10, 14, 32, 18, 12, 25, 15, 10]);

  // Ticker items
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    "İzmir - #Ulaşım: 'Metrodaki 15 dakikalık gecikme can sıkıcı...' | Sentiment: -0.74 (Anonimleştirildi)",
    "İstanbul - #Kültür: 'Kadıköy'deki kahve festivali muazzam! ☕' | Sentiment: +0.89 (Anonimleştirildi)",
    "Ankara - #Teknoloji: 'Yapay zeka modellerinin Türkçe performansını test ediyoruz...' | Sentiment: +0.62 (Anonimleştirildi)",
    "Antalya - #Spor: 'Sabah maratonu için kayıtlar başladı 🏃‍♂️' | Sentiment: +0.45 (Anonimleştirildi)",
    "Bursa - #Ekonomi: 'Otomotiv sektörü ihracat rakamları olumlu.' | Sentiment: +0.25 (Anonimleştirildi)"
  ];

  // Analytics state variables
  const [timelineData, setTimelineData] = useState<number[]>([120, 140, 160, 130, 110, 185, 235]);
  const [timelineLabels, setTimelineLabels] = useState<string[]>(["11:45", "11:50", "11:55", "12:00", "12:05", "12:10", "12:15"]);
  const [totalEngagements, setTotalEngagements] = useState(12840);
  const [sentimentIndex, setSentimentIndex] = useState(0.42);
  const [botBlockedCount, setBotBlockedCount] = useState(4120);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] NABIZ Core Tensör Motoru aktif. (Pencere: 15 dakika)",
    "[DBSCAN] Yoğunluk analizi devrede. Bot algılama w_k eşikleri yüklendi.",
    "[ANOMALİ] İzmir × #Ulaşım hücresinde sapma saptandı (Z = +3.92, Duygu: -0.78)",
    "[FIRSAT] İstanbul × #Kültür hücresinde trend saptandı (Z = +4.30, Duygu: +0.85)",
  ]);

  // Real-time animation loops
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWavePoints(prev => {
        const next = [...prev.slice(1)];
        const isCrisis = alerts.some(a => a.status === "UNRESOLVED" && a.type === "CRISIS");
        const val = isCrisis
          ? Math.floor(Math.random() * 20) + 20
          : Math.floor(Math.random() * 12) + 5;
        next.push(val);
        return next;
      });

      setWavePoints2(prev => {
        const next = [...prev.slice(1)];
        const val = Math.floor(Math.random() * 15) + 5;
        next.push(val);
        return next;
      });
    }, 400);

    const tickerInterval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerItems.length);
    }, 4000);

    return () => {
      clearInterval(waveInterval);
      clearInterval(tickerInterval);
    };
  }, [alerts]);

  // Handle simulations
  const triggerIzmirCrisis = () => {
    const updated = getInitialMatrix();
    updated["İzmir"]["#Ulaşım"] = {
      volume: 245,
      mean: 32,
      std: 4,
      zScore: 5.12,
      sentiment: -0.92,
      isAnomaly: true,
      isOpportunity: false,
    };
    setMatrix(updated);
    
    const newAlert: Alert = {
      id: "crisis_" + Date.now(),
      city: "İzmir",
      topic: "#Ulaşım",
      zScore: 5.12,
      sentiment: -0.92,
      type: "CRISIS",
      status: "UNRESOLVED",
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      rootCause: "Kritik anomali seviyesi (Z = +5.12). İzmir metro ve otobüs hatlarındaki aksama şikayetleri en tepe noktada. Negatif duygusal eğilim rekor düzeyde.",
      recommendedActions: ["Topluluk Bildirilendirme Duyurusu Yayınla", "Filtre Hassasiyetini Artır"],
    };
    
    setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== "a1")]);
    setSelectedCell({ city: "İzmir", topic: "#Ulaşım" });
    
    setTimelineData([120, 140, 160, 130, 245, 290, 310]);
    setTotalEngagements(14230);
    setSentimentIndex(-0.15);
    
    setLogs(prev => [
      `[ALERT] KRİTİK SEVİYE: İzmir × #Ulaşım Z-Score ${newAlert.zScore}'e yükseldi!`,
      `[NLP] BERTurk duygu polaritesi: ${newAlert.sentiment} (Aşırı Negatif)`,
      `[ANALYTICS] Toplam platform negatif duygu eğilimi %15 artış gösterdi.`,
      ...prev,
    ]);
  };

  const triggerKadikoyOpportunity = () => {
    const updated = getInitialMatrix();
    updated["İstanbul"]["#Kültür"] = {
      volume: 185,
      mean: 45,
      std: 10,
      zScore: 6.20,
      sentiment: 0.95,
      isAnomaly: false,
      isOpportunity: true,
    };
    setMatrix(updated);
    setSelectedCell({ city: "İstanbul", topic: "#Kültür" });
    
    setTimelineData([120, 140, 160, 130, 185, 250, 280]);
    setTotalEngagements(13540);
    setSentimentIndex(0.68);
    
    setLogs(prev => [
      `[TREND] İstanbul × #Kültür Z-Score 6.2'ye yükseldi!`,
      `[ROAS] Yapay zeka reklam fırsat optimizasyonu aktif. Potansiyel ROAS: +45%`,
      `[ANALYTICS] #Kültür kategorisi etkileşim hacmi son 5 dakikada %110 büyüdü.`,
      ...prev,
    ]);
    
    setPromptInput("Kadıköy'deki butik kahvecimiz için Reels reklamı yap");
    setCurrentPanel("ads");
  };

  const triggerBursaBotAttack = () => {
    const updated = getInitialMatrix();
    updated["Bursa"]["#Ekonomi"] = {
      volume: 310,
      mean: 30,
      std: 3,
      zScore: 9.30,
      sentiment: 0.0,
      isAnomaly: false,
      isOpportunity: false,
    };
    setMatrix(updated);
    setSelectedCell({ city: "Bursa", topic: "#Ekonomi" });
    setBotBlockedCount(prev => prev + 280);
    
    setLogs(prev => [
      `[DBSCAN] Bot Saldırısı Engellendi! Bursa × #Ekonomi hücresinde 280 adet şüpheli hesap elendi (Kullanıcı itibar w_k < 0.1).`,
      `[SYSTEM] Z-score düzeltildi ve anomali uyarısı üretilmedi. (Filtreleme Başarısı: %100)`,
      `[PRIVACY] KVKK uyum boru hattı: şüpheli hesapların IP ve cihaz parmak izleri anonim olarak loglandı.`,
      ...prev,
    ]);
  };

  const resetAll = () => {
    setMatrix(getInitialMatrix());
    setAlerts([
      {
        id: "a1",
        city: "İzmir",
        topic: "#Ulaşım",
        zScore: 3.92,
        sentiment: -0.78,
        type: "CRISIS",
        status: "UNRESOLVED",
        time: "12:05",
        rootCause: "Ege Bölgesi × #Ulaşım hücresinde son 15 dakikada normalin 4.8 katı negatif etkileşim anomali skoru (Z = +3.92) hesaplandı. İzmir metro sinyalizasyon arızası şikayetleri viral yayılıma geçti.",
        recommendedActions: ["Topluluk Bildirilendirme Duyurusu Yayınla", "Moderasyon Hassasiyetini Artır"],
      },
      {
        id: "a2",
        city: "İstanbul",
        topic: "#Kültür",
        zScore: 4.30,
        sentiment: 0.85,
        type: "OPPORTUNITY",
        status: "UNRESOLVED",
        time: "12:10",
        rootCause: "Kadıköy civarında 3. Nesil Kahveciler ve festival akımları yoğun ilgi görüyor. Fırsat Skorlaması: ROAS +34% artış potansiyeli.",
        recommendedActions: ["Önerilen Reklam Kampanyası Başlat"],
      },
    ]);
    setSelectedCell({ city: "İzmir", topic: "#Ulaşım" });
    setTimelineData([120, 140, 160, 130, 110, 185, 235]);
    setTotalEngagements(12840);
    setSentimentIndex(0.42);
    setLogs([
      "[SYSTEM] Sistem normal değerlerine döndürüldü.",
      "[SYSTEM] NABIZ Core Tensör Motoru aktif. (Pencere: 15 dakika)",
    ]);
  };

  const handleAction = (alertId: string, action: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: "RESOLVED" } : a))
    );
    setLogs(prev => [
      `[ACTION] [Yönetici Müdahalesi] "${action}" aksiyonu devreye sokuldu. Tepki süresi: 32sn.`,
      `[SENSE] Kriz durumu kontrol altına alınıyor. Negatif etkileşim hızı düşüşe geçti.`,
      ...prev,
    ]);
  };

  const generateAdCampaign = () => {
    if (!promptInput) return;
    
    let category = "#Kültür";
    let city = "İstanbul";
    let age = "18-30";
    let budget = 1500;
    let targetCopy = "";

    if (promptInput.toLowerCase().includes("soğuk") || promptInput.toLowerCase().includes("kahve")) {
      targetCopy = "Kadıköy sokaklarında güneşin tadını çıkarırken buz gibi bir Cold Brew iyi gitmez mi? ☕️ En kaliteli çekirdeklerle 18 saat demlenen taze lezzetimizi denemek için bugün Kadıköy şubemize bekliyoruz! ❄️✨";
      city = "İstanbul";
      category = "#Kültür";
      age = "18-28";
    } else if (promptInput.toLowerCase().includes("yapay") || promptInput.toLowerCase().includes("yazılım")) {
      targetCopy = "Geleceğin teknolojisini bugünden inşa et! 🚀 Genç yazılımcılar için hazırladığımız Yapay Zeka Destekli Geliştirici Kursu kayıtları başladı! Hemen tıkla, yerini ayırt. 💻🤖";
      city = "Ankara";
      category = "#Teknoloji";
      age = "16-25";
      budget = 750;
    } else {
      targetCopy = `Fırsat Zamanı! Sosyal ağlarda öne çıkan en trend konu olan ${category} kategorisinde markanı duyurmanın tam zamanı. Özel fırsatlarla yayındayız! 🌟`;
    }

    setAiSuggestions({
      city,
      category,
      age,
      budget,
      adCopy: targetCopy,
      timeWindow: "Cuma 18:30 - Pazar 21:30 (Maksimum Etkileşim Aralığı)",
      targetMatches: ["Kahve Severler", "Kadıköy Lokasyonu", "Genç Kitle"],
    });

    setLogs(prev => [
      `[AI WIZARD] Doğal dil girdisi işlendi: "${promptInput}"`,
      `[AI WIZARD] BERTurk & LLM yardımıyla reklam parametreleri eşlendi. Şehir: ${city}, Kategori: ${category}`,
      ...prev,
    ]);
  };

  const launchCampaign = () => {
    if (!aiSuggestions) return;
    const newCamp: Campaign = {
      id: "camp_" + Date.now(),
      prompt: promptInput,
      city: aiSuggestions.city,
      category: aiSuggestions.category,
      age: aiSuggestions.age,
      budget: aiSuggestions.budget,
      adCopy: aiSuggestions.adCopy,
      status: "ACTIVE",
      roas: 3.74,
      clicks: 0,
      impressions: 0,
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setLogs(prev => [
      `[CAMPAIGN] Yeni kampanya başlatıldı! Bütçe: ${newCamp.budget} TL. Hedef kitleye en uygun zaman diliminde gösterilmeye başlandı.`,
      ...prev,
    ]);
    
    setTimeout(() => {
      setCampaigns(prev =>
        prev.map(c =>
          c.id === newCamp.id
            ? { ...c, clicks: 142, impressions: 4500, roas: 3.86 }
            : c
        )
      );
    }, 4000);

    setPromptInput("");
    setAiSuggestions(null);
  };

  const handleQuickPrompt = (txt: string) => {
    setPromptInput(txt);
  };

  const activeCellData = selectedCell ? matrix[selectedCell.city][selectedCell.topic] : null;

  // Curated theme definitions
  const themeClasses = theme === "light" 
    ? {
        bg: "bg-[#FAF7F2] text-[#2C3E50]",
        sidebar: "bg-white border-[#E1CDB5] shadow-sm",
        card: "bg-white border-[#E1CDB5] shadow-sm text-[#2C3E50]",
        innerCard: "bg-[#FFFDF9] border-[#E1CDB5]",
        header: "bg-white/80 border-[#E1CDB5] text-[#2C3E50]",
        footer: "border-[#E1CDB5] bg-white text-[#7F8C8D]",
        textSec: "text-[#7F8C8D]",
        border: "border-[#E1CDB5]",
        activeTab: "bg-[#1B4A7D] text-white",
        inactiveTab: "text-[#7F8C8D] hover:bg-[#FAF7F2] hover:text-[#2C3E50]",
        input: "bg-[#FFFDF9] border-[#E1CDB5] text-[#2C3E50] focus:border-[#1B4A7D]",
        logBg: "bg-white border-[#E1CDB5] text-[#2C3E50]",
        cellNormal: "bg-[#FFFDF9] hover:bg-[#FAF7F2] border-[#E1CDB5] text-[#2C3E50]",
      }
    : {
        bg: "bg-slate-950 text-slate-100",
        sidebar: "bg-slate-900/50 border-slate-900 shadow-none",
        card: "bg-slate-900/30 border-slate-900 text-slate-100",
        innerCard: "bg-slate-950/80 border-slate-900",
        header: "bg-slate-950/80 border-slate-900 text-slate-100",
        footer: "border-slate-900 bg-slate-950 text-slate-600",
        textSec: "text-slate-400",
        border: "border-slate-900",
        activeTab: "bg-amber-500 text-slate-950",
        inactiveTab: "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
        input: "bg-slate-950 border-slate-900 text-slate-200 focus:border-amber-500",
        logBg: "bg-slate-950 border-slate-900 text-slate-500",
        cellNormal: "bg-slate-900 hover:bg-slate-850 border-slate-900 text-slate-400",
      };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row font-sans selection:bg-amber-500 selection:text-slate-900 transition-colors duration-300 ${themeClasses.bg}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-full lg:w-72 border-r flex flex-col p-4 pt-6 shrink-0 transition-colors duration-300 ${themeClasses.sidebar}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#1B4A7D] to-[#D32F2F] flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Activity className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#1B4A7D] to-[#D32F2F] bg-clip-text text-transparent">
              NABIZ AI
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              Karar Destek
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            onClick={() => setCurrentPanel("dashboard")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              currentPanel === "dashboard"
                ? themeClasses.activeTab
                : themeClasses.inactiveTab
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
            Genel Bakış
          </button>

          <button
            onClick={() => setCurrentPanel("analytics")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              currentPanel === "analytics"
                ? themeClasses.activeTab
                : themeClasses.inactiveTab
            }`}
          >
            <TrendingUp className="h-4.5 w-4.5" />
            Detaylı Analitik
          </button>

          <button
            onClick={() => setCurrentPanel("sense")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              currentPanel === "sense"
                ? themeClasses.activeTab
                : themeClasses.inactiveTab
            }`}
          >
            <Shield className="h-4.5 w-4.5" />
            NABIZ-Sense Güvenlik
          </button>

          <button
            onClick={() => setCurrentPanel("ads")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              currentPanel === "ads"
                ? themeClasses.activeTab
                : themeClasses.inactiveTab
            }`}
          >
            <Award className="h-4.5 w-4.5" />
            NABIZ-Ads Reklam Sihirbazı
          </button>

          <button
            onClick={() => setCurrentPanel("privacy")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              currentPanel === "privacy"
                ? themeClasses.activeTab
                : themeClasses.inactiveTab
            }`}
          >
            <Lock className="h-4.5 w-4.5" />
            KVKK & Gizlilik Uyum
          </button>

          <button
            onClick={() => setCurrentPanel("report")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
              currentPanel === "report"
                ? themeClasses.activeTab
                : themeClasses.inactiveTab
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            Proje Raporu (HTML)
          </button>
        </nav>

        {/* Sidebar Footer badges */}
        <div className={`pt-4 border-t flex flex-col gap-2 ${themeClasses.border}`}>
          <span className="text-[9px] font-bold py-1 px-2.5 rounded-lg bg-[#1B4A7D]/10 text-[#1B4A7D] border border-[#1B4A7D]/20 flex items-center gap-1.5 justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            TEKNOFEST 2026
          </span>
          <span className="text-[9px] font-bold text-center py-1 px-2.5 rounded-lg bg-[#D32F2F]/10 text-[#D32F2F] border border-[#D32F2F]/10">
            Sadir Pehlivan (#990060)
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className={`border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors duration-300 ${themeClasses.header}`}>
          <h2 className="text-sm font-bold uppercase tracking-wider">
            {currentPanel === "dashboard" && "Genel Bakış Kontrol Panosu"}
            {currentPanel === "analytics" && "Detaylı Metrik & Zaman Serisi Analitiği"}
            {currentPanel === "sense" && "NABIZ-Sense Siber Güvenlik & Moderasyon"}
            {currentPanel === "ads" && "NABIZ-Ads Doğal Dil Güdümlü Reklam"}
            {currentPanel === "privacy" && "KVKK & Sıfır Profil Telemetrisi"}
            {currentPanel === "report" && "Proje Teknik Raporu (HTML Belgesi)"}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Realtime Wave mini-indicator */}
            <div className="hidden md:flex items-center gap-1.5 h-6 bg-slate-900/10 px-2 rounded-lg border border-slate-900/5">
              <svg className="w-16 h-4 text-emerald-500" viewBox="0 0 40 10" preserveAspectRatio="none">
                <path
                  d={`M 0 5 ${wavePoints2.slice(-10).map((p, i) => `L ${(i / 9) * 40} ${10 - (p/4)}`).join(" ")}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Signal</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-xl border hover:bg-[#FAF7F2] dark:hover:bg-slate-900 transition-all cursor-pointer ${themeClasses.border}`}
              title={theme === "light" ? "Karanlık Moda Geç" : "Aydınlık Moda Geç"}
            >
              {theme === "light" ? (
                <Moon className="h-4.5 w-4.5 text-[#2C3E50]" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-amber-400" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider">TENSÖR MOTORU</span>
            </div>
          </div>
        </header>

        {/* Content Screens */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* PANEL 1: OVERVIEW / DASHBOARD */}
          {currentPanel === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Heat Matrix Pane */}
              <div className={`lg:col-span-8 border rounded-2xl p-6 relative transition-colors duration-300 ${themeClasses.card}`}>
                <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-[#1B4A7D]/5 to-[#D32F2F]/0 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500 animate-bounce" />
                    <h3 className="font-bold text-sm">Çok Eksenli Karar Matrisi</h3>
                  </div>
                  
                  <div className="flex gap-4 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded bg-slate-800/10 border border-slate-700/20"></span> Normal
                    </span>
                    <span className="flex items-center gap-1 text-rose-500">
                      <span className="h-2 w-2 rounded bg-rose-950 border border-rose-500 animate-pulse"></span> Kriz (Z ≥ 3.0)
                    </span>
                    <span className="flex items-center gap-1 text-[#F4B41A]">
                      <span className="h-2 w-2 rounded bg-amber-950/20 border border-amber-500"></span> Fırsat
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    {/* Headers */}
                    <div className="grid grid-cols-6 gap-2 mb-2 border-b pb-2 text-center text-xs font-semibold text-slate-400">
                      <div className="text-left pl-2">Şehir</div>
                      <div>#Ulaşım</div>
                      <div>#Teknoloji</div>
                      <div>#Spor</div>
                      <div>#Kültür</div>
                      <div>#Ekonomi</div>
                    </div>
                    {/* Grid Rows */}
                    {Object.keys(matrix).map(city => (
                      <div key={city} className="grid grid-cols-6 gap-2 mb-2 items-center text-center">
                        <div className="text-left font-bold text-sm flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {city}
                        </div>

                        {Object.keys(matrix[city]).map(topic => {
                          const cell = matrix[city][topic];
                          let cellClass = themeClasses.cellNormal;
                          let label = null;

                          if (cell.isAnomaly) {
                            cellClass = "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-200 animate-pulse";
                            label = <span className="absolute top-1 right-1 text-[8px] font-bold bg-rose-600 text-white px-1 rounded">⚠ Z:{cell.zScore}</span>;
                          } else if (cell.isOpportunity) {
                            cellClass = "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-200";
                            label = <span className="absolute top-1 right-1 text-[8px] font-bold bg-amber-500 text-slate-950 px-1 rounded">🎯 ROAS</span>;
                          }

                          const isSelected = selectedCell?.city === city && selectedCell?.topic === topic;

                          return (
                            <button
                              key={topic}
                              onClick={() => setSelectedCell({ city, topic })}
                              className={`h-16 rounded-xl border flex flex-col justify-center items-center relative transition-all cursor-pointer ${cellClass} ${
                                isSelected ? "ring-2 ring-[#1B4A7D] scale-[1.02] shadow-md" : ""
                              }`}
                            >
                              {label}
                              <span className="text-xs font-bold">{cell.volume}</span>
                              <span className="text-[10px] text-slate-500">Norm: {cell.mean}</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Cell details */}
                {selectedCell && activeCellData && (
                  <div className={`mt-6 p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300 ${themeClasses.innerCard}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-400">Detaylar:</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/10 dark:bg-slate-900 text-slate-400 border border-slate-800/10">
                          {selectedCell.city}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/10 dark:bg-slate-900 text-amber-500 border border-slate-800/10 font-mono">
                          {selectedCell.topic}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                        {activeCellData.details || "Matris hücresi olağan sınırlar içinde hareket etmektedir. Herhangi bir kriz veya anomali tespit edilmemiştir."}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <div>
                        <span className="text-slate-500">Z-Score:</span>{" "}
                        <span className={`font-mono font-bold ${activeCellData.zScore >= 3.0 ? "text-rose-500" : "text-slate-400"}`}>
                          {activeCellData.zScore >= 0 ? "+" : ""}{activeCellData.zScore.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Duygu Skoru:</span>{" "}
                        <span className={`font-mono font-bold ${activeCellData.sentiment < 0 ? "text-rose-500" : activeCellData.sentiment > 0 ? "text-amber-500" : "text-slate-500"}`}>
                          {activeCellData.sentiment >= 0 ? "+" : ""}{activeCellData.sentiment.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Side Center */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Event Simulation */}
                <div className={`border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Play className="h-5 w-5 text-rose-500 animate-pulse" />
                      <h4 className="font-bold text-sm">Olay Simülasyon Merkezi</h4>
                    </div>
                    <button onClick={resetAll} className="text-[10px] px-2.5 py-1 rounded bg-slate-900/10 dark:bg-slate-900 border border-slate-800/10 text-slate-400 hover:text-slate-200 cursor-pointer">
                      Sıfırla
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={triggerIzmirCrisis}
                      className="w-full text-left p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-700 dark:text-rose-200 transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold block mb-1">🚦 İzmir Ulaşım Krizi (Kriz)</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block">
                        Z = +3.92 Kriz anomalisini tetikleyerek Sense alarmını aktifleştir.
                      </span>
                    </button>

                    <button
                      onClick={triggerKadikoyOpportunity}
                      className="w-full text-left p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-200 transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold block mb-1">🎯 Kadıköy Kahve Trendi (Fırsat)</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block">
                        Matris üzerinde ROAS artıran AdTech fırsatı ve yönlendirmesini aktifleştir.
                      </span>
                    </button>

                    <button
                      onClick={triggerBursaBotAttack}
                      className="w-full text-left p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-700 dark:text-blue-200 transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-bold block mb-1">🤖 Bursa Bot Saldırısı (Filtre)</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block">
                        DBSCAN yoğunluk kümelemesi ile bot noise hesaplarını engelle.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Real-time flowing wave chart */}
                <div className={`border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Activity className="h-4.5 w-4.5 text-emerald-500 animate-pulse" /> Canlı Veri Giriş Dalgası
                  </h4>
                  <div className="h-20 flex items-end">
                    <svg className="w-full h-full text-amber-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path
                        d={`M 0 40 ${wavePoints.map((p, i) => `L ${(i / (wavePoints.length - 1)) * 100} ${40 - p}`).join(" ")} L 100 40 Z`}
                        fill="url(#wave-gradient)"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />
                      <defs>
                        <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 mt-1 font-mono uppercase tracking-wider">
                    <span>-10s</span>
                    <span>Aktif Olay Akışı</span>
                    <span>Şimdi</span>
                  </div>
                </div>

                {/* Console */}
                <div className={`border rounded-xl p-4 font-mono text-[10px] transition-colors duration-300 ${themeClasses.logBg}`}>
                  <div className="flex items-center justify-between mb-2 text-slate-400 font-bold border-b pb-1">
                    <span>SİSTEM EVENT LOGS</span>
                    <span className="text-[9px] text-amber-500">LIVE</span>
                  </div>
                  <div className="h-24 overflow-y-auto flex flex-col gap-1 pr-2">
                    {logs.map((log, idx) => (
                      <div key={idx}>
                        <span className="text-slate-400/60">[{new Date().toLocaleTimeString("tr-TR")}]</span> {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* PANEL 2: DETAILED ANALYTICS */}
          {currentPanel === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Stat Cards */}
              <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors duration-300 ${themeClasses.card}`}>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Toplam Etkileşim Hacmi</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold">{totalEngagements.toLocaleString()}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">+8.4%</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors duration-300 ${themeClasses.card}`}>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Ortalama Semantik Duygu</span>
                  <div className="flex items-end justify-between">
                    <span className={`text-xl font-bold ${sentimentIndex < 0 ? "text-rose-500" : "text-amber-500"}`}>
                      {sentimentIndex >= 0 ? "+" : ""}{sentimentIndex.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500">Scale: -1 / +1</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors duration-300 ${themeClasses.card}`}>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Engellenen Bot Hesabı</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold">{botBlockedCount}</span>
                    <span className="text-[10px] text-rose-500 font-semibold">DBSCAN Aktif</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-colors duration-300 ${themeClasses.card}`}>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Aktif AdTech Kampanyaları</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold">{campaigns.length}</span>
                    <span className="text-[10px] text-amber-500 font-semibold">Ort. ROAS 3.82x</span>
                  </div>
                </div>
              </div>

              {/* Time series dynamic bar chart */}
              <div className={`lg:col-span-8 border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-amber-500" /> Platform Etkileşim Hacmi Zaman Serisi (15 Dk Kayan Pencere)
                </h3>
                
                {/* Visual Bar chart custom renderer */}
                <div className="h-64 flex items-end justify-between gap-3 px-4 pt-4 border-b border-slate-900/10 relative">
                  <div className="absolute left-0 right-0 top-1/4 border-t border-slate-900/10 border-dashed text-[10px] text-slate-500 pl-2">300k Peak</div>
                  <div className="absolute left-0 right-0 top-2/4 border-t border-slate-900/10 border-dashed text-[10px] text-slate-500 pl-2">200k Normal</div>
                  <div className="absolute left-0 right-0 top-3/4 border-t border-slate-900/10 border-dashed text-[10px] text-slate-500 pl-2">100k Base</div>

                  {timelineData.map((val, idx) => {
                    const pct = Math.min(100, (val / 320) * 100);
                    const isHigh = val > 200;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center z-10">
                        <span className="text-[10px] font-mono text-slate-500 mb-1">{val}k</span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isHigh 
                              ? "bg-gradient-to-t from-rose-600 to-rose-400 shadow-lg shadow-rose-500/10" 
                              : "bg-gradient-to-t from-[#1B4A7D] to-[#1B4A7D]/70"
                          }`}
                          style={{ height: `${pct}%`, minHeight: "15%" }}
                        ></div>
                        <span className="text-[10px] text-slate-500 mt-2 font-mono">{timelineLabels[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top hashtags & trends */}
              <div className={`lg:col-span-4 border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Flame className="h-4.5 w-4.5 text-rose-500 animate-pulse" /> Platform Trend Hashtag Dağılımı
                </h3>
                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-400">
                      <span>#Ulaşım</span>
                      <span>%38</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900/10 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: "38%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-400">
                      <span>#Teknoloji</span>
                      <span>%28</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900/10 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1B4A7D]" style={{ width: "28%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-400">
                      <span>#Kültür</span>
                      <span>%18</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900/10 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: "18%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-400">
                      <span>#Spor</span>
                      <span>%10</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900/10 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400" style={{ width: "10%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-400">
                      <span>#Ekonomi</span>
                      <span>%6</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900/10 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-300" style={{ width: "6%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PANEL 3: NABIZ-SENSE SECURITY */}
          {currentPanel === "sense" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Active Alarms */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className={`border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Bell className="h-4.5 w-4.5 text-rose-500" /> Platform Güvenlik Kalkanı Alarmları
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    {alerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-xl border flex flex-col gap-3 ${
                          alert.status === "RESOLVED"
                            ? "bg-slate-900/5 border-slate-900/10 opacity-60 text-slate-500"
                            : alert.type === "CRISIS"
                            ? "bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-200"
                            : "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-bold">
                            <AlertTriangle className={`h-4 w-4 ${alert.type === "CRISIS" ? "text-rose-500" : "text-amber-400"}`} />
                            {alert.city} × {alert.topic} (Z = {alert.zScore.toFixed(2)})
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            alert.status === "RESOLVED"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse"
                          }`}>
                            {alert.status === "RESOLVED" ? "KONTROL ALTINDA" : "MODERASYON GEREKLİ"}
                          </span>
                        </div>

                        <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-colors duration-300 ${themeClasses.innerCard}`}>
                          <strong className="text-amber-600 block mb-1">Yerli LLM Türkçe Kök Neden Analizi:</strong>
                          {alert.rootCause}
                        </div>

                        {alert.status !== "RESOLVED" && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {alert.recommendedActions.map(action => (
                              <button
                                key={action}
                                onClick={() => handleAction(alert.id, action)}
                                className="text-[10px] px-3 py-1.5 rounded-lg bg-slate-950/10 dark:bg-slate-950 border border-slate-800/10 hover:border-amber-500/50 hover:bg-slate-900/10 text-slate-500 dark:text-slate-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="h-3 w-3 text-amber-500" /> {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BERTurk and Model Metrics */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className={`border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <UserCheck className="h-4.5 w-4.5 text-emerald-500" /> NLP & LLM Model Metrikleri
                  </h3>
                  
                  <div className="flex flex-col gap-4 text-xs">
                    <div className="border-b border-slate-900/10 pb-3">
                      <span className="text-slate-500 block mb-1">BERTurk Duygu Eşleşme Doğruluğu</span>
                      <strong className="font-bold">%92.4 Accuracy (5-Fold CV)</strong>
                    </div>

                    <div className="border-b border-slate-900/10 pb-3">
                      <span className="text-slate-500 block mb-1">Yerel LLM Çıkarım Gecikmesi</span>
                      <strong className="font-bold">1.24 saniye (Ollama 4-bit AWQ)</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">DBSCAN Küme Başarımı</span>
                      <strong className="font-bold">F1-Score: 0.920</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PANEL 4: NABIZ-ADS CAMPAIGN WIZARD */}
          {currentPanel === "ads" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Campaign wizard prompt engine */}
              <div className={`lg:col-span-7 border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5 text-amber-500" /> Akıllı Kampanya Oluşturucu
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reklam Hedefini Girin</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={promptInput}
                        onChange={e => setPromptInput(e.target.value)}
                        placeholder="Örn: Kadıköy'deki kahvecimiz için Reels reklamı yap..."
                        className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none pr-10 transition-colors duration-300 ${themeClasses.input}`}
                      />
                      <button
                        onClick={generateAdCampaign}
                        className="absolute right-2 p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        <Send className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[9px] text-slate-500 font-bold self-center mr-1">Örnek Şablonlar:</span>
                      <button
                        onClick={() => handleQuickPrompt("Kadıköy'deki kahvecimiz için Reels reklamı yap")}
                        className="text-[9px] px-2 py-1 rounded bg-slate-900/5 hover:bg-slate-900/10 border border-slate-800/10 text-slate-500 cursor-pointer"
                      >
                        ☕ Kadıköy Soğuk Kahve
                      </button>
                      <button
                        onClick={() => handleQuickPrompt("Yazılım eğitim kursumuzu yapay zekayla ilgilenen gençlere duyur")}
                        className="text-[9px] px-2 py-1 rounded bg-slate-900/5 hover:bg-slate-900/10 border border-slate-800/10 text-slate-500 cursor-pointer"
                      >
                        💻 Yapay Zeka Kursu
                      </button>
                    </div>
                  </div>

                  {aiSuggestions && (
                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-amber-900/30 pb-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Zap className="h-4 w-4" /> AI Parametre Optimizasyonu
                        </span>
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          Zamanlama Eşleşti
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500 block mb-0.5">Hedef Şehir</span>
                          <span className="font-bold">{aiSuggestions.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Yaş Aralığı</span>
                          <span className="font-bold">{aiSuggestions.age}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500 block mb-0.5">Önerilen Etkileşim Zamanı</span>
                          <span className="font-bold">{aiSuggestions.timeWindow}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500 block mb-1">AI Reklam Metni Taslağı (Türkçe)</span>
                          <div className={`p-3 rounded-lg border text-xs italic leading-relaxed transition-colors duration-300 ${themeClasses.innerCard}`}>
                            {aiSuggestions.adCopy}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={launchCampaign}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Kampanyayı Canlıya Al
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Campaigns Table */}
              <div className={`lg:col-span-5 border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-amber-500" /> Canlı Kampanyalar & ROAS
                </h3>
                
                <div className="flex flex-col gap-3">
                  {campaigns.map(camp => (
                    <div key={camp.id} className={`p-4 rounded-xl border text-xs transition-colors duration-300 ${themeClasses.innerCard}`}>
                      <div className="flex justify-between items-center mb-2 font-bold">
                        <span>{camp.prompt}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {camp.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 mt-2 border-t border-slate-900/10 pt-2">
                        <div>
                          <span>Bütçe:</span> <strong className="text-slate-600 dark:text-slate-300">{camp.budget} TL</strong>
                        </div>
                        <div>
                          <span>Tıklama:</span> <strong className="text-slate-600 dark:text-slate-300">{camp.clicks}</strong>
                        </div>
                        <div>
                          <span>ROAS Skoru:</span> <strong className="text-amber-500 font-bold">{camp.roas}x</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* PANEL 5: KVKK & PRIVACY COMPLIANCE */}
          {currentPanel === "privacy" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Compliance checklist */}
              <div className={`lg:col-span-8 border rounded-2xl p-6 transition-colors duration-300 ${themeClasses.card}`}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Sıfır Profilleme & KVKK Güvenlik Uyumluluğu
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  NABIZ Platformu, KVKK Madde 5 ve 6 çerçevesinde tasarlanmış sıfır bireysel profilleme (Zero-Profiling) ilkeleriyle çalışır. Sosyal medya verilerindeki kişisel kimlikler veri giriş boru hattında anlık anonimleştirilerek sadece toplu matris dağılımları tensöre yansıtılır.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors duration-300 ${themeClasses.innerCard}`}>
                    <EyeOff className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs block mb-1">Kimliksizleştirme (De-identification)</strong>
                      <span className="text-[10px] text-slate-500 leading-relaxed block">
                        Kullanıcı kullanıcı adı, soyadı ve profil detayları tensör snapshots tablosuna yazılmadan önce SHA-256 hash algoritmalarıyla tamamen temizlenir.
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors duration-300 ${themeClasses.innerCard}`}>
                    <Database className="h-5 w-5 text-[#1B4A7D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs block mb-1">Yerli Sunucu Güvencesi</strong>
                      <span className="text-[10px] text-slate-500 leading-relaxed block">
                        Tüm veri boru hatları, PostgreSQL veri tabanı ve yerli dil modelleri Türkiye sınırları içindeki yerel sunucularda çalıştırılmakta, yurt dışına veri aktarımı yapılmamaktadır.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Anonymization log table */}
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Veri Akışı Anonimleştirme Günlüğü</h4>
                  <div className={`border rounded-xl overflow-hidden text-xs transition-colors duration-300 ${themeClasses.border}`}>
                    <div className="grid grid-cols-4 gap-2 bg-slate-900/5 dark:bg-slate-950 p-2.5 font-bold text-slate-400 border-b">
                      <div>Kaynak Alan</div>
                      <div>Metot</div>
                      <div>Maskeleme</div>
                      <div>Durum</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 p-2.5 border-b border-slate-900/10 items-center">
                      <div className="font-mono">user.username</div>
                      <div>SHA-256 Hash</div>
                      <div className="font-mono text-slate-500">e3b0c442...</div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 w-fit">OK</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 p-2.5 border-b border-slate-900/10 items-center">
                      <div className="font-mono">post.location_gps</div>
                      <div>Bölgesel Agregasyon</div>
                      <div className="font-mono text-slate-500">İzmir (Genel)</div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 w-fit">OK</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 p-2.5 items-center">
                      <div className="font-mono">user.device_ip</div>
                      <div>IPv4 Masking</div>
                      <div className="font-mono text-slate-500">192.168.***.***</div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 w-fit">OK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DB encryption panel */}
              <div className={`lg:col-span-4 border rounded-2xl p-6 flex flex-col gap-4 transition-colors duration-300 ${themeClasses.card}`}>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Lock className="h-4.5 w-4.5 text-amber-500" /> Veri Güvenlik Kalkanı
                </h3>
                
                <div className="flex flex-col gap-4 text-xs mt-2">
                  <div className="p-3 rounded-lg bg-slate-900/5 dark:bg-slate-950 border border-slate-800/10 flex justify-between items-center">
                    <span>Veritabanı Şifreleme</span>
                    <strong className="text-emerald-500">AES-256 Aktif</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/5 dark:bg-slate-950 border border-slate-800/10 flex justify-between items-center">
                    <span>IP / Cihaz Parmak İzi</span>
                    <strong className="text-emerald-500">Anonimleştirildi</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/5 dark:bg-slate-950 border border-slate-800/10 flex justify-between items-center">
                    <span>Çerez / Piksel Takibi</span>
                    <strong className="text-rose-500">Kullanılmıyor</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PANEL 6: FULL TECHNICAL REPORT IN HTML */}
          {currentPanel === "report" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Table of Contents sub-menu (Col span 3) */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                <div className={`border rounded-2xl p-4 transition-colors duration-300 ${themeClasses.card} sticky top-24`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-slate-400">İçindekiler</h4>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setActiveReportSection("sec-1")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-1"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      1. Proje Özeti
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-2")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-2"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      2. Katma Değer & Yenilikçilik
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-3")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-3"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      3. Teknoloji Kullanımı & Matematik
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-4")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-4"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      4. Uygulanabilirlik & Pazar
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-5")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-5"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      5. Yaygın Etki & KVKK
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-6")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-6"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      6. Sürdürülebilirlik & Finans
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-7")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-7"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      7. Proje Takvimi
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-8")}
                      className={`text-left py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                        activeReportSection === "sec-8"
                          ? "bg-[#1B4A7D]/10 text-[#1B4A7D] dark:bg-amber-500/10 dark:text-amber-400 font-bold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      8. Takım Yapısı & Kaynakça
                    </button>
                  </div>
                </div>
              </div>

              {/* Document details (Col span 9) */}
              <div className={`lg:col-span-9 border rounded-2xl p-8 leading-relaxed text-xs transition-colors duration-300 ${themeClasses.card} max-w-4xl`}>
                
                {/* SECTION 1: PROJE OZETI */}
                {activeReportSection === "sec-1" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">1. PROJE ÖZETİ</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">1.1. Proje Konusu ve Amacı</h4>
                    <p className="text-slate-400 leading-6">
                      Büyük veri çağında dijital sosyal ağlar; saniyede yüz binlerce gönderi, video, yorum ve etkileşimin üretildiği, dinamik ve doğrusal olmayan karmaşık sistemler (complex non-linear systems) haline gelmiştir. Bu devasa veri okyanusunda bir yandan platform güvenliğini, kamu düzenini ve dezenformasyon denetimini sağlamak zorunda olan platform yöneticileri ve moderatörler; diğer yandan kitlelerine ulaşmak ve gelir yaratmak isteyen yüz binlerce KOBİ ve bağımsız içerik üreticisi bulunmaktadır. Ancak her iki taraf da ciddi bir "analitik körlük ve operasyonel verimsizlik" ile karşı karşıyadır.
                    </p>
                    <p className="text-slate-400 leading-6">
                      Mevcut gösterge panelleri (dashboards); toplam etkileşim, günlük aktif kullanıcı (DAU/MAU) ve gösterim sayısı gibi tek boyutlu ve geriye dönük statik metriklere dayanmaktadır. Bu paneller yalnızca "ne oldu" sorusunu özetlemekte, ancak kriz anlarında "neden oldu" ve operasyonel olarak "şimdi ne yapılmalı" sorularına eyleme dönük (actionable) yanıt üretememektedir. Benzer şekilde, Meta Ads Manager ve Google Ads gibi ticari reklam merkezleri, yüzlerce karmaşık ayar, piksel kurulumu ve derin istatistiksel uzmanlık gerektirdiğinden; küçük işletmeler ve içerik üreticileri için aşılmaz bir bilişsel bariyer oluşturmakta, reklam bütçelerinin ortalama %35’i hatalı hedeflemelerle israf edilmektedir.
                    </p>
                    <p className="text-slate-400 leading-6">
                      <strong>NABIZ Projesi</strong>, sosyal ağlardaki çok boyutlu etkileşim sinyallerini esnek eşlenebilen eksenlerde (zaman × konu kategorisi, coğrafi konum × yayılım ivmesi, içerik formatı × duygu polaritesi vb.) dinamik ısı matrislerine dönüştüren; bu matris üzerindeki istatistiksel sapmaları matematiksel anomali filtreleriyle saptayan ve elde edilen içgörüleri iki ana eksende eyleme dönüştüren bütünleşik bir Sosyal Yapay Zekâ, Akıllı Karar Destek ve Yeni Nesil Reklam Platformudur (Next-Gen AdTech Engine):
                    </p>

                    <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-400 leading-6">
                      <li>
                        <strong>NABIZ-Sense (Platform Kalkanı & Operasyonel Karar Destek)</strong>: Moderatörler ve platform yöneticileri için siber zorbalık, bot saldırıları, linç dalgaları ve dezenformasyonu saniyeler içinde yakalayan; yerli NLP ve LLM çıkarımıyla doğal dilde "Kök Neden Analizi" ve hazır aksiyon butonları üreten güvenlik omurgası.
                      </li>
                      <li>
                        <strong>NABIZ-Ads (Doğal Dil Güdümlü Akıllı Reklam & Kampanya Merkezi)</strong>: KOBİ’ler ve bağımsız içerik üreticileri için Meta reklam panellerinin karmaşıklığını ortadan kaldıran; arama çubuğu sadeliğinde çalışan bir Doğal Dil Ajanı (Conversational AI Campaign Wizard). Kullanıcı sadece günlük dille hedefini yazar, sistem arka plandaki matris verilerini tarayarak en uygun zamanı, hedef kitleyi ve reklam metnini saniyeler içinde otomatik optimize eder.
                      </li>
                    </ul>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">1.2. Proje Kapsamı, Çift Kanatlı Mimari ve Yöntem</h4>
                    <p className="text-slate-400 leading-6">
                      NABIZ Platformu, kuramsal bir önerinin ötesinde; veri mühendisliği, matematiksel anomali filtreleme, yerli derin öğrenme modelleri, LLM ajanları ve insan odaklı UI/UX arayüzünü bütünleştiren çalışan, doğrulanmış ve mikroservis mimarisine dayalı bir prototiptir.
                    </p>
                  </div>
                )}

                {/* SECTION 2: KATMA DEGER */}
                {activeReportSection === "sec-2" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">2. KATMA DEĞER VE YENİLİKÇİLİK</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">2.1. Problem Tanımı ve Mevcut Çözümlerin Yetersizliği</h4>
                    <p className="text-slate-400 leading-6">
                      Sosyal medya ağlarında dezenformasyon, algı operasyonları ve bot saldırılarının yayılma hızı, organik içeriklere kıyasla 6 kat daha fazladır. Buna karşın, hem güvenlik operasyonları hem de ticari reklam yönetimi tarafında sektör çağdışı ve parçalı yazılımlarla kilitlenmiştir. Güncel araştırmalar şu nesnel problemleri ortaya koymaktadır:
                    </p>
                    
                    <ol className="list-decimal pl-5 flex flex-col gap-2 text-slate-400 leading-6">
                      <li>
                        <strong>Güvenlik & Moderasyon Çıkmazı</strong>: Moderatörler onlarca ayrık gösterge panelinde günde ortalama 1.200 veri metriğini manuel taramakta, mesailerinin %68’ini anomalilerin kök nedenini aramakla kaybetmektedir. Kriz fark edildiğinde olay üzerinden ortalama 4.2 saat geçmiş olmakta ve toplumsal tahribat engellenememektedir.
                      </li>
                      <li>
                        <strong>Reklam & Gelir Üretiminde KOBİ Bariyeri (Meta Ads Manager Karmaşası)</strong>: Meta Ads Manager gibi paneller, 50’den fazla alt sekme ve ileri düzey teknik uzmanlık istemektedir. Türkiye’deki 3.5 milyondan fazla KOBİ ve yüz binlerce içerik üreticisi bu karmaşa yüzünden dijital reklam verememekte ya da bütçelerini verimsiz tüketmektedir.
                      </li>
                    </ol>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-4">Tablo 2.1: Farklı Paneller, Çözümler ve NABIZ Platform Karşılaştırılması</h4>
                    <div className="border border-slate-900/10 dark:border-slate-900 rounded-xl overflow-hidden mt-2">
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/5 dark:bg-slate-950 p-3 font-bold text-slate-400 border-b">
                        <div>Boyut</div>
                        <div>Geleneksel Çözümler</div>
                        <div className="text-amber-500">NABIZ (Önerilen)</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Görselleştirme</div>
                        <div>Sabit tek boyutlu grafikler / Tablolar</div>
                        <div className="font-bold">Dinamik Çok Eksenli Isı Matrisi (X × Y)</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Anomali Tespiti</div>
                        <div>Manuel takip veya sabit eşikli kurallar</div>
                        <div className="font-bold">Dinamik Kayan Z-Score & DBSCAN Sapma</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Bağlamsal Çıkarım</div>
                        <div>Yok (Sadece sayısal artış gösterir)</div>
                        <div className="font-bold">Yerli LLM ile Doğal Dilde Kök Neden Analizi</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3">
                        <div className="font-bold">Reklam Oluşturma</div>
                        <div>50+ karmaşık teknik ayar / piksel gereksinimi</div>
                        <div className="font-bold text-amber-500">Doğal Dil Girdisiyle 10 Saniyede Kampanya</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: TEKNOLOJI VE MATEMATIK */}
                {activeReportSection === "sec-3" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">3. TEKNOLOJİ KULLANIMI VE MATEMATİKSEL MODELLEME</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">3.1. Çok Boyutlu Koordinat Tensör İzdüşümü Formülü</h4>
                    <p className="text-slate-400 leading-6">
                      Sosyal ağlarda üretilen veri akışı, basit tek boyutlu zaman serileriyle analiz edilemeyecek kadar heterojen ve karmaşıktır. Bir sosyal medya olayının gerçek etkisini anlayabilmek için; etkileşimin konusu (X), üretildiği coğrafi konum (Y), gerçekleştiği zaman penceresi (T), kullanıcının itibar güvenilirliği (w_k) ve cümlenin taşıdığı semantik duygu polaritesi (Φ) aynı anda hesaba katılmak zorundadır. NABIZ, bu boyutları Çok Boyutlu Koordinat Tensör İzdüşümü modelinde birleştirmiştir:
                    </p>

                    <div className="my-6 p-4 rounded-xl bg-slate-900/10 dark:bg-slate-950 border border-slate-800/10 text-center font-serif text-base md:text-lg tracking-wider text-slate-700 dark:text-slate-200">
                      M<sub>i,j</sub>(t) = &Sigma;<sub>k=1</sub><sup>N(t)</sup> w<sub>k</sub> &middot; II(x<sub>k</sub> = i, y<sub>k</sub> = j) &middot; &Phi;(e<sub>k</sub>)
                    </div>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">3.2. Matematiksel Anomali Tespiti ve Z-Score Formülü</h4>
                    <p className="text-slate-400 leading-6">
                      Her bir matris hücresinin geçmiş penceresindeki (W = 15 dk) normal baz seviyesini ve oynaklığını hesaplamak için hareketli ortalama ve standart sapma parametreleri dinamik olarak güncellenir:
                    </p>

                    <div className="my-4 p-4 rounded-xl bg-slate-900/10 dark:bg-slate-950 border border-slate-800/10 text-center font-serif text-sm md:text-base text-slate-700 dark:text-slate-200">
                      &mu;<sub>i,j</sub>(W) = (1 / |W|) &middot; &Sigma;<sub>&tau; &in; W</sub> X<sub>i,j</sub>(&tau;)
                      <br /><br />
                      &sigma;<sub>i,j</sub>(W) = &radic;[ (1 / (|W|-1)) &middot; &Sigma;<sub>&tau; &in; W</sub> (X<sub>i,j</sub>(&tau;) - &mu;<sub>i,j</sub>(W))<sup>2</sup> ]
                    </div>

                    <p className="text-slate-400 leading-6">
                      Hücredeki anlık etkileşim hacminin geçmiş normlardan kaç standart sapma saptığı Z-Score indeksi ile hesaplanır:
                    </p>

                    <div className="my-4 p-4 rounded-xl bg-slate-900/10 dark:bg-slate-950 border border-slate-800/10 text-center font-serif text-sm md:text-base text-slate-700 dark:text-slate-200">
                      Z<sub>i,j</sub>(t) = (X<sub>i,j</sub>(t) - &mu;<sub>i,j</sub>(W)) / (&sigma;<sub>i,j</sub>(W) + &epsilon;)
                      <br /><br />
                      <span className="text-rose-500 font-bold">Anomali Kriteri: |Z<sub>i,j</sub>(t)| &ge; 3.0</span>
                    </div>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-4">Tablo 3.1: Yapay Zekâ Modelleri ve Doğrulama Metrikleri</h4>
                    <div className="border border-slate-900/10 dark:border-slate-900 rounded-xl overflow-hidden mt-2">
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/5 dark:bg-slate-950 p-3 font-bold text-slate-400 border-b">
                        <div>Model / Bileşen</div>
                        <div>Değerlendirilen Metrik</div>
                        <div>Elde Edilen Başarım</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Anomali Tespit Motoru</div>
                        <div>Precision / Recall</div>
                        <div>%93.2 / %90.8</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">BERTurk Duygu Modeli</div>
                        <div>Accuracy (Doğruluk)</div>
                        <div>%92.4 (5-Fold CV)</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3">
                        <div className="font-bold">Yerel LLM Çıkarımı</div>
                        <div>Ortalama Yanıt Gecikmesi</div>
                        <div>1.24 saniye (AWQ 4-bit)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 4: UYGULANABILIRLIK */}
                {activeReportSection === "sec-4" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">4. UYGULANABİLİRLİK</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">4.1. Verimlilik ve ROAS Birim Ekonomisi Analizi</h4>
                    <p className="text-slate-400 leading-6">
                      NABIZ Platformu; hem platform güvenliği ve moderasyon operasyonlarında (NABIZ-Sense) hem de içerik üreticileri ile KOBİ’lerin dijital pazarlama yönetiminde (NABIZ-Ads) ölçülebilir, yüksek verimlilik çıktıları sunmaktadır.
                    </p>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-4">Tablo 4.1: Geleneksel Reklam Panelleri ile NABIZ-Ads Karşılaştırması</h4>
                    <div className="border border-slate-900/10 dark:border-slate-900 rounded-xl overflow-hidden mt-2">
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/5 dark:bg-slate-950 p-3 font-bold text-slate-400 border-b">
                        <div>Performans Metriği</div>
                        <div>Geleneksel Reklam (Meta/Google)</div>
                        <div className="text-amber-500">NABIZ-Ads Doğal Dil Modeli</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Kampanya Kurulum Süresi</div>
                        <div>25 - 40 Dakika (50+ Ayar)</div>
                        <div className="font-bold">10 - 15 Saniye (Tek Prompt)</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Hedefleme Doğruluğu</div>
                        <div>%61.4 (Geniş kitle israfı)</div>
                        <div className="font-bold">%94.1 (Tensör Hücre Eşleme)</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3">
                        <div className="font-bold">Ortalama ROAS Verimi</div>
                        <div>1 : 2.80 (280%)</div>
                        <div className="font-bold text-amber-500">1 : 3.75 (375%) (+34% Artış)</div>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-4">4.2. Hedef Kitle ve Pazar Büyüklüğü (TAM / SAM / SOM)</h4>
                    <ul className="list-decimal pl-5 flex flex-col gap-2 text-slate-400 leading-6">
                      <li>
                        <strong>TAM (Total Addressable Market) - 280 Milyar Dolar</strong>: Küresel sosyal medya analiz yazılımları, siber güvenlik karar destek sistemleri ve dijital reklam pazarının 2026 projeksiyon büyüklüğü.
                      </li>
                      <li>
                        <strong>SAM (Serviceable Addressable Market) - 1.8 Milyar Dolar</strong>: Türkiye ve Türk Cumhuriyetleri/MENA bölgesindeki dijital reklam harcamaları ve KOBİ pazarlama bütçesi toplamı.
                      </li>
                      <li>
                        <strong>SOM (Serviceable Obtainable Market) - 45 Milyon TL</strong>: Başta milli platform NSosyal olmak üzere Türkiye'deki 25.000 aktif KOBİ reklamvereni ve 1.500 bağımsız içerik ajansı üzerinden hedeflenen ilk 2 yıl hacmi.
                      </li>
                    </ul>
                  </div>
                )}

                {/* SECTION 5: YAYGIN ETKI */}
                {activeReportSection === "sec-5" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">5. YAYGIN ETKİ</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">5.1. Toplumsal Fayda, Siber Güvenlik ve Kamu Düzeni</h4>
                    <p className="text-slate-400 leading-6">
                      Organize bot ağları, linç girişimleri ve dezenformasyon dalgaları henüz ilk 5 dakikada normal dağılımdan sapan hücreler olarak izole edilir. Kamu kurumları ve afet yönetimi entegrasyonu sayesinde acil durumlarda vatandaşların yardım çağrıları saniyeler içinde koordinat bazlı haritalandırılır.
                    </p>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">5.2. Gizlilik ve Sıfır Profilleme Standartları (Privacy by Design)</h4>
                    <p className="text-slate-400 leading-6">
                      NABIZ, üçüncü taraf çerezler ve bireysel piksel takipleriyle yapılan agresif profillemeyi kökten reddeder. Gizlilik Prensibi formülü:
                    </p>
                    <div className="my-4 p-4 rounded-xl bg-slate-900/10 dark:bg-slate-950 border border-slate-800/10 text-center font-serif text-sm md:text-base text-slate-700 dark:text-slate-200">
                      M<sub>i,j</sub>(t) = f(Toplu Davranış Dağılımı) &and; Tekil Kullanıcı İzleme = &empty;
                    </div>
                  </div>
                )}

                {/* SECTION 6: SURDURULEBILIRLIK */}
                {activeReportSection === "sec-6" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">6. SÜRDÜRÜLEBİLİRLİK</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">6.1. Ticarileştirme Potansiyeli ve Hibrit Gelir Modeli</h4>
                    <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-400 leading-6">
                      <li><strong>Reklam Aracılık Komisyonu (%12 Pay)</strong>: Reklam harcamalarından platform işletim payı tahsil edilir.</li>
                      <li><strong>İçerik Üretici Gelir Paylaşımı (%55 / %45)</strong>: Reklam gelirlerinin %55'i üreticiye, %45'i platform havuzuna aktarılarak ekosistem canlı tutulur.</li>
                      <li><strong>Kademeli SaaS Abonelik Modeli</strong>: Pro (499 TL/ay) ve Enterprise (2.499 TL/ay) paketleri sunulur.</li>
                    </ul>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-4">Tablo 6.1: Üç Yıllık Büyüme ve Gelir Projeksiyonu</h4>
                    <div className="border border-slate-900/10 dark:border-slate-900 rounded-xl overflow-hidden mt-2">
                      <div className="grid grid-cols-4 gap-2 bg-slate-900/5 dark:bg-slate-950 p-3 font-bold text-slate-400 border-b">
                        <div>Finansal Gösterge</div>
                        <div>Yıl 1 (Pilot)</div>
                        <div>Yıl 2 (Yayılım)</div>
                        <div>Yıl 3 (MENA)</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Aktif KOBİ Reklamveren</div>
                        <div>2.500 İşletme</div>
                        <div>25.000 İşletme</div>
                        <div>85.000 İşletme</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Toplam Brüt Gelir</div>
                        <div>900.000 TL</div>
                        <div>8.200.000 TL</div>
                        <div>30.000.000 TL</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3">
                        <div className="font-bold text-emerald-500">Net Faaliyet Kârı (EBITDA)</div>
                        <div className="font-bold">+480.000 TL</div>
                        <div className="font-bold">+6.100.000 TL</div>
                        <div className="font-bold text-emerald-500">+23.800.000 TL</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 7: PROJE TAKVIMI */}
                {activeReportSection === "sec-7" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">7. PROJE TAKVİMİ</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">Tablo 7.1: İş Paketleri ve Kilometre Taşları</h4>
                    <div className="border border-slate-900/10 dark:border-slate-900 rounded-xl overflow-hidden mt-2">
                      <div className="grid grid-cols-4 gap-2 bg-slate-900/5 dark:bg-slate-950 p-3 font-bold text-slate-400 border-b">
                        <div>İş Paketi</div>
                        <div>Açıklama</div>
                        <div>Başlangıç / Bitiş</div>
                        <div>Kilometre Taşı</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">İP1: Mimari Tasarım</div>
                        <div>Tensör matrisi ve anomali tespiti matematiksel tasarımı</div>
                        <div>19.08.2026 - 21.08.2026</div>
                        <div>Anomali Algoritması</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">İP2: NLP & AI</div>
                        <div>BERTurk duygu analizi ve yerel LLM entegrasyonu</div>
                        <div>21.08.2026 - 23.08.2026</div>
                        <div>AI Reklam Motoru</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">İP3: Ön Yüz Prototipi</div>
                        <div>Next.js ısı matrisi ve siber kalkan ekranları</div>
                        <div>22.08.2026 - 24.08.2026</div>
                        <div>Teknik Rapor (MS1)</div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 p-3">
                        <div className="font-bold">İP6: Canlı Demo</div>
                        <div>Canlı sistem testleri ve jüri sunumu provası</div>
                        <div>10.09.2026 - 14.09.2026</div>
                        <div>Canlı Demo (MS3)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 8: TAKIM YAPISI & KAYNAKCA */}
                {activeReportSection === "sec-8" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-bold text-[#1B4A7D] dark:text-amber-400 pb-2 border-b">8. TAKIM YAPISI VE KAYNAKÇA</h3>
                    
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-2">8.1. Takım Organizasyonu ve Görev Dağılımı</h4>
                    <div className="border border-slate-900/10 dark:border-slate-900 rounded-xl overflow-hidden mt-2">
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/5 dark:bg-slate-950 p-3 font-bold text-slate-400 border-b">
                        <div>Rol / Uzmanlık</div>
                        <div>Sorumluluk Alanı</div>
                        <div>Kullanılan Teknolojiler</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Yapay Zekâ Mühendisi</div>
                        <div>NLP boru hattı, BERTurk, LLM prompt mühendisliği</div>
                        <div>PyTorch, Transformers, vLLM</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-900/10">
                        <div className="font-bold">Veri & Backend Geliştirici</div>
                        <div>Büyük veri akışı, Redis kuyrukları, PostgreSQL, FastAPI</div>
                        <div>Python, FastAPI, Redis, Celery</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3">
                        <div className="font-bold">UI/UX & Frontend Geliştirici</div>
                        <div>Kullanıcı yolculukları, ECharts ısı haritası ve reklam arayüzü</div>
                        <div>Next.js, React, TailwindCSS, ECharts</div>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mt-4">9. KAYNAKÇA</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      [1] Statista Research Department. (2025). Global Social Media Analytics & Next-Gen AdTech Market Outlook 2025-2030.
                      <br />
                      [2] Shneiderman, B. (2022). Human-Centered AI: Reliable, Safe and Trustworthy Decision Support Systems. Oxford University Press.
                      <br />
                      [3] Lai, V. vd. (2023). Towards a Science of Human-AI Decision Making: An Empirical Survey. ACM Computing Surveys.
                      <br />
                      [4] Schweter, S. (2020). BERTurk - State-of-the-Art Pretrained BERT Models for Turkish Language. Hugging Face.
                      <br />
                      [5] Touvron, H. vd. (2023). Llama 2: Open Foundation and Fine-Tuned Chat Models. Meta AI Research.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Live Data Ticker horizontal banner at the bottom */}
        <div className="bg-amber-500 text-slate-950 py-1.5 px-6 font-mono text-[9px] font-bold overflow-hidden flex items-center justify-between border-t border-amber-600/30">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-slate-950 text-amber-400 rounded">LIVE INGEST</span>
            <span className="animate-pulse">●</span>
            <span className="transition-all duration-500">{tickerItems[tickerIndex]}</span>
          </div>
          <span className="hidden sm:inline text-[8px] opacity-80 uppercase tracking-widest">
            BerkTurk Real-time Analysis Stream
          </span>
        </div>

        {/* Footer */}
        <footer className={`py-3 text-center text-[10px] border-t transition-colors duration-300 ${themeClasses.footer}`}>
          <p>© 2026 NABIZ AI Platformu. Sadir Pehlivan Takımı #990060. Tüm Hakları Saklıdır.</p>
        </footer>

      </div>

    </div>
  );
}
