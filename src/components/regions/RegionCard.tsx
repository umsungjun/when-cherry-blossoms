import Link from "next/link";

import { ChevronRight, MapPin } from "lucide-react";

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
          region.status === "peak" && "border-[rgba(255,77,166,0.5)]",
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#ffd6e8]">{region.name}</h3>
            <p className="text-xs text-[#9e6a7e]">{region.province}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={region.status} />
            <ChevronRight size={14} className="text-[#5a3048]" />
          </div>
        </div>

        <BloomTimeline region={region} />

        <div className="flex items-center justify-between">
          <DDay
            status={region.status}
            daysUntilBloom={region.daysUntilBloom}
            daysUntilPeak={region.daysUntilPeak}
            daysUntilFall={region.daysUntilFall}
          />
          {region.petalFallRisk && (
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", RISK_COLOR[region.petalFallRisk.level])}>
              낙화 {RISK_LABEL[region.petalFallRisk.level]}
            </span>
          )}
        </div>

        {region.famousSpots.length > 0 && (
          <p className="flex items-center gap-1 truncate text-xs text-[#9e6a7e]">
            <MapPin size={11} className="shrink-0 text-[#ff4da6]" />
            {region.famousSpots[0]}
          </p>
        )}
      </div>
    </Link>
  );
}
