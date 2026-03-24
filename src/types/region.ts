export type BloomStatus = "before" | "blooming" | "peak" | "falling" | "done";

export interface DateInfo {
  month: number;
  day: number;
}

export interface FamousSpot {
  name: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
}

export interface Region {
  id: string;
  name: string;
  englishName: string;
  lat: number;
  lng: number;
  province: string;
  bloom?: DateInfo;
  peak?: DateInfo;
  fall?: DateInfo;
  famousSpots: FamousSpot[];
}

export interface PetalFallRisk {
  score: number; // 0-100
  level: "low" | "medium" | "high" | "extreme";
  mainFactor: "rain" | "wind" | "both";
  rainContribution: number; // 0-100%
  windContribution: number; // 0-100%
  recommendation: string;
}

export interface RegionWithStatus extends Region {
  status: BloomStatus | "unknown";
  daysUntilBloom: number | null;
  daysUntilPeak: number | null;
  daysUntilFall: number | null;
  bloomProgress: number; // 0-100, 데이터 없으면 0
  petalFallRisk?: PetalFallRisk;
}
