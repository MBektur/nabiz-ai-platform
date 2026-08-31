"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  Bell,
  Calculator,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Database,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Globe,
  Info,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquare,
  Moon,
  MousePointer,
  Play,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

// Types
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
  [row: string]: {
    [col: string]: CellData;
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

// 3 Dimension Matrix Presets matching Chapter 1.1 & 3.1 of Technical Report
const getCityTopicMatrix = (): Matrix => ({
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

const getAgeFormatMatrix = (): Matrix => ({
  "13-17 Yaş": {
    "Reels": { volume: 195, mean: 120, std: 15, zScore: 5.0, sentiment: 0.65, isAnomaly: false, isOpportunity: true, details: "Genç kitlede kısa video formatında viral büyüme tespit edildi." },
    "Canlı Yayın": { volume: 45, mean: 40, std: 5, zScore: 1.0, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "Metin": { volume: 12, mean: 20, std: 3, zScore: -2.6, sentiment: -0.1, isAnomaly: false, isOpportunity: false },
    "Carousel": { volume: 35, mean: 30, std: 4, zScore: 1.25, sentiment: 0.3, isAnomaly: false, isOpportunity: false },
    "Hikaye": { volume: 140, mean: 130, std: 10, zScore: 1.0, sentiment: 0.4, isAnomaly: false, isOpportunity: false },
  },
  "18-24 Yaş": {
    "Reels": { volume: 240, mean: 180, std: 20, zScore: 3.0, sentiment: 0.82, isAnomaly: false, isOpportunity: true, details: "Kültür ve teknoloji reklamları için en yüksek dönüşüm sağlayan segment." },
    "Canlı Yayın": { volume: 85, mean: 80, std: 8, zScore: 0.62, sentiment: 0.4, isAnomaly: false, isOpportunity: false },
    "Metin": { volume: 28, mean: 30, std: 4, zScore: -0.5, sentiment: 0.0, isAnomaly: false, isOpportunity: false },
    "Carousel": { volume: 95, mean: 85, std: 10, zScore: 1.0, sentiment: 0.5, isAnomaly: false, isOpportunity: false },
    "Hikaye": { volume: 160, mean: 150, std: 12, zScore: 0.83, sentiment: 0.3, isAnomaly: false, isOpportunity: false },
  },
  "25-34 Yaş": {
    "Reels": { volume: 150, mean: 140, std: 12, zScore: 0.83, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "Canlı Yayın": { volume: 60, mean: 55, std: 6, zScore: 0.83, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "Metin": { volume: 90, mean: 80, std: 8, zScore: 1.25, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "Carousel": { volume: 110, mean: 100, std: 9, zScore: 1.11, sentiment: 0.4, isAnomaly: false, isOpportunity: false },
    "Hikaye": { volume: 120, mean: 115, std: 8, zScore: 0.62, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
  },
  "35-44 Yaş": {
    "Reels": { volume: 75, mean: 70, std: 7, zScore: 0.71, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "Canlı Yayın": { volume: 30, mean: 30, std: 3, zScore: 0.0, sentiment: 0.0, isAnomaly: false, isOpportunity: false },
    "Metin": { volume: 115, mean: 110, std: 10, zScore: 0.5, sentiment: -0.1, isAnomaly: false, isOpportunity: false },
    "Carousel": { volume: 80, mean: 75, std: 6, zScore: 0.83, sentiment: 0.2, isAnomaly: false, isOpportunity: false },
    "Hikaye": { volume: 65, mean: 60, std: 5, zScore: 1.0, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
  },
  "45+ Yaş": {
    "Reels": { volume: 40, mean: 40, std: 4, zScore: 0.0, sentiment: 0.0, isAnomaly: false, isOpportunity: false },
    "Canlı Yayın": { volume: 20, mean: 20, std: 2, zScore: 0.0, sentiment: 0.0, isAnomaly: false, isOpportunity: false },
    "Metin": { volume: 140, mean: 50, std: 8, zScore: 11.25, sentiment: -0.85, isAnomaly: true, isOpportunity: false, details: "Dezenformasyon ve kriz içeriklerinin metin formatında yoğunlaştığı saptandı." },
    "Carousel": { volume: 35, mean: 35, std: 3, zScore: 0.0, sentiment: 0.1, isAnomaly: false, isOpportunity: false },
    "Hikaye": { volume: 30, mean: 30, std: 3, zScore: 0.0, sentiment: 0.0, isAnomaly: false, isOpportunity: false },
  },
});

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentPanel, setCurrentPanel] = useState<"dashboard" | "ads" | "sense" | "analytics" | "privacy" | "report">("dashboard");
  const [activeWing, setActiveWing] = useState<"all" | "sense" | "ads">("all");
  const [activeAxisDimension, setActiveAxisDimension] = useState<"city_topic" | "age_format">("city_topic");
  const [activeReportSection, setActiveReportSection] = useState<string>("sec-1");
  
  // Matrix state
  const [cityMatrix, setCityMatrix] = useState<Matrix>(getCityTopicMatrix());
  const [ageMatrix, setAgeMatrix] = useState<Matrix>(getAgeFormatMatrix());
  const [selectedCell, setSelectedCell] = useState<{ row: string; col: string }>({
    row: "İzmir",
    col: "#Ulaşım",
  });

  // Interactive Financial Calculator State
  const [financialSmeCount, setFinancialSmeCount] = useState<number>(25000);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "alert" } | null>(null);

  // Time-series hover data state
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; vol1: string; vol2: string } | null>(null);

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

  // Analytics KPI metrics
  const [totalSignalCount, setTotalSignalCount] = useState("24.68M");
  const [anomalyCount, setAnomalyCount] = useState("312.47K");
  const [sentimentIndex, setSentimentIndex] = useState(0.42);
  const [optimizedRoas, setOptimizedRoas] = useState("3.85x");
  const [botBlockedCount, setBotBlockedCount] = useState(51810);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] NABIZ Core Tensör Motoru aktif. (Pencere: 15 dakika)",
    "[DBSCAN] Yoğunluk analizi devrede. Bot algılama w_k eşikleri yüklendi.",
    "[ANOMALİ] İzmir × #Ulaşım hücresinde sapma saptandı (Z = +3.92, Duygu: -0.78)",
    "[FIRSAT] İstanbul × #Kültür hücresinde trend saptandı (Z = +4.30, Duygu: +0.85)",
  ]);

  const showToast = (message: string, type: "success" | "info" | "alert" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time animation loop
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
    }, 400);

    return () => clearInterval(waveInterval);
  }, [alerts]);

  // Handle simulations
  const triggerIzmirCrisis = () => {
    const updated = getCityTopicMatrix();
    updated["İzmir"]["#Ulaşım"] = {
      volume: 245,
      mean: 32,
      std: 4,
      zScore: 5.12,
      sentiment: -0.92,
      isAnomaly: true,
      isOpportunity: false,
    };
    setCityMatrix(updated);
    
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
    setSelectedCell({ row: "İzmir", col: "#Ulaşım" });
    setAnomalyCount("428.10K");
    setSentimentIndex(-0.15);
    
    setLogs(prev => [
      `[ALERT] KRİTİK SEVİYE: İzmir × #Ulaşım Z-Score ${newAlert.zScore}'e yükseldi!`,
      `[NLP] BERTurk duygu polaritesi: ${newAlert.sentiment} (Aşırı Negatif)`,
      `[SENSE] Otomatik kök neden teşhisi üretildi. Müdahale için moderatör onayı bekleniyor.`,
      ...prev,
    ]);

    showToast("🚦 İzmir Ulaşım Krizi Tetiklendi! (Z = +5.12, Aşırı Negatif)", "alert");
  };

  const triggerKadikoyOpportunity = () => {
    const updated = getCityTopicMatrix();
    updated["İstanbul"]["#Kültür"] = {
      volume: 185,
      mean: 45,
      std: 10,
      zScore: 6.20,
      sentiment: 0.95,
      isAnomaly: false,
      isOpportunity: true,
    };
    setCityMatrix(updated);
    setSelectedCell({ row: "İstanbul", col: "#Kültür" });
    setSentimentIndex(0.68);
    setOptimizedRoas("4.15x");
    
    setLogs(prev => [
      `[TREND] İstanbul × #Kültür Z-Score 6.2'ye yükseldi!`,
      `[ROAS] Yapay zeka reklam fırsat optimizasyonu aktif. Potansiyel ROAS: +45%`,
      `[ADS] Kadıköy bölgesi için hazır reklam taslakları optimize edildi.`,
      ...prev,
    ]);
    
    setPromptInput("Kadıköy'deki butik kahvecimiz için Reels reklamı yap");
    setCurrentPanel("ads");
    showToast("🎯 Kadıköy Kahve Trendi Fırsatı Açıldı! (+%34 ROAS)", "success");
  };

  const triggerBursaBotAttack = () => {
    const updated = getCityTopicMatrix();
    updated["Bursa"]["#Ekonomi"] = {
      volume: 310,
      mean: 30,
      std: 3,
      zScore: 9.30,
      sentiment: 0.0,
      isAnomaly: false,
      isOpportunity: false,
    };
    setCityMatrix(updated);
    setSelectedCell({ row: "Bursa", col: "#Ekonomi" });
    setBotBlockedCount(prev => prev + 280);
    
    setLogs(prev => [
      `[DBSCAN] Bot Saldırısı Engellendi! Bursa × #Ekonomi hücresinde 280 adet şüpheli hesap elendi (Kullanıcı itibar w_k < 0.1).`,
      `[SYSTEM] Z-score düzeltildi ve anomali uyarısı üretilmedi. (Filtreleme Başarısı: %100)`,
      `[PRIVACY] KVKK uyum boru hattı: şüpheli hesapların IP ve cihaz parmak izleri anonim olarak loglandı.`,
      ...prev,
    ]);

    showToast("🤖 Bursa Bot Saldırısı DBSCAN ile İzolasyona Alındı!", "info");
  };

  const resetAll = () => {
    setCityMatrix(getCityTopicMatrix());
    setAgeMatrix(getAgeFormatMatrix());
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
    setSelectedCell({ row: "İzmir", col: "#Ulaşım" });
    setTotalSignalCount("24.68M");
    setAnomalyCount("312.47K");
    setSentimentIndex(0.42);
    setOptimizedRoas("3.85x");
    setLogs([
      "[SYSTEM] Sistem normal değerlerine döndürüldü.",
      "[SYSTEM] NABIZ Core Tensör Motoru aktif. (Pencere: 15 dakika)",
    ]);
    showToast("🔄 Sistem Başarıyla Sıfırlandı.", "info");
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
    showToast(`✅ "${action}" aksiyonu 32 saniyede devreye alındı!`, "success");
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

    showToast("✨ AI Reklam Taslağı ve Hedef Kitle Eşlendi!", "success");
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
    showToast("🚀 Kampanya 12 Saniyede Canlıya Alındı! (ROAS 3.86x)", "success");
  };

  const handleQuickPrompt = (txt: string) => {
    setPromptInput(txt);
  };

  // Active matrix selection
  const activeMatrix = activeAxisDimension === "city_topic" ? cityMatrix : ageMatrix;
  const activeCellData = (activeMatrix[selectedCell.row] && activeMatrix[selectedCell.row][selectedCell.col])
    ? activeMatrix[selectedCell.row][selectedCell.col]
    : { volume: 100, mean: 90, std: 10, zScore: 1.0, sentiment: 0.0, isAnomaly: false, isOpportunity: false, details: "Seçili hücre norm sınırları içindedir." };

  return (
    <div className={`h-screen flex flex-col lg:flex-row font-sans selection:bg-orange-500 selection:text-white overflow-hidden ${
      theme === "light" ? "bg-[#f8fafc] text-slate-900" : "bg-[#071317] text-slate-100"
    }`}>
      
      {/* TOAST NOTIFICATION OVERLAY */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce transition-all ${
          toast.type === "alert"
            ? "bg-rose-600 text-white border-rose-500"
            : toast.type === "info"
            ? "bg-teal-600 text-white border-teal-500"
            : "bg-[#0a1e22] text-teal-300 border-teal-600"
        }`}>
          {toast.type === "alert" ? <AlertTriangle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
          <span className="text-xs font-bold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-80 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ADNEX-STYLE ULTRA-PREMIUM SIDEBAR (Pinned h-screen) */}
      <aside className="w-full lg:w-68 lg:h-screen bg-[#0a1e22] text-slate-300 flex flex-col p-5 shrink-0 justify-between border-r border-[#133e42]/50 overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Activity className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">NABIZ</h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500 text-white uppercase tracking-wider">AI</span>
              </div>
              <span className="text-[10px] text-teal-400/80 font-semibold block uppercase tracking-wider">
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
                  ? "bg-[#16383e] text-teal-300 shadow-inner"
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
                  ? "bg-[#16383e] text-teal-300 shadow-inner"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <Rocket className={`h-4.5 w-4.5 ${currentPanel === "ads" ? "text-orange-400" : "text-slate-400"}`} />
              NABIZ-Ads Kampanyalar
            </button>

            <button
              onClick={() => { setCurrentPanel("sense"); setActiveWing("sense"); }}
              className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "sense"
                  ? "bg-[#16383e] text-teal-300 shadow-inner"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <Shield className={`h-4.5 w-4.5 ${currentPanel === "sense" ? "text-rose-400" : "text-slate-400"}`} />
              NABIZ-Sense Kalkanı
            </button>

            <button
              onClick={() => { setCurrentPanel("analytics"); }}
              className={`w-full py-3 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "analytics"
                  ? "bg-[#16383e] text-teal-300 shadow-inner"
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
                  ? "bg-[#16383e] text-teal-300 shadow-inner"
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
                  ? "bg-[#16383e] text-teal-300 shadow-inner"
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
          <div className="bg-[#102d33] border border-[#1b4d57]/60 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Milli Çift Kanatlı AdTech</h4>
                <span className="text-[10px] text-teal-300/80">TEKNOFEST 2026</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Z-Score ve DBSCAN filtreleri ile +%34 ROAS ve 32 saniyede kriz müdahalesi devrede.
            </p>
            <button
              onClick={triggerIzmirCrisis}
              className="w-full py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Play className="h-3 w-3 fill-current" /> İzmir Krizini Simüle Et
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0e272c] border border-[#16383e]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs text-white">
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

      {/* MAIN CONTENT AREA (Scrollable independently) */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className={`px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b shrink-0 ${
          theme === "light" ? "bg-white border-slate-200/80" : "bg-[#0b1d22] border-slate-800"
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight">Hoş Geldiniz, Sadir Pehlivan Takımı!</h2>
              <span className="text-xl">👋</span>
            </div>
            <p className={`text-xs font-medium mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              NSosyal Çok Eksenli Tensör ve Anomali Karar Destek Platformu Canlı Panosu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
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
                <Shield className="h-3 w-3" /> Kanat 1: Sense (Kalkan)
              </button>
              <button
                onClick={() => { setActiveWing("ads"); setCurrentPanel("ads"); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeWing === "ads" ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Rocket className="h-3 w-3" /> Kanat 2: Ads (Reklam)
              </button>
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                theme === "light" ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[#0f282e] border-slate-700 text-amber-400 hover:bg-[#15343c]"
              }`}
              title={theme === "light" ? "Karanlık Moda Geç" : "Aydınlık Moda Geç"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setCurrentPanel("report")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a1e22] hover:bg-[#133e42] text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Raporu İncele</span>
            </button>
          </div>
        </header>

        {/* SYSTEM USABILITY & OPERATIONAL BENCHMARK BANNER */}
        <div className={`px-8 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 text-xs shrink-0 ${
          theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#0d2227] border-slate-800"
        }`}>
          <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            <Award className="h-4 w-4 text-orange-500" />
            Doğrulanmış Rapor Başarım Metrikleri:
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sense Moderasyon SUS:</span>
              <strong className="text-teal-600 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full font-mono">86.4 / 100 (A+)</strong>
              <span className="text-[11px] text-slate-500">(4.2 saat → 32 sn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ads Reklamveren SUS:</span>
              <strong className="text-orange-600 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full font-mono">91.2 / 100 (A+)</strong>
              <span className="text-[11px] text-slate-500">(35 dk → 12 sn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">ROAS Verim Artışı:</span>
              <strong className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">+%34 (1:3.75x)</strong>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
          
          {/* 4 TOP KPI SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* KPI 1: Total Sinyal */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#0a1e22] text-teal-400 flex items-center justify-center">
                  <Eye className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                  ↑ 18.6%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Toplam Sinyal Hacmi</span>
                <span className="text-2xl font-black tracking-tight font-mono">{totalSignalCount}</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 18.6% vs son 15 dk</span>
              </div>
            </div>

            {/* KPI 2: Anomali & Kriz */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <MousePointer className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                  ↑ 22.4%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Saptanan Anomali & Kriz</span>
                <span className="text-2xl font-black tracking-tight font-mono">{anomalyCount}</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 22.4% vs baz çizgi</span>
              </div>
            </div>

            {/* KPI 3: Ortalama Duygu */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#0f2b2f] text-emerald-400 flex items-center justify-center">
                  <Activity className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                  ↑ 6.3%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Ortalama Semantik Duygu</span>
                <span className={`text-2xl font-black tracking-tight font-mono ${sentimentIndex < 0 ? "text-rose-500" : "text-emerald-600"}`}>
                  {sentimentIndex >= 0 ? "+" : ""}{sentimentIndex.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 6.3% vs son 1 saat</span>
              </div>
            </div>

            {/* KPI 4: Optimize Edilen ROAS */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
                  <Award className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                  +34%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Optimize Edilmiş ROAS</span>
                <span className="text-2xl font-black tracking-tight text-orange-600 font-mono">{optimizedRoas}</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">↓ 4.8% Reklam İsraf Azalımı</span>
              </div>
            </div>

          </div>

          {/* VIEW 1: OVERVIEW / DASHBOARD */}
          {currentPanel === "dashboard" && (
            <>
              {/* 3 FOCUS HIGHLIGHT CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Channel Card 1: İzmir Ulaşım */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <h4 className="font-bold text-sm">İzmir Ulaşım Odağı</h4>
                      </div>
                      <button onClick={triggerIzmirCrisis} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer">
                        Krizi Tetikle →
                      </button>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs text-slate-400 font-bold block">İncelenen Sinyal</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tight font-mono">12.45M</span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">↑ 19.3%</span>
                      </div>
                    </div>

                    {/* Smooth SVG Spline Sparkline */}
                    <div className="h-20 w-full my-2">
                      <svg className="w-full h-full text-teal-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path
                          d="M 0 30 Q 15 15, 30 25 T 60 18 T 85 10 T 100 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="85" cy="10" r="3" fill="currentColor" />
                      </svg>
                    </div>

                    {/* 3 Sub-metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Hacim</span>
                        <strong className="font-bold font-mono">162.45K</strong>
                        <span className="text-[9px] text-emerald-600 block font-mono">↑ 21.1%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Z-Score</span>
                        <strong className="font-bold text-rose-500 font-mono">+3.92 (Kriz)</strong>
                        <span className="text-[9px] text-rose-500 block">3σ Norm Dışı</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Müdahale</span>
                        <strong className="font-bold text-teal-600 font-mono">32 Saniye</strong>
                        <span className="text-[9px] text-emerald-600 block">Otomatik</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Öncelikli Aksiyon</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">Topluluk Bildirimi Çık</span>
                  </div>
                </div>

                {/* Channel Card 2: Kadıköy Trendi */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                          <Flame className="h-4 w-4" />
                        </div>
                        <h4 className="font-bold text-sm">Kadıköy Kahve Trendi</h4>
                      </div>
                      <button onClick={triggerKadikoyOpportunity} className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer">
                        Fırsatı Aç →
                      </button>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs text-slate-400 font-bold block">İncelenen Sinyal</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tight font-mono">7.83M</span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">↑ 16.8%</span>
                      </div>
                    </div>

                    {/* Smooth SVG Spline Sparkline */}
                    <div className="h-20 w-full my-2">
                      <svg className="w-full h-full text-orange-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path
                          d="M 0 25 Q 20 35, 40 22 T 70 12 T 90 20 T 100 15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="70" cy="12" r="3" fill="currentColor" />
                      </svg>
                    </div>

                    {/* 3 Sub-metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Trend Hacmi</span>
                        <strong className="font-bold font-mono">98.21K</strong>
                        <span className="text-[9px] text-emerald-600 block font-mono">↑ 20.7%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ROAS Artışı</span>
                        <strong className="font-bold text-orange-600 font-mono">+%34</strong>
                        <span className="text-[9px] text-emerald-600 block">AI Eşleme</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Hedef Kitle</span>
                        <strong className="font-bold">18-28 Yaş</strong>
                        <span className="text-[9px] text-teal-600 block">#Kahve</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">AI Reklam Taslağı</span>
                    <span className="font-bold text-orange-600">Cold Brew Reels Yayını</span>
                  </div>
                </div>

                {/* Channel Card 3: Bursa Bot Filtresi */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <h4 className="font-bold text-sm">Bursa Bot İzolasyonu</h4>
                      </div>
                      <button onClick={triggerBursaBotAttack} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
                        Saldırıyı Simüle Et →
                      </button>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs text-slate-400 font-bold block">İncelenen Sinyal</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tight font-mono">4.40M</span>
                        <span className="text-xs font-bold text-emerald-600 font-mono">↑ 17.2%</span>
                      </div>
                    </div>

                    {/* Smooth SVG Spline Sparkline */}
                    <div className="h-20 w-full my-2">
                      <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <path
                          d="M 0 20 Q 25 30, 50 15 T 80 18 T 100 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="100" cy="8" r="3" fill="currentColor" />
                      </svg>
                    </div>

                    {/* 3 Sub-metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Elenen Bot</span>
                        <strong className="font-bold font-mono">51.81K</strong>
                        <span className="text-[9px] text-emerald-600 block">DBSCAN</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">İtibar w_k</span>
                        <strong className="font-bold font-mono">&lt; 0.10</strong>
                        <span className="text-[9px] text-rose-500 block">Sıfıra İndi</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Filtreleme</span>
                        <strong className="font-bold text-emerald-600 font-mono">%100 Temiz</strong>
                        <span className="text-[9px] text-emerald-600 block">Organik Korundu</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Güvenlik Motoru</span>
                    <span className="font-bold text-emerald-600">SHA-256 Anonimleştirme</span>
                  </div>
                </div>

              </div>

              {/* DYNAMIC MULTI-AXIS HEATMAP MATRIX WITH DIMENSION SWITCHER */}
              <div className={`p-6 rounded-2xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
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
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          activeAxisDimension === "city_topic" ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        [Şehir × Konu]
                      </button>
                      <button
                        onClick={() => { setActiveAxisDimension("age_format"); setSelectedCell({ row: "18-24 Yaş", col: "Reels" }); }}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          activeAxisDimension === "age_format" ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        [Yaş Grubu × Format]
                      </button>
                    </div>

                    <button
                      onClick={resetAll}
                      className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all cursor-pointer active:scale-98 ${
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
                            cellStyle = "bg-rose-500/10 border-rose-500 text-rose-600 shadow-md shadow-rose-500/10 animate-pulse";
                            badge = <span className="absolute top-1 right-1 text-[8px] font-black bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-mono">⚠ Z: {cell.zScore}</span>;
                          } else if (cell.isOpportunity) {
                            cellStyle = "bg-orange-500/10 border-orange-500 text-orange-600 shadow-md shadow-orange-500/10";
                            badge = <span className="absolute top-1 right-1 text-[8px] font-black bg-orange-500 text-white px-1.5 py-0.2 rounded-full">🎯 FIRSAT</span>;
                          }

                          const isSelected = selectedCell?.row === row && selectedCell?.col === col;

                          return (
                            <button
                              key={col}
                              onClick={() => setSelectedCell({ row, col })}
                              className={`h-16 rounded-xl border flex flex-col justify-center items-center relative transition-all cursor-pointer ${cellStyle} ${
                                isSelected ? "ring-2 ring-teal-500 scale-[1.03]" : ""
                              }`}
                            >
                              {badge}
                              <span className="text-sm font-black font-mono">{cell.volume}</span>
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
                  <div className={`mt-6 p-5 rounded-2xl border flex flex-col gap-4 ${
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#0b1d22] border-slate-800"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4.5 w-4.5 text-orange-500" />
                        <span className="font-extrabold text-xs uppercase tracking-wider">
                          Canlı Matematiksel Formül Çözümlemesi (Tensör Motoru Çıktısı)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-600 font-bold">
                          {selectedCell.row}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 font-bold">
                          {selectedCell.col}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Formula Step 1: Z-Score */}
                      <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-[#102d33] border-slate-700"}`}>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">Z-Score Sapma Denklemi</span>
                        <div className="font-mono text-xs text-teal-600 font-bold mb-1">
                          Z = (X - μ) / (σ + ε)
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono">
                          = ({activeCellData.volume} - {activeCellData.mean}) / ({activeCellData.std} + 10⁻⁵)
                          <strong className="block text-sm font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">
                            = {activeCellData.zScore >= 0 ? "+" : ""}{activeCellData.zScore.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      {/* Formula Step 2: Anomaly Decision */}
                      <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-[#102d33] border-slate-700"}`}>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">3σ Karar Kuralı (|Z| ≥ 3.0)</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            activeCellData.zScore >= 3.0
                              ? "bg-rose-600 text-white animate-pulse"
                              : activeCellData.isOpportunity
                              ? "bg-orange-500 text-white"
                              : "bg-emerald-500/10 text-emerald-600"
                          }`}>
                            {activeCellData.zScore >= 3.0 ? "KRİTİK ANOMALİ" : activeCellData.isOpportunity ? "ROAS FIRSATI" : "NORM DÂHİLİNDE"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-2">
                          {activeCellData.zScore >= 3.0 ? "3σ eşiği aşıldı, Sense kalkanı tetiklendi." : "İstatistiksel baz çizgi sınırlarında."}
                        </span>
                      </div>

                      {/* Formula Step 3: NLP & Reputation */}
                      <div className={`p-4 rounded-xl border ${theme === "light" ? "bg-white border-slate-200" : "bg-[#102d33] border-slate-700"}`}>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">Duygu Polaritesi & DBSCAN Ağırlığı</span>
                        <div className="flex justify-between items-center text-xs">
                          <span>BERTurk Φ(eₖ):</span>
                          <strong className={`font-mono font-black ${activeCellData.sentiment < 0 ? "text-rose-500" : "text-emerald-600"}`}>
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

              {/* BOTTOM ROW: IMPRESSIONS OVER TIME & DONUT CHART */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Chart (7/12): Impressions Over Time */}
                <div className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-extrabold text-sm">Çok Eksenli Sinyal Akışı (Zaman Serisi)</h4>
                      <span className="text-[11px] text-slate-400">15 Dakikalık Kayan Pencerelerde Sinyal İzdüşümü</span>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#102d33] border-slate-700"
                    }`}>
                      <span>Canlı Akış</span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Multi-series Spline SVG Chart with Hover Points */}
                  <div className="h-60 w-full relative">
                    {/* Floating Tooltip */}
                    {hoveredPoint && (
                      <div className="absolute top-2 right-4 bg-[#0a1e22] text-white text-[10px] p-2.5 rounded-xl border border-teal-500 shadow-xl z-20 font-mono">
                        <strong className="block text-teal-400 mb-1">{hoveredPoint.time}</strong>
                        <div>#Ulaşım: {hoveredPoint.vol1}</div>
                        <div>#Kültür: {hoveredPoint.vol2}</div>
                      </div>
                    )}

                    <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                      <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                      <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />

                      <path
                        d="M 20 110 Q 80 130, 140 100 T 260 80 T 320 85 T 380 45"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="3"
                      />
                      <circle
                        cx="380"
                        cy="45"
                        r="5"
                        fill="#0d9488"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onMouseEnter={() => setHoveredPoint({ time: "12:15 (Şimdi)", vol1: "245k (Peak)", vol2: "88k" })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      <path
                        d="M 20 130 Q 80 145, 140 120 T 260 110 T 320 125 T 380 100"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="3"
                      />
                      <circle
                        cx="380"
                        cy="100"
                        r="4"
                        fill="#f97316"
                        className="cursor-pointer hover:scale-150 transition-transform"
                        onMouseEnter={() => setHoveredPoint({ time: "12:15 (Şimdi)", vol1: "185k", vol2: "110k (Trend)" })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      <path
                        d="M 20 145 Q 80 150, 140 140 T 260 135 T 320 138 T 380 125"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                      />
                      <circle cx="380" cy="125" r="3.5" fill="#06b6d4" />
                    </svg>

                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                      <span>11:45</span>
                      <span>11:50</span>
                      <span>11:55</span>
                      <span>12:00</span>
                      <span>12:05</span>
                      <span>12:10</span>
                      <span>12:15</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-3 w-3 rounded-full bg-[#0d9488]"></span> #Ulaşım Sinyalleri
                    </span>
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-3 w-3 rounded-full bg-[#f97316]"></span> #Kültür & Etkinlik
                    </span>
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-3 w-3 rounded-full bg-[#06b6d4]"></span> #Teknoloji
                    </span>
                  </div>
                </div>

                {/* Right Chart (5/12): Impressions by Channel */}
                <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div>
                    <h4 className="font-extrabold text-sm mb-6">Kategori & Eksen Dağılımı</h4>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <div className="relative h-44 w-44 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#0d9488"
                            strokeWidth="14"
                            strokeDasharray="120.6 238.7"
                            strokeDashoffset="0"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#f97316"
                            strokeWidth="14"
                            strokeDasharray="75.6 238.7"
                            strokeDashoffset="-120.6"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#06b6d4"
                            strokeWidth="14"
                            strokeDasharray="42.5 238.7"
                            strokeDashoffset="-196.2"
                          />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-base font-black leading-tight font-mono">24.68M</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Toplam Sinyal</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#0d9488]"></span> #Ulaşım
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">12.45M (50.5%)</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]"></span> #Kültür
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">7.83M (31.7%)</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]"></span> #Teknoloji
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">4.40M (17.8%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentPanel("analytics")}
                    className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Detaylı Analitik Raporunu İncele →
                  </button>
                </div>

              </div>
            </>
          )}

          {/* VIEW 2: NABIZ-ADS CAMPAIGN WIZARD */}
          {currentPanel === "ads" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Doğal Dil Güdümlü Kampanya Sihirbazı</h3>
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
                        className="absolute right-2.5 p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-98"
                      >
                        <Send className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-slate-400 font-bold self-center mr-1">Örnek Şablonlar:</span>
                      <button
                        onClick={() => handleQuickPrompt("Kadıköy'deki kahvecimiz için Reels reklamı yap")}
                        className="text-xs px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20 hover:bg-orange-500/20 font-bold cursor-pointer"
                      >
                        ☕ Kadıköy Soğuk Kahve
                      </button>
                      <button
                        onClick={() => handleQuickPrompt("Yazılım eğitim kursumuzu yapay zekayla ilgilenen gençlere duyur")}
                        className="text-xs px-3 py-1 rounded-xl bg-teal-500/10 text-teal-600 border border-teal-500/20 hover:bg-teal-500/20 font-bold cursor-pointer"
                      >
                        💻 Yapay Zeka Kursu
                      </button>
                    </div>
                  </div>

                  {aiSuggestions && (
                    <div className="p-5 rounded-xl border border-orange-500/30 bg-orange-500/5 flex flex-col gap-4 mt-2">
                      <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" /> AI Parametre ve Zamanlama Optimizasyonu
                        </span>
                        <span className="text-[10px] bg-orange-500 text-white font-bold px-2.5 py-0.5 rounded-full font-mono">
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
                          <strong className="font-bold text-teal-600">{aiSuggestions.timeWindow}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] mb-1">Yapay Zekâ Türkçe Reklam Metni:</span>
                          <div className={`p-3.5 rounded-xl border text-xs italic leading-relaxed ${
                            theme === "light" ? "bg-white border-slate-200 text-slate-700" : "bg-[#0b1d22] border-slate-800 text-slate-300"
                          }`}>
                            {aiSuggestions.adCopy}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={launchCampaign}
                        className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer active:scale-98"
                      >
                        <CheckCircle className="h-4 w-4" /> Kampanyayı Canlıya Al (10 Saniyede Yayında)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h3 className="font-extrabold text-base mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  Aktif Reklam Kampanyaları & ROAS
                </h3>

                <div className="flex flex-col gap-3">
                  {campaigns.map(camp => (
                    <div key={camp.id} className={`p-4 rounded-xl border text-xs ${
                      theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#102d33] border-slate-700"
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{camp.prompt}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
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
                          <span>Gerçekleşen ROAS:</span> <strong className="text-orange-600 block text-xs font-black">{camp.roas}x</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: NABIZ-SENSE SECURITY & MODERATION */}
          {currentPanel === "sense" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-8 p-6 rounded-2xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h3 className="font-extrabold text-base mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-rose-500" />
                  Aktif Siber Güvenlik ve Moderasyon Alarmları
                </h3>

                <div className="flex flex-col gap-4">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-5 rounded-2xl border flex flex-col gap-4 ${
                        alert.status === "RESOLVED"
                          ? "bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-900/40"
                          : alert.type === "CRISIS"
                          ? "bg-rose-500/5 border-rose-500/30"
                          : "bg-orange-500/5 border-orange-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-bold text-sm font-mono">
                          <AlertTriangle className={`h-5 w-5 ${alert.type === "CRISIS" ? "text-rose-500" : "text-orange-500"}`} />
                          {alert.city} × {alert.topic} (Z-Score: {alert.zScore.toFixed(2)})
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          alert.status === "RESOLVED"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-rose-500 text-white animate-pulse"
                        }`}>
                          {alert.status === "RESOLVED" ? "KONTROL ALTINDA" : "MODERASYON GEREKLİ"}
                        </span>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                        theme === "light" ? "bg-white border-slate-200" : "bg-[#0b1d22] border-slate-800"
                      }`}>
                        <strong className="text-orange-600 block mb-1 text-xs">Yerli LLM Türkçe Kök Neden Açıklaması:</strong>
                        {alert.rootCause}
                      </div>

                      {alert.status !== "RESOLVED" && (
                        <div className="flex flex-wrap gap-3">
                          {alert.recommendedActions.map(act => (
                            <button
                              key={act}
                              onClick={() => handleAction(alert.id, act)}
                              className="px-4 py-2 rounded-xl bg-[#0a1e22] text-white hover:bg-[#133e42] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-98"
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-teal-400" /> {act}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-4 p-6 rounded-2xl border transition-all flex flex-col gap-6 ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <UserCheck className="h-4.5 w-4.5 text-emerald-600" /> Doğrulama ve NLP Metrikleri
                </h4>
                <div className="flex flex-col gap-4 text-xs font-mono">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-400 block text-[10px] font-sans">BERTurk Duygu Eşleşme Doğruluğu</span>
                    <strong className="text-sm font-black">%92.4 Accuracy (5-Fold CV)</strong>
                  </div>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-slate-400 block text-[10px] font-sans">Yerel LLM Çıkarım Gecikmesi</span>
                    <strong className="text-sm font-black">1.24 saniye (AWQ 4-bit)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">DBSCAN Kümeleme F1-Skoru</span>
                    <strong className="text-sm font-black">0.920 F1-Harmonik Başarım</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: DETAILED ANALYTICS */}
          {currentPanel === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-8 p-6 rounded-2xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h3 className="font-extrabold text-base mb-6">Detaylı Platform Etkileşim Hacmi</h3>
                <div className="h-64 flex items-end justify-between gap-4 px-4 pt-4 border-b border-slate-200 dark:border-slate-800">
                  {wavePoints.slice(-10).map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-slate-400 mb-1">{val * 10}k</span>
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-teal-600 to-teal-400 transition-all duration-300"
                        style={{ height: `${val * 3}%` }}
                      ></div>
                      <span className="text-[10px] text-slate-400 mt-2 font-mono">12:0{idx}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-4 p-6 rounded-2xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h4 className="font-extrabold text-sm mb-4">Popüler Kategori Trendleri</h4>
                <div className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1 font-sans">
                      <span>#Ulaşım</span> <span>%50.5</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: "50.5%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1 font-sans">
                      <span>#Kültür</span> <span>%31.7</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: "31.7%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-300 mb-1 font-sans">
                      <span>#Teknoloji</span> <span>%17.8</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: "17.8%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: KVKK PRIVACY COMPLIANCE */}
          {currentPanel === "privacy" && (
            <div className={`p-8 rounded-2xl border transition-all ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
            }`}>
              <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                Sıfır Bireysel Profilleme & KVKK Güvenlik Uyumluluğu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                NABIZ Platformu; KVKK Madde 5 ve 6 çerçevesinde geliştirilmiş Sıfır Bireysel Profilleme (Zero-Profiling) prensibiyle çalışır. Kişisel veri ve üçüncü taraf çerezler kullanılmaz; yalnızca toplu tensör dağılımları işlenir.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102d33]">
                  <strong className="text-xs font-bold block mb-1">Kimliksizleştirme (SHA-256)</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                    Kullanıcı kimlikleri veri giriş boru hattında SHA-256 hash algoritmalarıyla anında temizlenir.
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102d33]">
                  <strong className="text-xs font-bold block mb-1">Yerli Sunucu & AES-256 Şifreleme</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                    Tüm veri boru hatları ve açık kaynaklı yerli dil modelleri Türkiye sınırları içindeki yerel sunucularda çalıştırılır.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: EMBEDDED PROJECT TECHNICAL REPORT WITH FINANCIAL SIMULATOR */}
          {currentPanel === "report" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Table of Contents */}
              <div className="lg:col-span-3">
                <div className={`p-4 rounded-2xl border sticky top-24 ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-3">İçindekiler</h4>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <button
                      onClick={() => setActiveReportSection("sec-1")}
                      className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-1" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      1. Proje Özeti
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-2")}
                      className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-2" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      2. Katma Değer & Yenilikçilik
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-3")}
                      className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-3" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      3. Teknoloji & Matematik
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-4")}
                      className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-4" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      4. Uygulanabilirlik & ROAS
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-6")}
                      className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-6" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      6. Sürdürülebilirlik & Finans
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-8")}
                      className={`text-left py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-8" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      8. Takım & Kaynakça
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Text */}
              <div className={`lg:col-span-9 p-8 rounded-2xl border text-xs leading-relaxed ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-sm" : "bg-[#0d2227] border-slate-800"
              }`}>
                {activeReportSection === "sec-1" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-black text-teal-700 dark:text-teal-400 pb-2 border-b">1. PROJE ÖZETİ</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-6">
                      <strong>NABIZ Projesi</strong>, dijital sosyal ağlardaki çok boyutlu etkileşim sinyallerini esnek eşlenebilen koordinat eksenlerinde dinamik ısı matrislerine dönüştüren, matematiksel Z-Score ve DBSCAN anomali filtreleriyle sapmaları saptayan ve içgörüleri iki ana kolda eyleme dönüştüren bütünleşik bir Sosyal Yapay Zekâ ve Yeni Nesil AdTech platformudur:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600 dark:text-slate-300">
                      <li><strong>NABIZ-Sense (Platform Kalkanı)</strong>: Siber zorbalık, bot saldırıları ve dezenformasyonu saptayan yerli NLP (BERTurk) ve yerel LLM destekli Türkçe Kök Neden Analiz sistemi.</li>
                      <li><strong>NABIZ-Ads (AI Reklam Merkezi)</strong>: Arama çubuğu sadeliğinde çalışan, KOBİ'lerin bütçesini en verimli zaman ve kitleye otomatik eşleyen Doğal Dil Kampanya Sihirbazı.</li>
                    </ul>
                  </div>
                )}

                {activeReportSection === "sec-3" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-black text-teal-700 dark:text-teal-400 pb-2 border-b">3. TEKNOLOJİ VE MATEMATİKSEL MODELLEME</h3>
                    <p className="text-slate-600 dark:text-slate-300">Dinamik Z-Score sapma indeksi ve anomali karar kuralı:</p>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#102d33] border text-center font-serif text-sm">
                      Z<sub>i,j</sub>(t) = (X<sub>i,j</sub>(t) - &mu;<sub>i,j</sub>(W)) / (&sigma;<sub>i,j</sub>(W) + &epsilon;)
                      <br />
                      <strong className="text-rose-500 font-sans block mt-2">Anomali Kriteri: |Z<sub>i,j</sub>(t)| &ge; 3.0</strong>
                    </div>
                  </div>
                )}

                {activeReportSection === "sec-6" && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-lg font-black text-teal-700 dark:text-teal-400 pb-2 border-b">6. SÜRDÜRÜLEBİLİRLİK VE DİNAMİK FİNANSAL PROJEKSİYON</h3>
                      <p className="text-slate-600 dark:text-slate-300 mt-2">
                        Aşağıdaki simülatör ile aktif KOBİ reklamveren sayısını değiştirerek 3 yıllık brüt gelir ve net faaliyet kârı (EBITDA) projeksiyonlarını dinamik olarak inceleyebilirsiniz:
                      </p>
                    </div>

                    {/* Interactive Financial Growth Simulator Slider */}
                    <div className={`p-5 rounded-2xl border ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#102d33] border-slate-700"}`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <Sliders className="h-4 w-4 text-orange-500" />
                          Aktif KOBİ Reklamveren Sayısı:
                        </span>
                        <strong className="text-base font-black text-orange-600 font-mono">
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
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />

                      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-sans">Aylık Ortalama Harcama</span>
                          <strong className="text-sm font-bold text-slate-700 dark:text-slate-200">1.200 TL / KOBİ</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-sans">Hesaplanan Yıllık Brüt Gelir</span>
                          <strong className="text-sm font-black text-slate-900 dark:text-white">
                            {((financialSmeCount * 360) / 1000).toFixed(0)} Bin TL ({((financialSmeCount * 360) / 1000000).toFixed(1)}M TL)
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-sans">Net Faaliyet Kârı (EBITDA)</span>
                          <strong className="text-sm font-black text-emerald-600">
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
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <footer className={`py-4 text-center text-xs border-t mt-auto shrink-0 ${
          theme === "light" ? "bg-white border-slate-200 text-slate-500" : "bg-[#0b1d22] border-slate-800 text-slate-500"
        }`}>
          <p>© 2026 NABIZ AI Platformu • Sadir Pehlivan Takımı #990060 • TEKNOFEST N-Sosyal İnovasyon</p>
        </footer>

      </main>
    </div>
  );
}
