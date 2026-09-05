import { Matrix, Alert, Campaign, RadarData } from "../types";

export const getCityTopicMatrix = (): Matrix => ({
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

export const getAgeFormatMatrix = (): Matrix => ({
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

export const getInitialAlerts = (): Alert[] => [
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
];

export const getInitialCampaigns = (): Campaign[] => [
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
];

export const getInitialRadarData = (): RadarData => ({
  "İstanbul": 1.5,
  "Ankara": 0.67,
  "İzmir": 3.92,
  "Bursa": 1.0,
  "Antalya": 0.75,
});
