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
  Compass,
  Database,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Gauge,
  Globe,
  Info,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquare,
  Moon,
  MousePointer,
  Navigation,
  PieChart,
  Play,
  Radar,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Video,
  Volume2,
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

// 3 Dimension Matrix Presets
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

  // Financial Calculator State
  const [financialSmeCount, setFinancialSmeCount] = useState<number>(25000);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "alert" } | null>(null);

  // Jury Auto-Tour State
  const [isJuryTourRunning, setIsJuryTourRunning] = useState(false);

  // Live Multi-Layer Pastel Wave Points
  const [wavePoints1, setWavePoints1] = useState<number[]>([15, 20, 12, 28, 35, 18, 25, 42, 30, 20, 18, 38, 48, 22, 28, 20, 15, 35, 42, 18, 25]);
  const [wavePoints2, setWavePoints2] = useState<number[]>([25, 18, 30, 20, 25, 35, 40, 18, 12, 38, 22, 28, 32, 15, 20, 42, 25, 18, 32, 22, 15]);
  const [wavePoints3, setWavePoints3] = useState<number[]>([8, 12, 18, 10, 14, 22, 18, 10, 8, 20, 14, 18, 16, 10, 12, 25, 16, 12, 20, 14, 10]);

  // Analytics KPI metrics
  const [totalSignalCount, setTotalSignalCount] = useState("24.68M");
  const [anomalyCount, setAnomalyCount] = useState("312.47K");
  const [sentimentIndex, setSentimentIndex] = useState(0.42);
  const [optimizedRoas, setOptimizedRoas] = useState("3.85x");
  const [botBlockedCount, setBotBlockedCount] = useState(51810);

  // Radar Anomaly Indices for 5 cities
  const [radarData, setRadarData] = useState<{ [city: string]: number }>({
    "İstanbul": 1.5,
    "Ankara": 0.67,
    "İzmir": 3.92,
    "Bursa": 1.0,
    "Antalya": 0.75,
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

  const showToast = (message: string, type: "success" | "info" | "alert" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time animation loop for glowing pastel waves
  useEffect(() => {
    const waveInterval = setInterval(() => {
      const isCrisis = alerts.some(a => a.status === "UNRESOLVED" && a.type === "CRISIS");
      
      setWavePoints1(prev => {
        const next = [...prev.slice(1)];
        const val = isCrisis ? Math.floor(Math.random() * 25) + 35 : Math.floor(Math.random() * 20) + 15;
        next.push(val);
        return next;
      });

      setWavePoints2(prev => {
        const next = [...prev.slice(1)];
        const val = isCrisis ? Math.floor(Math.random() * 20) + 25 : Math.floor(Math.random() * 15) + 10;
        next.push(val);
        return next;
      });

      setWavePoints3(prev => {
        const next = [...prev.slice(1)];
        const val = Math.floor(Math.random() * 12) + 5;
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
    setRadarData(prev => ({ ...prev, "İzmir": 5.12 }));
    
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
    setSentimentIndex(-0.85);
    
    showToast("🚨 İZMİR KRİZİ TETİKLENDİ! (Z = +5.12 Anomali Radarı Patladı)", "alert");
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
    setRadarData(prev => ({ ...prev, "İstanbul": 6.20 }));
    setSelectedCell({ row: "İstanbul", col: "#Kültür" });
    setSentimentIndex(0.88);
    setOptimizedRoas("4.15x");
    
    setPromptInput("Kadıköy'deki butik kahvecimiz için Reels reklamı yap");
    setCurrentPanel("ads");
    showToast("🎯 KADIKÖY VIRAL TRENDİ AKTİF! (+%45 ROAS Fırsatı)", "success");
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
    setRadarData(prev => ({ ...prev, "Bursa": 9.30 }));
    setSelectedCell({ row: "Bursa", col: "#Ekonomi" });
    setBotBlockedCount(prev => prev + 280);
    
    showToast("🛡️ BURSA BOT SALDIRISI DBSCAN İLE ENGELLENDİ!", "info");
  };

  const resetAll = () => {
    setCityMatrix(getCityTopicMatrix());
    setAgeMatrix(getAgeFormatMatrix());
    setRadarData({
      "İstanbul": 1.5,
      "Ankara": 0.67,
      "İzmir": 3.92,
      "Bursa": 1.0,
      "Antalya": 0.75,
    });
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
    ]);
    setSelectedCell({ row: "İzmir", col: "#Ulaşım" });
    setTotalSignalCount("24.68M");
    setAnomalyCount("312.47K");
    setSentimentIndex(0.42);
    setOptimizedRoas("3.85x");
    showToast("🔄 Sistem Norm Değerlerine Sıfırlandı.", "info");
  };

  // Automated Jury Tour Sequence
  const runJuryAutoTour = () => {
    setIsJuryTourRunning(true);
    showToast("🎬 Jüri Canlı Demo Turu Başlatıldı! (12 Saniyelik Otomatik Sunum)", "info");
    
    // Step 1: Trigger Izmir crisis
    setTimeout(() => {
      triggerIzmirCrisis();
    }, 1500);

    // Step 2: Jump to Sense tab
    setTimeout(() => {
      setCurrentPanel("sense");
      showToast("🛡️ Kanat 1: NABIZ-Sense Siber Kalkanı İnceleniyor...", "info");
    }, 4000);

    // Step 3: Resolve crisis
    setTimeout(() => {
      handleAction("a1", "Topluluk Bildirilendirme Duyurusu Yayınla");
    }, 7000);

    // Step 4: Trigger Kadikoy Opportunity & Jump to Ads
    setTimeout(() => {
      triggerKadikoyOpportunity();
      showToast("🚀 Kanat 2: NABIZ-Ads Doğal Dil Reklam Motoru Devrede!", "success");
    }, 9500);

    // Step 5: Complete
    setTimeout(() => {
      setIsJuryTourRunning(false);
      showToast("🏆 Jüri Canlı Turu Başarıyla Tamamlandı!", "success");
    }, 13000);
  };

  const handleAction = (alertId: string, action: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: "RESOLVED" } : a))
    );
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
    
    setTimeout(() => {
      setCampaigns(prev =>
        prev.map(c =>
          c.id === newCamp.id
            ? { ...c, clicks: 142, impressions: 4500, roas: 3.86 }
            : c
        )
      );
    }, 3000);

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

  // Sentiment Needle Rotation (-90deg to +90deg)
  const sentimentNeedleAngle = Math.min(90, Math.max(-90, sentimentIndex * 90));

  // Radar Polygon Points Calculation
  const radarScale = (val: number) => Math.min(100, Math.max(20, (val / 6.0) * 80 + 20));
  const rIst = radarScale(radarData["İstanbul"]);
  const rAnk = radarScale(radarData["Ankara"]);
  const rIzm = radarScale(radarData["İzmir"]);
  const rBur = radarScale(radarData["Bursa"]);
  const rAnt = radarScale(radarData["Antalya"]);

  // Radar polygon points (center 100, 100)
  const pIst = `100,${100 - rIst * 0.8}`;
  const pAnk = `${100 + rAnk * 0.76},${100 - rAnk * 0.25}`;
  const pIzm = `${100 + rIzm * 0.47},${100 + rIzm * 0.65}`;
  const pBur = `${100 - rBur * 0.47},${100 + rBur * 0.65}`;
  const pAnt = `${100 - rAnt * 0.76},${100 - rAnt * 0.25}`;
  const radarPolygon = `${pIst} ${pAnk} ${pIzm} ${pBur} ${pAnt}`;

  return (
    <div className={`h-screen flex flex-col lg:flex-row font-sans selection:bg-orange-500 selection:text-white overflow-hidden ${
      theme === "light" ? "bg-[#f8fafc] text-slate-900" : "bg-[#071317] text-slate-100"
    }`}>
      
      {/* TOAST NOTIFICATION OVERLAY */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce transition-all ${
          toast.type === "alert"
            ? "bg-rose-600 text-white border-rose-400 shadow-rose-600/30"
            : toast.type === "info"
            ? "bg-teal-600 text-white border-teal-400 shadow-teal-600/30"
            : "bg-[#0a1e22] text-teal-300 border-teal-500 shadow-emerald-500/20"
        }`}>
          {toast.type === "alert" ? <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" /> : <Sparkles className="h-5 w-5 shrink-0 text-amber-400" />}
          <span className="text-xs font-black">{toast.message}</span>
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
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Activity className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">NABIZ</h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white uppercase tracking-wider shadow-sm">AI</span>
              </div>
              <span className="text-[10px] text-teal-400/90 font-bold block uppercase tracking-wider">
                Karar & AdTech Motoru
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => { setCurrentPanel("dashboard"); setActiveWing("all"); }}
              className={`w-full py-3 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "dashboard"
                  ? "bg-[#16383e] text-teal-300 shadow-inner border border-teal-500/30"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className={`h-4.5 w-4.5 ${currentPanel === "dashboard" ? "text-teal-400" : "text-slate-400"}`} />
              Genel Bakış (Overview)
            </button>

            <button
              onClick={() => { setCurrentPanel("ads"); setActiveWing("ads"); }}
              className={`w-full py-3 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "ads"
                  ? "bg-[#16383e] text-teal-300 shadow-inner border border-teal-500/30"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <Rocket className={`h-4.5 w-4.5 ${currentPanel === "ads" ? "text-orange-400" : "text-slate-400"}`} />
              NABIZ-Ads Kampanyalar
            </button>

            <button
              onClick={() => { setCurrentPanel("sense"); setActiveWing("sense"); }}
              className={`w-full py-3 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "sense"
                  ? "bg-[#16383e] text-teal-300 shadow-inner border border-teal-500/30"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <Shield className={`h-4.5 w-4.5 ${currentPanel === "sense" ? "text-rose-400" : "text-slate-400"}`} />
              NABIZ-Sense Kalkanı
            </button>

            <button
              onClick={() => { setCurrentPanel("analytics"); }}
              className={`w-full py-3 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "analytics"
                  ? "bg-[#16383e] text-teal-300 shadow-inner border border-teal-500/30"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <TrendingUp className={`h-4.5 w-4.5 ${currentPanel === "analytics" ? "text-teal-400" : "text-slate-400"}`} />
              Detaylı Analitik & Eksenler
            </button>

            <button
              onClick={() => { setCurrentPanel("privacy"); }}
              className={`w-full py-3 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "privacy"
                  ? "bg-[#16383e] text-teal-300 shadow-inner border border-teal-500/30"
                  : "text-slate-400 hover:bg-[#102d33] hover:text-slate-200"
              }`}
            >
              <Lock className={`h-4.5 w-4.5 ${currentPanel === "privacy" ? "text-teal-400" : "text-slate-400"}`} />
              KVKK & Sıfır Profilleme
            </button>

            <button
              onClick={() => { setCurrentPanel("report"); }}
              className={`w-full py-3 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                currentPanel === "report"
                  ? "bg-[#16383e] text-teal-300 shadow-inner border border-teal-500/30"
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
          <div className="bg-[#102d33] border border-[#1b4d57]/60 rounded-3xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-orange-400 animate-spin" style={{ animationDuration: "6s" }} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white leading-tight">Milli Çift Kanatlı AdTech</h4>
                <span className="text-[10px] text-teal-300/80 font-bold">TEKNOFEST 2026</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Z-Score ve DBSCAN filtreleri ile +%34 ROAS ve 32 saniyede kriz müdahalesi devrede.
            </p>
            <button
              onClick={runJuryAutoTour}
              disabled={isJuryTourRunning}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-black transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> {isJuryTourRunning ? "Demo Çalışıyor..." : "🎬 Jüri Canlı Demosu"}
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0e272c] border border-[#16383e]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-black text-xs text-white shadow-md">
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className={`px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b shrink-0 ${
          theme === "light" ? "bg-white/90 backdrop-blur-md border-slate-200/80" : "bg-[#0b1d22]/90 backdrop-blur-md border-slate-800"
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-orange-600 dark:from-white dark:via-teal-200 dark:to-amber-400 bg-clip-text text-transparent">
                NABIZ AI Karar Destek Platformu
              </h2>
              <span className="text-xl">✨</span>
            </div>
            <p className={`text-xs font-medium mt-1 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              TEKNOFEST 2026 N-Sosyal İnovasyon • Çok Eksenli Tensör & Anomali Karar Destek Merkezi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
            {/* Automated Jury Tour Button */}
            <button
              onClick={runJuryAutoTour}
              disabled={isJuryTourRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:opacity-90 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current animate-pulse" />
              <span>{isJuryTourRunning ? "Demo Turu Aktif..." : "▶ Jüri Otomatik Demosu"}</span>
            </button>

            {/* Double-Wing Architecture Quick Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-[#102d33] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-inner">
              <button
                onClick={() => { setActiveWing("all"); setCurrentPanel("dashboard"); }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeWing === "all" ? "bg-[#0a1e22] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => { setActiveWing("sense"); setCurrentPanel("sense"); }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeWing === "sense" ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Shield className="h-3 w-3" /> Kanat 1: Sense
              </button>
              <button
                onClick={() => { setActiveWing("ads"); setCurrentPanel("ads"); }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeWing === "ads" ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Rocket className="h-3 w-3" /> Kanat 2: Ads
              </button>
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                theme === "light" ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" : "bg-[#0f282e] border-slate-700 text-amber-400 hover:bg-[#15343c]"
              }`}
              title={theme === "light" ? "Karanlık Moda Geç" : "Aydınlık Moda Geç"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* SYSTEM USABILITY & OPERATIONAL BENCHMARK BANNER */}
        <div className={`px-8 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 text-xs shrink-0 ${
          theme === "light" ? "bg-gradient-to-r from-teal-50/50 via-slate-50 to-orange-50/50 border-slate-200" : "bg-[#0d2227] border-slate-800"
        }`}>
          <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
            <Award className="h-4 w-4 text-orange-500" />
            Doğrulanmış Rapor Başarım Metrikleri:
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sense Moderasyon SUS:</span>
              <strong className="text-teal-700 dark:text-teal-300 font-black bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-mono">86.4 / 100 (A+)</strong>
              <span className="text-[11px] text-slate-500">(4.2 saat → 32 sn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ads Reklamveren SUS:</span>
              <strong className="text-orange-700 dark:text-orange-300 font-black bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full font-mono">91.2 / 100 (A+)</strong>
              <span className="text-[11px] text-slate-500">(35 dk → 12 sn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">ROAS Verim Artışı:</span>
              <strong className="text-emerald-700 dark:text-emerald-300 font-black bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">+%34 (1:3.75x)</strong>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
          
          {/* 4 TOP KPI SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* KPI 1 */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-11 w-11 rounded-2xl bg-[#0a1e22] text-teal-400 flex items-center justify-center shadow-md">
                  <Eye className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                  ↑ 18.6%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Toplam Sinyal Hacmi</span>
                <span className="text-2xl font-black tracking-tight font-mono">{totalSignalCount}</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 18.6% vs son 15 dk</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <MousePointer className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                  ↑ 22.4%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">Saptanan Anomali & Kriz</span>
                <span className="text-2xl font-black tracking-tight font-mono">{anomalyCount}</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">↑ 22.4% vs baz çizgi</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-11 w-11 rounded-2xl bg-[#0f2b2f] text-emerald-400 flex items-center justify-center shadow-md">
                  <Activity className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
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

            {/* KPI 4 */}
            <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all relative overflow-hidden ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
            }`}>
              <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <Award className="h-5 w-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
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

          {/* 4 GIANT TACTILE 3D ACTION CARDS (Büyük Çarpıcı Butonlar) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                İnteraktif Olay ve Simülasyon Kumanda Merkezi
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">Jüri Test Senaryoları</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Giant Button 1: İzmir Krizi */}
              <button
                onClick={triggerIzmirCrisis}
                className="p-5 rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent hover:from-rose-500/20 hover:border-rose-500 text-left transition-all duration-200 shadow-lg hover:shadow-rose-500/20 cursor-pointer active:scale-95 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-600 text-white animate-pulse">
                    Z: +5.12 (3σ Kuralı)
                  </span>
                </div>
                <h4 className="font-black text-sm text-rose-700 dark:text-rose-300 block mb-1">
                  1. İzmir Ulaşım Kriz Senaryosu
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  3σ anomali eşiği aşılır, BERTurk negatif polarite (Φ = -0.92) ile alarm üretir.
                </p>
              </button>

              {/* Giant Button 2: Kadıköy Trendi */}
              <button
                onClick={triggerKadikoyOpportunity}
                className="p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent hover:from-amber-500/20 hover:border-amber-500 text-left transition-all duration-200 shadow-lg hover:shadow-amber-500/20 cursor-pointer active:scale-95 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 transition-transform">
                    <Flame className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-orange-500 text-white">
                    ROAS +%34
                  </span>
                </div>
                <h4 className="font-black text-sm text-amber-700 dark:text-amber-300 block mb-1">
                  2. Kadıköy Trend & Fırsat Senaryosu
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  AdTech tensör hücre eşlemesi ile KOBİ'ler için anlık reklam fırsatı oluşturulur.
                </p>
              </button>

              {/* Giant Button 3: Bursa Bot Saldırısı */}
              <button
                onClick={triggerBursaBotAttack}
                className="p-5 rounded-3xl border border-teal-500/40 bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent hover:from-teal-500/20 hover:border-teal-500 text-left transition-all duration-200 shadow-lg hover:shadow-teal-500/20 cursor-pointer active:scale-95 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#0a1e22] text-teal-400 border border-teal-500/40 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-teal-600 text-white">
                    w_k &lt; 0.1 (Bot)
                  </span>
                </div>
                <h4 className="font-black text-sm text-teal-700 dark:text-teal-300 block mb-1">
                  3. Bursa Bot Saldırısı & İzolasyon Testi
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  DBSCAN yoğunluk algoritması ile 280 sahte hesap organik akıştan temizlenir.
                </p>
              </button>

              {/* Giant Button 4: Sıfırla */}
              <button
                onClick={resetAll}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-100/50 dark:from-[#102d33] to-transparent hover:bg-slate-100 dark:hover:bg-[#153840] text-left transition-all duration-200 shadow-md cursor-pointer active:scale-95 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                    <RefreshCw className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                    SIFIRLA
                  </span>
                </div>
                <h4 className="font-black text-sm text-slate-700 dark:text-slate-200 block mb-1">
                  4. Fabrika Normlarına Döndür
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tensör matrisi ve anomali radarını başlangıç referans durumuna sıfırlar.
                </p>
              </button>

            </div>
          </div>

          {/* VIEW 1: OVERVIEW / DASHBOARD (With Radar Chart, Sentiment Gauge & Multi-Layer Wave) */}
          {currentPanel === "dashboard" && (
            <>
              {/* 2 NEW JAW-DROPPING CHARTS: RADAR CHART + SENTIMENT GAUGE TACHOMETER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Chart A: 5-City Anomaly Radar (7/12) */}
                <div className={`lg:col-span-7 p-6 rounded-3xl border transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-black text-sm flex items-center gap-2">
                        <Compass className="h-4.5 w-4.5 text-teal-600" />
                        5 Şehir Anomali Radarı (Z-Score Polar Poligonu)
                      </h4>
                      <span className="text-[11px] text-slate-400">Şehir bazlı anomali sapmalarının polar koordinat ağı</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 border border-teal-500/20">
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

                        {/* Dynamic Anomaly Polygon with Pastel Glow */}
                        <polygon
                          points={radarPolygon}
                          fill="url(#radar-glow)"
                          stroke={radarData["İzmir"] >= 3.0 ? "#f43f5e" : "#0d9488"}
                          strokeWidth="2.5"
                          className="transition-all duration-700"
                        />

                        {/* Radar Nodes */}
                        <circle cx="100" cy={100 - rIst * 0.8} r="4" fill="#3b82f6" />
                        <circle cx={100 + rAnk * 0.76} cy={100 - rAnk * 0.25} r="4" fill="#8b5cf6" />
                        <circle cx={100 + rIzm * 0.47} cy={100 + rIzm * 0.65} r="6" fill="#f43f5e" className="animate-pulse" />
                        <circle cx={100 - rBur * 0.47} cy={100 + rBur * 0.65} r="4" fill="#10b981" />
                        <circle cx={100 - rAnt * 0.76} cy={100 - rAnt * 0.25} r="4" fill="#f59e0b" />

                        <defs>
                          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={radarData["İzmir"] >= 3.0 ? "#f43f5e" : "#0d9488"} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={radarData["İzmir"] >= 3.0 ? "#f43f5e" : "#0d9488"} stopOpacity="0.05" />
                          </radialGradient>
                        </defs>
                      </svg>

                      {/* City Axis Labels */}
                      <span className="absolute -top-1 font-black text-[10px] text-blue-500">İstanbul</span>
                      <span className="absolute top-12 -right-4 font-black text-[10px] text-purple-500">Ankara</span>
                      <span className="absolute -bottom-2 right-4 font-black text-[10px] text-rose-500 animate-pulse">İzmir (3σ)</span>
                      <span className="absolute -bottom-2 left-4 font-black text-[10px] text-emerald-500">Bursa</span>
                      <span className="absolute top-12 -left-4 font-black text-[10px] text-amber-500">Antalya</span>
                    </div>

                    {/* Radar Live Metrics List */}
                    <div className="flex-1 flex flex-col gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-sans font-bold flex items-center gap-1.5 text-rose-600">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span> İzmir Z-Score:
                        </span>
                        <strong className="font-black text-rose-600">+{radarData["İzmir"].toFixed(2)} (Kritik)</strong>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-sans font-bold text-slate-600 dark:text-slate-300">İstanbul Z-Score:</span>
                        <strong className="font-black text-orange-600">+{radarData["İstanbul"].toFixed(2)} (Fırsat)</strong>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-sans font-bold text-slate-600 dark:text-slate-300">Ankara Z-Score:</span>
                        <strong className="font-bold text-slate-700 dark:text-slate-300">+{radarData["Ankara"].toFixed(2)} (Norm)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart B: Semantic Sentiment Tachometer Gauge (5/12) */}
                <div className={`lg:col-span-5 p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-sm flex items-center gap-2">
                        <Gauge className="h-4.5 w-4.5 text-orange-500" />
                        Duygu Takometresi (BERTurk Φ)
                      </h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
                        SEMANTİK İBRE
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mb-4">NLP modelinin ürettiği canlı polarite skalası (-1.0 ile +1.0)</span>

                    {/* Semicircle Speedometer SVG */}
                    <div className="relative h-36 w-full flex items-center justify-center overflow-hidden">
                      <svg className="w-64 h-36" viewBox="0 0 200 110">
                        {/* Gauge Arc Background */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="url(#gauge-pastel-gradient)"
                          strokeWidth="16"
                          strokeLinecap="round"
                        />
                        {/* Needle Pivot Center */}
                        <circle cx="100" cy="100" r="10" fill="#0a1e22" stroke="#ffffff" strokeWidth="2" />
                        
                        {/* Rotating Needle Pointer */}
                        <g
                          style={{
                            transformOrigin: "100px 100px",
                            transform: `rotate(${sentimentNeedleAngle}deg)`,
                            transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        >
                          <line x1="100" y1="100" x2="100" y2="35" stroke="#0a1e22" strokeWidth="3.5" strokeLinecap="round" />
                          <circle cx="100" cy="32" r="4" fill="#f97316" />
                        </g>

                        <defs>
                          <linearGradient id="gauge-pastel-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="35%" stopColor="#f59e0b" />
                            <stop offset="70%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-slate-400 px-4 -mt-2">
                      <span className="text-rose-500">-1.0 (Aşırı Negatif)</span>
                      <span>0.0 (Nötr)</span>
                      <span className="text-emerald-500">+1.0 (Viral Pozitif)</span>
                    </div>
                  </div>

                  {/* Digital Readout */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#102d33] border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">Hesaplanan Anlık Polarite:</span>
                    <strong className={`font-mono text-base font-black ${sentimentIndex < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      {sentimentIndex >= 0 ? "+" : ""}{sentimentIndex.toFixed(2)} Φ(eₖ)
                    </strong>
                  </div>
                </div>

              </div>

              {/* MULTI-LAYER PASTEL GLOWING SPLINE WAVES (Holographic Waves) */}
              <div className={`p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-black text-sm flex items-center gap-2">
                      <Radio className="h-4.5 w-4.5 text-emerald-500 animate-pulse" />
                      Canlı Çok Katmanlı Tensör Sinyal Akış Dalgası (Pastel Hologram)
                    </h4>
                    <span className="text-[11px] text-slate-400">Gerçek zamanlı 3 katmanlı giriş sinyalleri akış simülasyonu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-black text-emerald-600 font-mono">400ms REALTIME INGEST</span>
                  </div>
                </div>

                {/* 3-Layer Overlapping Pastel Wave SVG */}
                <div className="h-32 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    {/* Layer 3 (Lavender / Purple) */}
                    <path
                      d={`M 0 50 ${wavePoints3.map((p, i) => `L ${(i / (wavePoints3.length - 1)) * 100} ${50 - p}`).join(" ")} L 100 50 Z`}
                      fill="url(#pastel-wave-purple)"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      className="transition-all duration-300 opacity-60"
                    />

                    {/* Layer 2 (Sunset Orange / Coral) */}
                    <path
                      d={`M 0 50 ${wavePoints2.map((p, i) => `L ${(i / (wavePoints2.length - 1)) * 100} ${50 - p}`).join(" ")} L 100 50 Z`}
                      fill="url(#pastel-wave-orange)"
                      stroke="#f97316"
                      strokeWidth="2"
                      className="transition-all duration-300 opacity-75"
                    />

                    {/* Layer 1 (Mint Teal - Front) */}
                    <path
                      d={`M 0 50 ${wavePoints1.map((p, i) => `L ${(i / (wavePoints1.length - 1)) * 100} ${50 - p}`).join(" ")} L 100 50 Z`}
                      fill="url(#pastel-wave-teal)"
                      stroke={alerts.some(a => a.status === "UNRESOLVED" && a.type === "CRISIS") ? "#f43f5e" : "#10b981"}
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />

                    <defs>
                      <linearGradient id="pastel-wave-teal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="pastel-wave-orange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="pastel-wave-purple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                  <span>-10 Saniye</span>
                  <span className="text-teal-600 font-bold">● #Ulaşım (Ön Dalga)  ● #Kültür (Orta Dalga)  ● #Teknoloji (Alt Dalga)</span>
                  <span>Şimdi (T)</span>
                </div>
              </div>

              {/* DYNAMIC MULTI-AXIS HEATMAP MATRIX */}
              <div className={`p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-black text-base flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Çok Eksenli Tensör İzdüşümü Matrisi
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Rapor Bölüm 1.1 & 3.1: Esnek eşlenebilen koordinat eksenlerinde anlık tensör izdüşümü M<sub>i,j</sub>(t)
                    </p>
                  </div>

                  {/* Multi-Axis Dimension Selector Pills */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-[#102d33] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                      <button
                        onClick={() => { setActiveAxisDimension("city_topic"); setSelectedCell({ row: "İzmir", col: "#Ulaşım" }); }}
                        className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                          activeAxisDimension === "city_topic" ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        [Şehir × Konu]
                      </button>
                      <button
                        onClick={() => { setActiveAxisDimension("age_format"); setSelectedCell({ row: "18-24 Yaş", col: "Reels" }); }}
                        className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                          activeAxisDimension === "age_format" ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
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
                            cellStyle = "bg-rose-500/10 border-rose-500 text-rose-600 shadow-lg shadow-rose-500/20 animate-pulse";
                            badge = <span className="absolute top-1 right-1 text-[8px] font-black bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-mono">⚠ Z: {cell.zScore}</span>;
                          } else if (cell.isOpportunity) {
                            cellStyle = "bg-orange-500/10 border-orange-500 text-orange-600 shadow-lg shadow-orange-500/20";
                            badge = <span className="absolute top-1 right-1 text-[8px] font-black bg-orange-500 text-white px-1.5 py-0.2 rounded-full">🎯 FIRSAT</span>;
                          }

                          const isSelected = selectedCell?.row === row && selectedCell?.col === col;

                          return (
                            <button
                              key={col}
                              onClick={() => setSelectedCell({ row, col })}
                              className={`h-16 rounded-2xl border flex flex-col justify-center items-center relative transition-all cursor-pointer ${cellStyle} ${
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
                  <div className={`mt-6 p-5 rounded-3xl border flex flex-col gap-4 ${
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#0b1d22] border-slate-800"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4.5 w-4.5 text-orange-500" />
                        <span className="font-black text-xs uppercase tracking-wider">
                          Canlı Matematiksel Formül Çözümlemesi (Tensör Motoru Çıktısı)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-3 py-1 rounded-xl bg-teal-500/10 text-teal-600 font-bold border border-teal-500/20">
                          {selectedCell.row}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 font-bold border border-orange-500/20">
                          {selectedCell.col}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Formula Step 1: Z-Score */}
                      <div className={`p-4 rounded-2xl border ${theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#102d33] border-slate-700"}`}>
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
                      <div className={`p-4 rounded-2xl border ${theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#102d33] border-slate-700"}`}>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">3σ Karar Kuralı (|Z| ≥ 3.0)</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${
                            activeCellData.zScore >= 3.0
                              ? "bg-rose-600 text-white animate-pulse"
                              : activeCellData.isOpportunity
                              ? "bg-orange-500 text-white"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}>
                            {activeCellData.zScore >= 3.0 ? "KRİTİK ANOMALİ" : activeCellData.isOpportunity ? "ROAS FIRSATI" : "NORM DÂHİLİNDE"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-2">
                          {activeCellData.zScore >= 3.0 ? "3σ eşiği aşıldı, Sense kalkanı tetiklendi." : "İstatistiksel baz çizgi sınırlarında."}
                        </span>
                      </div>

                      {/* Formula Step 3: NLP & Reputation */}
                      <div className={`p-4 rounded-2xl border ${theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-[#102d33] border-slate-700"}`}>
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
            </>
          )}

          {/* VIEW 2: NABIZ-ADS CAMPAIGN WIZARD */}
          {currentPanel === "ads" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className={`lg:col-span-7 p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-11 w-11 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Doğal Dil Güdümlü Kampanya Sihirbazı</h3>
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
                        className={`w-full rounded-2xl px-4 py-3.5 text-sm focus:outline-none pr-12 transition-all border ${
                          theme === "light"
                            ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500"
                            : "bg-[#102d33] border-slate-700 text-slate-100 focus:border-teal-400"
                        }`}
                      />
                      <button
                        onClick={generateAdCampaign}
                        className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white hover:opacity-90 transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
                      >
                        <Send className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-slate-400 font-bold self-center mr-1">Örnek Şablonlar:</span>
                      <button
                        onClick={() => handleQuickPrompt("Kadıköy'deki kahvecimiz için Reels reklamı yap")}
                        className="text-xs px-3.5 py-1.5 rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20 hover:bg-orange-500/20 font-bold cursor-pointer"
                      >
                        ☕ Kadıköy Soğuk Kahve
                      </button>
                      <button
                        onClick={() => handleQuickPrompt("Yazılım eğitim kursumuzu yapay zekayla ilgilenen gençlere duyur")}
                        className="text-xs px-3.5 py-1.5 rounded-xl bg-teal-500/10 text-teal-600 border border-teal-500/20 hover:bg-teal-500/20 font-bold cursor-pointer"
                      >
                        💻 Yapay Zeka Kursu
                      </button>
                    </div>
                  </div>

                  {aiSuggestions && (
                    <div className="p-5 rounded-3xl border border-orange-500/30 bg-orange-500/5 flex flex-col gap-4 mt-2">
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
                          <div className={`p-3.5 rounded-2xl border text-xs italic leading-relaxed ${
                            theme === "light" ? "bg-white border-slate-200 text-slate-700" : "bg-[#0b1d22] border-slate-800 text-slate-300"
                          }`}>
                            {aiSuggestions.adCopy}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={launchCampaign}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95"
                      >
                        <CheckCircle className="h-4 w-4" /> Kampanyayı Canlıya Al (10 Saniyede Yayında)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={`lg:col-span-5 p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h3 className="font-black text-base mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  Aktif Reklam Kampanyaları & ROAS
                </h3>

                <div className="flex flex-col gap-3">
                  {campaigns.map(camp => (
                    <div key={camp.id} className={`p-4 rounded-2xl border text-xs ${
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
              <div className={`lg:col-span-8 p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h3 className="font-black text-base mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-rose-500" />
                  Aktif Siber Güvenlik ve Moderasyon Alarmları
                </h3>

                <div className="flex flex-col gap-4">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-5 rounded-3xl border flex flex-col gap-4 ${
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

                      <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
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
                              className="px-4 py-2 rounded-2xl bg-[#0a1e22] text-white hover:bg-[#133e42] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
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

              <div className={`lg:col-span-4 p-6 rounded-3xl border transition-all flex flex-col gap-6 ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h4 className="font-black text-sm flex items-center gap-2">
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
              <div className={`lg:col-span-8 p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h3 className="font-black text-base mb-6">Detaylı Platform Etkileşim Hacmi</h3>
                <div className="h-64 flex items-end justify-between gap-4 px-4 pt-4 border-b border-slate-200 dark:border-slate-800">
                  {wavePoints1.slice(-10).map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <span className="text-[10px] font-mono text-slate-400 mb-1">{val * 10}k</span>
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-teal-600 to-teal-400 transition-all duration-300"
                        style={{ height: `${val * 2}%` }}
                      ></div>
                      <span className="text-[10px] text-slate-400 mt-2 font-mono">12:0{idx}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-4 p-6 rounded-3xl border transition-all ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
              }`}>
                <h4 className="font-black text-sm mb-4">Popüler Kategori Trendleri</h4>
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
            <div className={`p-8 rounded-3xl border transition-all ${
              theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
            }`}>
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                Sıfır Bireysel Profilleme & KVKK Güvenlik Uyumluluğu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                NABIZ Platformu; KVKK Madde 5 ve 6 çerçevesinde geliştirilmiş Sıfır Bireysel Profilleme (Zero-Profiling) prensibiyle çalışır. Kişisel veri ve üçüncü taraf çerezler kullanılmaz; yalnızca toplu tensör dağılımları işlenir.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102d33]">
                  <strong className="text-xs font-bold block mb-1">Kimliksizleştirme (SHA-256)</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed block">
                    Kullanıcı kimlikleri veri giriş boru hattında SHA-256 hash algoritmalarıyla anında temizlenir.
                  </span>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#102d33]">
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
                <div className={`p-4 rounded-3xl border sticky top-24 ${
                  theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
                }`}>
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-3">İçindekiler</h4>
                  <div className="flex flex-col gap-1.5 text-xs">
                    <button
                      onClick={() => setActiveReportSection("sec-1")}
                      className={`text-left py-2 px-3 rounded-2xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-1" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      1. Proje Özeti
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-2")}
                      className={`text-left py-2 px-3 rounded-2xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-2" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      2. Katma Değer & Yenilikçilik
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-3")}
                      className={`text-left py-2 px-3 rounded-2xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-3" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      3. Teknoloji & Matematik
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-4")}
                      className={`text-left py-2 px-3 rounded-2xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-4" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      4. Uygulanabilirlik & ROAS
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-6")}
                      className={`text-left py-2 px-3 rounded-2xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-6" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      6. Sürdürülebilirlik & Finans
                    </button>
                    <button
                      onClick={() => setActiveReportSection("sec-8")}
                      className={`text-left py-2 px-3 rounded-2xl font-bold transition-all cursor-pointer ${
                        activeReportSection === "sec-8" ? "bg-teal-500/10 text-teal-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      8. Takım & Kaynakça
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Text */}
              <div className={`lg:col-span-9 p-8 rounded-3xl border text-xs leading-relaxed ${
                theme === "light" ? "bg-white border-slate-200/80 shadow-md" : "bg-[#0d2227] border-slate-800"
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
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#102d33] border text-center font-serif text-sm">
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
                    <div className={`p-5 rounded-3xl border ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-[#102d33] border-slate-700"}`}>
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

                    <div className="border rounded-2xl overflow-hidden text-xs">
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
