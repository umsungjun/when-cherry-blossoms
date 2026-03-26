import type { Metadata } from "next";

import { RegionsClient } from "@/components/regions/RegionsClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getAIPredictions } from "@/lib/api/prediction";
import { REGIONS } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";

export const metadata: Metadata = {
  title: "전국 벚꽃 개화 현황",
  description:
    "서울, 부산, 제주 등 전국 16개 지역의 벚꽃 개화 시기와 만개 날짜를 한눈에 비교하세요. AI 예측과 기상청 데이터를 함께 제공합니다.",
  alternates: {
    canonical: "/regions",
  },
};

// Vercel Cron으로 하루 1회 AI 예측 갱신 → 24시간 간격으로 재생성
export const revalidate = 86400;

export default async function RegionsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const regions = REGIONS.map((r) => enrichRegion(r, today));
  const { data: predictions, updatedAt } = await getAIPredictions(regions);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "https://when-cherry-blossoms.vercel.app" },
          {
            name: "전국 개화 현황",
            url: "https://when-cherry-blossoms.vercel.app/regions",
          },
        ]}
      />
      <RegionsClient predictions={predictions} updatedAt={updatedAt} />
    </>
  );
}
