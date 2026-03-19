export type BloomStatus = "before" | "blooming" | "peak" | "falling" | "done";

export interface DateInfo {
  month: number;
  day: number;
}

export interface Region {
  id: string;
  name: string;
  englishName: string;
  lat: number;
  lng: number;
  province: string;
  bloom: DateInfo;
  peak: DateInfo;
  fall: DateInfo;
  famousSpots: string[];
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
  status: BloomStatus;
  daysUntilBloom: number;
  daysUntilPeak: number;
  daysUntilFall: number;
  bloomProgress: number; // 0-100
  petalFallRisk?: PetalFallRisk;
}
