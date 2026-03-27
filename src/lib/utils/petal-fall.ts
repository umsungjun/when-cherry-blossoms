import { PetalFallRisk } from "@/types/region";
import { DailyForecast } from "@/types/weather";

interface RiskInput {
  precipitationSum: number; // mm
  windspeedMax: number; // km/h
  windgustsMax: number; // km/h
}

/**
 * 낙화 위험도 스코어 계산
 *
 * 강수가 꽃잎을 무겁게 만들고, 돌풍이 낙화를 직접 유발.
 * 비+바람 시너지: 젖은 꽃잎은 바람에 2-3배 더 취약.
 */
export function calculatePetalFallRisk(input: RiskInput): PetalFallRisk {
  const { precipitationSum, windspeedMax, windgustsMax } = input;

  // 각 요소별 점수
  const rainScore = Math.min(40, precipitationSum * 8);
  const windScore = Math.min(35, windspeedMax * 0.8);
  const gustScore = Math.min(25, windgustsMax * 0.6);

  // 비+바람 시너지 (비 2mm 이상 + 풍속 15km/h 이상)
  const synergyBonus =
    precipitationSum > 2 && windspeedMax > 15
      ? Math.min(15, precipitationSum * windspeedMax * 0.05)
      : 0;

  const totalScore = Math.min(
    100,
    rainScore + windScore + gustScore + synergyBonus
  );
  const score = Math.round(totalScore);

  const level =
    score < 25
      ? "low"
      : score < 50
        ? "medium"
        : score < 75
          ? "high"
          : "extreme";

  const windTotal = windScore + gustScore;
  const mainFactor =
    rainScore > windTotal * 1.2
      ? "rain"
      : windTotal > rainScore * 1.2
        ? "wind"
        : "both";

  // synergyBonus를 비/바람 기여도에 비례 배분해서 합이 항상 100%가 되도록 보정
  const rawSum = rainScore + windTotal;
  const rainWithSynergy =
    rawSum > 0 ? rainScore + synergyBonus * (rainScore / rawSum) : 0;
  const windWithSynergy =
    rawSum > 0 ? windTotal + synergyBonus * (windTotal / rawSum) : 0;
  const rainPct =
    score > 0 ? Math.round((rainWithSynergy / totalScore) * 100) : 0;
  const windPct =
    score > 0
      ? Math.min(
          100 - rainPct,
          Math.round((windWithSynergy / totalScore) * 100)
        )
      : 0;

  const recommendation =
    level === "low"
      ? "꽃구경 하기 좋은 날씨예요 🌸"
      : level === "medium"
        ? "바람이 살짝 있어요. 서두르세요!"
        : level === "high"
          ? "비 또는 강풍으로 낙화 위험이 높아요"
          : "오늘은 꽃잎이 모두 질 수 있어요 🌧️";

  return {
    score,
    level,
    mainFactor,
    rainContribution: rainPct,
    windContribution: windPct,
    recommendation,
  };
}

/** 7일 예보에서 오늘(index 0) 위험도 반환 */
export function getTodayRisk(daily: DailyForecast[]): PetalFallRisk {
  const today = daily[0];
  if (!today) {
    return calculatePetalFallRisk({
      precipitationSum: 0,
      windspeedMax: 0,
      windgustsMax: 0,
    });
  }
  return calculatePetalFallRisk({
    precipitationSum: today.precipitationSum,
    windspeedMax: today.windspeedMax,
    windgustsMax: today.windgustsMax,
  });
}

/** 위험도 레이블 */
export const RISK_LABEL: Record<PetalFallRisk["level"], string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  extreme: "매우 높음",
};

/** 위험도 색상 클래스 — CSS 변수로 라이트/다크 자동 전환 */
export const RISK_COLOR: Record<PetalFallRisk["level"], string> = {
  low: "text-risk-low-text bg-risk-low-bg",
  medium: "text-risk-medium-text bg-risk-medium-bg",
  high: "text-risk-high-text bg-risk-high-bg",
  extreme: "text-risk-extreme-text bg-risk-extreme-bg",
};
