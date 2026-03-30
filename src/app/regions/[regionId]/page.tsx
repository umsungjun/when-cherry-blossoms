import { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionDetailClient } from "@/components/regions/RegionDetailClient";
import { BreadcrumbJsonLd, RegionJsonLd } from "@/components/seo/JsonLd";
import { getKmaBloomData, getKmaConfirmedIds, mergeKmaData } from "@/lib/api/kma";
import { getAIPredictions } from "@/lib/api/prediction";
import { REGIONS, getRegionById } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";
import { formatMonthDay } from "@/lib/utils/date";

interface Props {
  params: Promise<{ regionId: string }>;
}

// 기상청 데이터 반영을 위해 24시간마다 재생성
export const revalidate = 86400;

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ regionId: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) return {};

  const bloomStr = region.bloom
    ? `개화일 ${formatMonthDay(region.bloom)}, `
    : "";
  const peakStr = region.peak ? `만개일 ${formatMonthDay(region.peak)}. ` : "";

  return {
    title: `${region.name} 벚꽃 개화 시기`,
    description: `${region.name} 벚꽃 ${bloomStr}${peakStr}낙화 위험도와 현장 이야기를 확인하세요.`,
    alternates: {
      canonical: `/regions/${regionId}`,
    },
  };
}

export default async function RegionDetailPage({ params }: Props) {
  const { regionId } = await params;
  const baseRegion = getRegionById(regionId);
  if (!baseRegion) notFound();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 기상청 개화 데이터 병합
  const kmaData = await getKmaBloomData();
  const [region] = mergeKmaData([baseRegion], kmaData);
  const enriched = enrichRegion(region, today);

  // AI 낙화 예측 (기상청은 낙화 미제공)
  const kmaConfirmedIds = getKmaConfirmedIds(kmaData);
  const { data: predictions } = await getAIPredictions([enriched], { kmaConfirmedIds });
  const aiFall = predictions[regionId]?.fall;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "홈", url: "https://when-cherry-blossoms.vercel.app" },
          {
            name: "전국 개화 현황",
            url: "https://when-cherry-blossoms.vercel.app/regions",
          },
          {
            name: `${region.name} 벚꽃`,
            url: `https://when-cherry-blossoms.vercel.app/regions/${region.id}`,
          },
        ]}
      />
      <RegionJsonLd regionId={region.id} />
      <RegionDetailClient region={enriched} aiFall={aiFall} />
    </>
  );
}
