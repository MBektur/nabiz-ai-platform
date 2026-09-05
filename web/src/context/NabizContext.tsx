"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Matrix,
  Alert,
  Campaign,
  PanelType,
  WingType,
  DimensionType,
  ThemeType,
  ToastData,
  AiSuggestions,
  RadarData,
  CellData,
} from "../types";
import {
  getCityTopicMatrix,
  getAgeFormatMatrix,
  getInitialAlerts,
  getInitialCampaigns,
  getInitialRadarData,
} from "../data/mockData";

interface NabizContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType | ((prev: ThemeType) => ThemeType)) => void;
  currentPanel: PanelType;
  setCurrentPanel: (panel: PanelType) => void;
  activeWing: WingType;
  setActiveWing: (wing: WingType) => void;
  activeAxisDimension: DimensionType;
  setActiveAxisDimension: (dim: DimensionType) => void;
  activeReportSection: string;
  setActiveReportSection: (sec: string) => void;
  
  // Matrices & Selection
  cityMatrix: Matrix;
  setCityMatrix: React.Dispatch<React.SetStateAction<Matrix>>;
  ageMatrix: Matrix;
  setAgeMatrix: React.Dispatch<React.SetStateAction<Matrix>>;
  selectedCell: { row: string; col: string };
  setSelectedCell: (cell: { row: string; col: string }) => void;
  activeMatrix: Matrix;
  activeCellData: CellData;

  // Financial State
  financialSmeCount: number;
  setFinancialSmeCount: (count: number) => void;

  // Toast
  toast: ToastData | null;
  showToast: (message: string, type?: "success" | "info" | "alert") => void;
  hideToast: () => void;

  // Jury Tour
  isJuryTourRunning: boolean;
  runJuryAutoTour: () => void;

  // Wave points
  wavePoints1: number[];
  wavePoints2: number[];
  wavePoints3: number[];

  // Analytics KPIs
  totalSignalCount: string;
  anomalyCount: string;
  sentimentIndex: number;
  optimizedRoas: string;
  botBlockedCount: number;
  radarData: RadarData;
  sentimentNeedleAngle: number;
  radarPolygon: string;

  // Alerts & Actions
  alerts: Alert[];
  handleAction: (alertId: string, action: string) => void;

  // Campaigns & AI Wizard
  campaigns: Campaign[];
  promptInput: string;
  setPromptInput: (val: string) => void;
  aiSuggestions: AiSuggestions | null;
  generateAdCampaign: () => void;
  launchCampaign: () => void;
  handleQuickPrompt: (txt: string) => void;

  // Simulation Triggers
  triggerIzmirCrisis: () => void;
  triggerKadikoyOpportunity: () => void;
  triggerBursaBotAttack: () => void;
  resetAll: () => void;
}

const NabizContext = createContext<NabizContextType | undefined>(undefined);

export const NabizProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [currentPanel, setCurrentPanel] = useState<PanelType>("dashboard");
  const [activeWing, setActiveWing] = useState<WingType>("all");
  const [activeAxisDimension, setActiveAxisDimension] = useState<DimensionType>("city_topic");
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
  const [toast, setToast] = useState<ToastData | null>(null);

  // Jury Auto-Tour State
  const [isJuryTourRunning, setIsJuryTourRunning] = useState(false);

  // Real-time Solid Wave Points
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
  const [radarData, setRadarData] = useState<RadarData>(getInitialRadarData());

  // Alerts & Campaigns
  const [alerts, setAlerts] = useState<Alert[]>(getInitialAlerts());
  const [campaigns, setCampaigns] = useState<Campaign[]>(getInitialCampaigns());

  // AI Prompt & suggestions
  const [promptInput, setPromptInput] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestions | null>(null);

  const showToast = (message: string, type: "success" | "info" | "alert" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const hideToast = () => setToast(null);

  // Real-time animation loop
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

    showToast("İzmir Ulaşım Kriz Senaryosu Tetiklendi! (Z = +5.12, 3σ Eşiği Aşıldı)", "alert");
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
    showToast("Kadıköy Trend & Fırsat Senaryosu Aktif! (ROAS +%34)", "success");
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

    showToast("Bursa Bot Saldırısı DBSCAN Algoritması ile İzolasyona Alındı.", "info");
  };

  const resetAll = () => {
    setCityMatrix(getCityTopicMatrix());
    setAgeMatrix(getAgeFormatMatrix());
    setRadarData(getInitialRadarData());
    setAlerts(getInitialAlerts());
    setSelectedCell({ row: "İzmir", col: "#Ulaşım" });
    setTotalSignalCount("24.68M");
    setAnomalyCount("312.47K");
    setSentimentIndex(0.42);
    setOptimizedRoas("3.85x");
    showToast("Sistem Norm Referans Değerlerine Sıfırlandı.", "info");
  };

  const handleAction = (alertId: string, action: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: "RESOLVED" } : a))
    );
    showToast(`"${action}" aksiyonu 32 saniyede devreye alındı.`, "success");
  };

  // Automated Jury Tour Sequence
  const runJuryAutoTour = () => {
    setIsJuryTourRunning(true);
    showToast("Jüri Canlı Sunum Demosu Başlatıldı (12 Saniyelik Otomasyon)", "info");

    setTimeout(() => {
      triggerIzmirCrisis();
    }, 1500);

    setTimeout(() => {
      setCurrentPanel("sense");
      showToast("Kanat 1: NABIZ-Sense Siber Kalkanı ve LLM Kök Neden Analizi Açıldı.", "info");
    }, 4000);

    setTimeout(() => {
      handleAction("a1", "Topluluk Bildirilendirme Duyurusu Yayınla");
    }, 7000);

    setTimeout(() => {
      triggerKadikoyOpportunity();
      showToast("Kanat 2: NABIZ-Ads Doğal Dil Kampanya Motoru Devreye Alındı.", "success");
    }, 9500);

    setTimeout(() => {
      setIsJuryTourRunning(false);
      showToast("Jüri Canlı Sunum Demosu Başarıyla Tamamlandı.", "success");
    }, 13000);
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

    showToast("AI Reklam Parametreleri ve Hedef Kitle Eşlendi.", "success");
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
    showToast("Kampanya 12 Saniyede Canlıya Alındı! (ROAS 3.86x)", "success");
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
  const rIst = radarScale(radarData["İstanbul"] || 1.5);
  const rAnk = radarScale(radarData["Ankara"] || 0.67);
  const rIzm = radarScale(radarData["İzmir"] || 3.92);
  const rBur = radarScale(radarData["Bursa"] || 1.0);
  const rAnt = radarScale(radarData["Antalya"] || 0.75);

  const pIst = `100,${100 - rIst * 0.8}`;
  const pAnk = `${100 + rAnk * 0.76},${100 - rAnk * 0.25}`;
  const pIzm = `${100 + rIzm * 0.47},${100 + rIzm * 0.65}`;
  const pBur = `${100 - rBur * 0.47},${100 + rBur * 0.65}`;
  const pAnt = `${100 - rAnt * 0.76},${100 - rAnt * 0.25}`;
  const radarPolygon = `${pIst} ${pAnk} ${pIzm} ${pBur} ${pAnt}`;

  return (
    <NabizContext.Provider
      value={{
        theme,
        setTheme,
        currentPanel,
        setCurrentPanel,
        activeWing,
        setActiveWing,
        activeAxisDimension,
        setActiveAxisDimension,
        activeReportSection,
        setActiveReportSection,
        cityMatrix,
        setCityMatrix,
        ageMatrix,
        setAgeMatrix,
        selectedCell,
        setSelectedCell,
        activeMatrix,
        activeCellData,
        financialSmeCount,
        setFinancialSmeCount,
        toast,
        showToast,
        hideToast,
        isJuryTourRunning,
        runJuryAutoTour,
        wavePoints1,
        wavePoints2,
        wavePoints3,
        totalSignalCount,
        anomalyCount,
        sentimentIndex,
        optimizedRoas,
        botBlockedCount,
        radarData,
        sentimentNeedleAngle,
        radarPolygon,
        alerts,
        handleAction,
        campaigns,
        promptInput,
        setPromptInput,
        aiSuggestions,
        generateAdCampaign,
        launchCampaign,
        handleQuickPrompt,
        triggerIzmirCrisis,
        triggerKadikoyOpportunity,
        triggerBursaBotAttack,
        resetAll,
      }}
    >
      {children}
    </NabizContext.Provider>
  );
};

export const useNabiz = () => {
  const context = useContext(NabizContext);
  if (!context) {
    throw new Error("useNabiz must be used within a NabizProvider");
  }
  return context;
};
