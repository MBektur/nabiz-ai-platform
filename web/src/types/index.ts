export interface CellData {
  volume: number;
  mean: number;
  std: number;
  zScore: number;
  sentiment: number;
  isAnomaly: boolean;
  isOpportunity: boolean;
  details?: string;
}

export interface Matrix {
  [row: string]: {
    [col: string]: CellData;
  };
}

export interface Alert {
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

export interface Campaign {
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

export type PanelType = "dashboard" | "ads" | "sense" | "analytics" | "privacy" | "report";
export type WingType = "all" | "sense" | "ads";
export type DimensionType = "city_topic" | "age_format";
export type ThemeType = "light" | "dark";

export interface ToastData {
  message: string;
  type: "success" | "info" | "alert";
}

export interface AiSuggestions {
  city: string;
  category: string;
  age: string;
  budget: number;
  adCopy: string;
  timeWindow: string;
  targetMatches: string[];
}

export type RadarData = { [city: string]: number };
