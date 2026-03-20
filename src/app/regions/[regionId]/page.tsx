import { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionDetailClient } from "@/components/regions/RegionDetailClient";
import { REGIONS, getRegionById } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";
import { formatMonthDay } from "@/lib/utils/date";

interface Props {
  params: Promise<{ regionId: string }>;
}

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ regionId: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) return {};

  return {
    title: `${region.name} 벚꽃 개화 시기`,
    description: `${region.name} 벚꽃 개화일 ${formatMonthDay(region.bloom)}, 만개일 ${formatMonthDay(region.peak)}. 낙화 위험도와 현장 이야기를 확인하세요.`,
  };
}

export default async function RegionDetailPage({ params }: Props) {
  const { regionId } = await params;
  const region = getRegionById(regionId);
  if (!region) notFound();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const enriched = enrichRegion(region, today);

  return <RegionDetailClient region={enriched} />;
}
