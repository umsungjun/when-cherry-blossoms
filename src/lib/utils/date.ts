import { DateInfo } from "@/types/region";

/** 올해 기준으로 DateInfo → Date 객체 */
export function toDate(info: DateInfo, year?: number): Date {
  const y = year ?? new Date().getFullYear();
  return new Date(y, info.month - 1, info.day);
}

/** 두 날짜 사이의 일 수 차이 (target - base) */
export function diffDays(base: Date, target: Date): number {
  const ms = target.getTime() - base.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** D-Day 문자열 반환 */
export function formatDDay(days: number): string {
  if (days === 0) return "D-Day";
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
}

/** "4월 10일" 형태 */
export function formatMonthDay(info: DateInfo): string {
  return `${info.month}월 ${info.day}일`;
}

/** 날짜 범위 안에 있는지 */
export function isInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/** "오늘" 기준 날짜 반환 (테스트 시 오버라이드 가능) */
export function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** ISO date string → "4월 10일" */
export function isoToMonthDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** timestamp → "N분/시간/일 전" */
export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
