import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import {
  getKmaBloomData,
  getKmaConfirmedIds,
  mergeKmaData,
} from "@/lib/api/kma";
import { getAIPredictions } from "@/lib/api/prediction";
import { REGIONS } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";

/**
 * Vercel Cron으로 매일 1회 데이터 갱신
 * 1) 기상청 개화 현황 fetch
 * 2) KMA 데이터 반영 후 AI 예측 갱신
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1단계: 기상청 개화 현황 갱신
    const kmaData = await getKmaBloomData({ forceRefresh: true });
    const kmaBloomedCount = Object.values(kmaData).filter(
      (d) => d.status !== "before"
    ).length;

    // 2단계: KMA 데이터를 지역에 병합 후 AI 예측 갱신
    const mergedRegions = mergeKmaData([...REGIONS], kmaData);
    const regions = mergedRegions.map((r) => enrichRegion(r, today));
    const kmaConfirmedIds = getKmaConfirmedIds(kmaData);
    const predictions = await getAIPredictions(regions, {
      forceRefresh: true,
      kmaConfirmedIds,
    });

    // 3단계: 캐시 갱신 후 ISR 재검증 트리거
    revalidatePath("/");
    revalidatePath("/regions");
    for (const region of REGIONS) {
      revalidatePath(`/regions/${region.id}`);
    }

    return NextResponse.json({
      success: true,
      kma: { mapped: Object.keys(kmaData).length, bloomed: kmaBloomedCount },
      ai: { regionsUpdated: Object.keys(predictions.data).length },
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Cron update-predictions failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
