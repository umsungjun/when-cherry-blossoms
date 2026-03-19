import { BloomStatus, Region, RegionWithStatus } from "@/types/region";

import { diffDays, getToday, toDate } from "./date";

/** 오늘 날짜 기준 개화 상태 계산 */
export function getBloomStatus(region: Region, today?: Date): BloomStatus {
  const now = today ?? getToday();
  const bloomDate = toDate(region.bloom);
  const peakDate = toDate(region.peak);
  const fallDate = toDate(region.fall);

  // 낙화 완료 (낙화일 + 5일 후)
  const doneDate = new Date(fallDate);
  doneDate.setDate(doneDate.getDate() + 5);

  if (now < bloomDate) return "before";
  if (now < peakDate) return "blooming";
  if (now < fallDate) return "peak";
  if (now < doneDate) return "falling";
  return "done";
}

/** 개화 진행률 0-100 계산 */
export function getBloomProgress(region: Region, today?: Date): number {
  const now = today ?? getToday();
  const bloomDate = toDate(region.bloom);
  const fallDate = toDate(region.fall);

  if (now < bloomDate) return 0;

  const totalDays = diffDays(bloomDate, fallDate);
  const elapsedDays = diffDays(bloomDate, now);
  const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  return Math.round(progress);
}

/** Region → RegionWithStatus (날씨 없이) */
export function enrichRegion(region: Region, today?: Date): RegionWithStatus {
  const now = today ?? getToday();
  const status = getBloomStatus(region, now);
  const progress = getBloomProgress(region, now);

  const bloomDate = toDate(region.bloom);
  const peakDate = toDate(region.peak);
  const fallDate = toDate(region.fall);

  return {
    ...region,
    status,
    bloomProgress: progress,
    daysUntilBloom: diffDays(now, bloomDate),
    daysUntilPeak: diffDays(now, peakDate),
    daysUntilFall: diffDays(now, fallDate),
  };
}

/** 상태별 한글 레이블 */
export const BLOOM_STATUS_LABEL: Record<BloomStatus, string> = {
  before: "개화 전",
  blooming: "개화 중",
  peak: "만개",
  falling: "낙화 중",
  done: "종료",
};

/** 상태별 색상 클래스 */
export const BLOOM_STATUS_COLOR: Record<BloomStatus, string> = {
  before: "text-gray-500 bg-gray-100",
  blooming: "text-blossom-400 bg-blossom-50",
  peak: "text-blossom-600 bg-blossom-100",
  falling: "text-orange-500 bg-orange-50",
  done: "text-gray-400 bg-gray-50",
};
