import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { BloomTimeline } from "@/components/regions/BloomTimeline";
import { DDay } from "@/components/ui/DDay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils/cn";
import { RISK_COLOR, RISK_LABEL } from "@/lib/utils/petal-fall";
import { RegionWithStatus } from "@/types/region";

interface Props {
  region: RegionWithStatus;
  className?: string;
}

export function RegionCard({ region, className }: Props) {
  return (
    <Link href={`/regions/${region.id}`}>
      <div
        className={cn(
          "card card-hover cursor-pointer space-y-3 p-4",
          region.status === "peak" && "border-blossom-300 shadow-blossom-100",
          className
        )}
      >
        {/* 상단: 지역명 + 상태 배지 */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-blossom-900 text-base font-bold">
              {region.name}
            </h3>
            <p className="text-xs text-gray-400">{region.province}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={region.status} />
            <ChevronRight size={14} className="text-gray-300" />
          </div>
        </div>

        {/* 개화 타임라인 */}
        <BloomTimeline region={region} />

        {/* 하단: D-Day + 낙화위험도 */}
        <div className="flex items-center justify-between">
          <DDay
            status={region.status}
            daysUntilBloom={region.daysUntilBloom}
            daysUntilPeak={region.daysUntilPeak}
            daysUntilFall={region.daysUntilFall}
          />
          {region.petalFallRisk && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                RISK_COLOR[region.petalFallRisk.level]
              )}
            >
              낙화 {RISK_LABEL[region.petalFallRisk.level]}
            </span>
          )}
        </div>

        {/* 명소 */}
        {region.famousSpots.length > 0 && (
          <p className="truncate text-xs text-gray-400">
            📍 {region.famousSpots[0]}
          </p>
        )}
      </div>
    </Link>
  );
}
