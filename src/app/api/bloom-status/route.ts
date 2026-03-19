import { NextRequest, NextResponse } from "next/server";

import { REGIONS } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get("date");
  const today = dateParam ? new Date(dateParam) : new Date();
  today.setHours(0, 0, 0, 0);

  const regions = REGIONS.map((r) => enrichRegion(r, today));

  return NextResponse.json({ regions, date: today.toISOString() });
}
