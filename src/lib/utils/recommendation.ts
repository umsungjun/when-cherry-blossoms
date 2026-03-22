import { PetalFallRisk, Region, RegionWithStatus } from "@/types/region";

import { enrichRegion } from "./bloom";
import { getToday } from "./date";
import { calculatePetalFallRisk } from "./petal-fall";

interface WeatherInput {
  precipitationSum: number;
  windspeedMax: number;
  windgustsMax: number;
}

interface ScoredRegion {
  region: RegionWithStatus;
  score: number;
  reasons: string[];
  petalFallRisk: PetalFallRisk;
}

/**
 * 오늘 방문하기 좋은 지역 스코어링
 * - 개화 상태 (0-50pt)
 * - 날씨 (0-30pt)
 * - 만개 근접 보너스 (0-10pt)
 * - 커뮤니티 활성도는 API route에서 추가
 */
export function scoreRegion(
  region: Region,
  weather: WeatherInput,
  today?: Date
): ScoredRegion {
  const now = today ?? getToday();
  const enriched = enrichRegion(region, now);
  const risk = calculatePetalFallRisk(weather);

  let score = 0;
  const reasons: string[] = [];

  // 개화 상태 점수
  const statusScore: Record<string, number> = {
    before: 0,
    blooming: 35,
    peak: 50,
    falling: 20,
    done: 0,
  };
  score += statusScore[enriched.status] ?? 0;

  if (enriched.status === "peak") reasons.push("🌸 지금 만개!");
  else if (enriched.status === "blooming") reasons.push("🌷 개화 중");
  else if (enriched.status === "falling") reasons.push("🍃 낙화 중");

  // 날씨 점수 (낙화 위험도 역수)
  const weatherScore = Math.round((1 - risk.score / 100) * 30);
  score += weatherScore;
  if (risk.level === "low") reasons.push("☀️ 맑은 날씨");
  else if (risk.level === "medium") reasons.push("⛅ 날씨 양호");

  // 만개 D-1 ~ D-3 보너스
  if (
    enriched.daysUntilPeak !== null &&
    enriched.daysUntilPeak >= 0 &&
    enriched.daysUntilPeak <= 3
  ) {
    score += 10;
    reasons.push(
      `📅 만개까지 ${enriched.daysUntilPeak === 0 ? "오늘" : `D-${enriched.daysUntilPeak}`}`
    );
  }

  return {
    region: enriched,
    score: Math.min(100, score),
    reasons,
    petalFallRisk: risk,
  };
}
