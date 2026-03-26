import { NextRequest, NextResponse } from "next/server";

import { getAIPredictions } from "@/lib/api/prediction";
import { REGIONS } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";

/**
 * Vercel Cron으로 매일 1회 AI 예측 데이터 갱신
 * CRON_SECRET 헤더로 외부 무단 호출 차단
 */
export async function GET(req: NextRequest) {
  // Vercel Cron은 Authorization 헤더에 Bearer <CRON_SECRET> 전송
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const regions = REGIONS.map((r) => enrichRegion(r, today));
    // forceRefresh=true로 캐시 무시하고 새로 예측
    const predictions = await getAIPredictions(regions, { forceRefresh: true });
    const count = Object.keys(predictions).length;

    return NextResponse.json({
      success: true,
      regionsUpdated: count,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Cron update-predictions failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
