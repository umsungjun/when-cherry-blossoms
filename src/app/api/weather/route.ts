import { NextRequest, NextResponse } from "next/server";

import { fetchWeather } from "@/lib/api/openmeteo";
import { calculatePetalFallRisk } from "@/lib/utils/petal-fall";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat, lng 필수" }, { status: 400 });
  }

  try {
    const weather = await fetchWeather(lat, lng);
    const today = weather.daily[0];
    const petalFallRisk = calculatePetalFallRisk({
      precipitationSum: today?.precipitationSum ?? 0,
      windspeedMax: today?.windspeedMax ?? 0,
      windgustsMax: today?.windgustsMax ?? 0,
    });

    return NextResponse.json({ ...weather, petalFallRisk });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "날씨 데이터 로드 실패" },
      { status: 500 }
    );
  }
}
