import { BloomStatus, Region, RegionWithStatus } from "@/types/region";

import { diffDays, getToday, toDate } from "./date";

/** 개화 데이터가 하나라도 있는지 (bloom 또는 peak) */
function hasBloomData(region: Region): boolean {
  return !!(region.bloom || region.peak);
}

/** 오늘 날짜 기준 개화 상태 계산 */
export function getBloomStatus(
  region: Region,
  today?: Date
): BloomStatus | "unknown" {
  if (!hasBloomData(region)) return "unknown";

  const now = today ?? getToday();

  // bloom만 있을 때: before/blooming만 판단
  if (region.bloom && !region.peak) {
    return now < toDate(region.bloom) ? "before" : "blooming";
  }

  const bloomDate = region.bloom ? toDate(region.bloom) : null;
  const peakDate = toDate(region.peak!);

  if (bloomDate && now < bloomDate) return "before";
  if (now < peakDate) return "blooming";

  // fall이 없으면 peak 이후 상태를 peak으로 유지
  if (!region.fall) return "peak";

  const fallDate = toDate(region.fall);
  const doneDate = new Date(fallDate);
  doneDate.setDate(doneDate.getDate() + 5);

  if (now < fallDate) return "peak";
  if (now < doneDate) return "falling";
  return "done";
}

/** 개화 진행률 0-100 계산 */
export function getBloomProgress(region: Region, today?: Date): number {
  if (!hasBloomData(region)) return 0;
  if (!region.bloom) return 0;

  const now = today ?? getToday();
  const bloomDate = toDate(region.bloom);

  if (now < bloomDate) return 0;

  // fall이 없으면 peak 기준으로 진행률 계산 (peak = 50%)
  const endDate = region.fall
    ? toDate(region.fall)
    : region.peak
      ? toDate(region.peak)
      : bloomDate;

  const totalDays = diffDays(bloomDate, endDate);
  if (totalDays <= 0) return region.fall ? 100 : 50;

  const elapsedDays = diffDays(bloomDate, now);
  const maxPct = region.fall ? 100 : 50; // fall 없으면 50%까지만
  const progress = Math.min(maxPct, Math.max(0, (elapsedDays / totalDays) * maxPct));
  return Math.round(progress);
}

/** Region → RegionWithStatus (날씨 없이) */
export function enrichRegion(region: Region, today?: Date): RegionWithStatus {
  const now = today ?? getToday();
  const status = getBloomStatus(region, now);
  const progress = getBloomProgress(region, now);

  return {
    ...region,
    status,
    bloomProgress: progress,
    daysUntilBloom: region.bloom ? diffDays(now, toDate(region.bloom)) : null,
    daysUntilPeak: region.peak ? diffDays(now, toDate(region.peak)) : null,
    daysUntilFall: region.fall ? diffDays(now, toDate(region.fall)) : null,
  };
}

/** 상태별 한글 레이블 */
export const BLOOM_STATUS_LABEL: Record<BloomStatus | "unknown", string> = {
  before: "개화 전",
  blooming: "개화 중",
  peak: "만개",
  falling: "낙화 중",
  done: "종료",
  unknown: "미정",
};

/** 상태별 색상 클래스 */
export const BLOOM_STATUS_COLOR: Record<BloomStatus | "unknown", string> = {
  before: "text-text-muted bg-sakura-800",
  blooming: "text-accent-light bg-sakura-700",
  peak: "text-[#ff4da6] bg-sakura-700",
  falling: "text-orange-400 bg-status-falling-bg",
  done: "text-text-dim bg-sakura-800",
  unknown: "text-text-muted bg-sakura-800",
};
