import { NextResponse } from "next/server";

import { fetchWeather } from "@/lib/api/openmeteo";
import { REGIONS } from "@/lib/data/regions";
import { scoreRegion } from "@/lib/utils/recommendation";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 개화 시즌 지역만 필터 (기상청 데이터 없는 지역 제외 + before/done 제외 + before 중 7일 이내)
  const candidates = REGIONS.filter((r) => {
    if (!r.bloom || !r.fall) return false;
    const bloomDate = new Date(
      today.getFullYear(),
      r.bloom.month - 1,
      r.bloom.day
    );
    const doneDate = new Date(
      today.getFullYear(),
      r.fall.month - 1,
      r.fall.day + 5
    );
    const daysToBloom = Math.round(
      (bloomDate.getTime() - today.getTime()) / 86400000
    );
    return today <= doneDate && daysToBloom <= 7;
  });

  if (candidates.length === 0) {
    return NextResponse.json({ topRegions: [], date: today.toISOString() });
  }

  // 병렬 날씨 fetch (최대 8개 지역)
  const targets = candidates.slice(0, 8);
  const weatherResults = await Promise.allSettled(
    targets.map((r) => fetchWeather(r.lat, r.lng))
  );

  const scored = targets.map((region, i) => {
    const weatherResult = weatherResults[i];
    const weather =
      weatherResult.status === "fulfilled" && weatherResult.value.daily[0]
        ? {
            precipitationSum: weatherResult.value.daily[0].precipitationSum,
            windspeedMax: weatherResult.value.daily[0].windspeedMax,
            windgustsMax: weatherResult.value.daily[0].windgustsMax,
          }
        : { precipitationSum: 0, windspeedMax: 0, windgustsMax: 0 };

    return scoreRegion(region, weather, today);
  });

  const topRegions = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return NextResponse.json({
    topRegions,
    date: today.toISOString(),
  });
}
