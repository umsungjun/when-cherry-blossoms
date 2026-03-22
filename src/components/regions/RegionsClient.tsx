"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  ChevronRight,
  Flower,
  Flower2,
  Leaf,
  Map,
  MapPin,
  Sparkles,
  Sprout,
} from "lucide-react";

import { BloomTimeline } from "@/components/regions/BloomTimeline";
import { DDay } from "@/components/ui/DDay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RegionPrediction } from "@/lib/api/prediction";
import { REGIONS } from "@/lib/data/regions";
import { BLOOM_STATUS_LABEL, enrichRegion } from "@/lib/utils/bloom";
import { BloomStatus } from "@/types/region";

const STATUS_TABS: {
  key: BloomStatus | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "all", label: "전체", icon: <Map size={13} /> },
  { key: "peak", label: BLOOM_STATUS_LABEL.peak, icon: <Flower2 size={13} /> },
  {
    key: "blooming",
    label: BLOOM_STATUS_LABEL.blooming,
    icon: <Flower size={13} />,
  },
  {
    key: "before",
    label: BLOOM_STATUS_LABEL.before,
    icon: <Sprout size={13} />,
  },
  {
    key: "falling",
    label: BLOOM_STATUS_LABEL.falling,
    icon: <Leaf size={13} />,
  },
  {
    key: "done",
    label: BLOOM_STATUS_LABEL.done,
    icon: <Leaf size={13} className="opacity-40" />,
  },
];

interface Props {
  predictions: Record<string, RegionPrediction>;
}

export function RegionsClient({ predictions }: Props) {
  const [activeTab, setActiveTab] = useState<BloomStatus | "all">("all");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const regions = useMemo(
    () => REGIONS.map((r) => enrichRegion(r, today)),
    [today]
  );
  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? regions
        : regions.filter((r) => r.status === activeTab),
    [regions, activeTab]
  );
  const counts = useMemo(() => {
    const c: Record<BloomStatus | "unknown" | "all", number> = {
      all: regions.length,
      before: 0,
      blooming: 0,
      peak: 0,
      falling: 0,
      done: 0,
      unknown: 0,
    };
    regions.forEach((r) => c[r.status]++);
    return c;
  }, [regions]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-10">
      <div>
        <h1 className="text-text-primary flex items-center gap-2 text-2xl font-extrabold">
          <Map size={22} className="text-[#ff4da6]" />
          전국 벚꽃 예보
        </h1>
        <p className="text-text-muted mt-1 text-sm">
          2026년 기상청 예보 + AI 예측 · 3시간마다 갱신
        </p>
      </div>

      {/* 상태 탭 */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(({ key, label, icon }) => {
          const count = counts[key];
          if (key !== "all" && count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-[#ff4da6] text-white shadow-sm"
                  : "bg-sakura-900 text-text-secondary border border-[rgba(255,77,166,0.2)] hover:border-[#ff4da6] hover:text-[#ff4da6]"
              }`}
            >
              {icon} {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === key ? "bg-white/20 text-white" : "bg-sakura-800 text-text-muted"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
        <p className="text-text-muted py-16 text-center text-sm">
          해당 상태의 지역이 없어요
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const pred = predictions[r.id];
            return (
              <Link key={r.id} href={`/regions/${r.id}`}>
                <div className="card card-hover cursor-pointer space-y-3 p-5 transition-all">
                  {/* 헤더: 도시명 + 상태 배지 */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-text-primary text-base font-bold">
                        {r.name}
                      </h3>
                      <p className="text-text-muted text-xs">{r.province}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={r.status} />
                      <ChevronRight size={14} className="text-text-faint" />
                    </div>
                  </div>

                  {/* 타임라인 프로그레스 바 */}
                  <BloomTimeline region={r} />

                  {/* D-Day */}
                  <DDay
                    status={r.status}
                    daysUntilBloom={r.daysUntilBloom}
                    daysUntilPeak={r.daysUntilPeak}
                    daysUntilFall={r.daysUntilFall}
                  />

                  {/* 기상청 vs AI 비교 테이블 */}
                  <div className="space-y-1 text-xs">
                    <div className="text-text-muted grid grid-cols-4 gap-1 text-center">
                      <span className="text-left"></span>
                      <span>개화</span>
                      <span>만개</span>
                      <span>낙화</span>
                    </div>
                    <div className="bg-sakura-800 grid grid-cols-4 gap-1 rounded-md px-2 py-1.5 text-center">
                      <span className="text-text-muted text-left font-medium">
                        기상청
                      </span>
                      <span className="text-text-primary font-semibold">
                        {r.bloom ? `${r.bloom.month}/${r.bloom.day}` : "-"}
                      </span>
                      <span className="font-semibold text-[#ff4da6]">
                        {r.peak ? `${r.peak.month}/${r.peak.day}` : "-"}
                      </span>
                      <span className="text-text-secondary font-semibold">
                        {r.fall ? `${r.fall.month}/${r.fall.day}` : "-"}
                      </span>
                    </div>
                    <div className="bg-sakura-800 grid grid-cols-4 gap-1 rounded-md px-2 py-1.5 text-center">
                      <span className="text-left font-medium text-[#ff4da6]">
                        <Sparkles size={10} className="mr-0.5 inline" />
                        AI
                      </span>
                      <span className="text-text-primary font-semibold">
                        {pred?.bloom ?? "-"}
                      </span>
                      <span className="font-semibold text-[#ff4da6]">
                        {pred?.peak ?? "-"}
                      </span>
                      <span className="text-text-secondary font-semibold">
                        {pred?.fall ?? "-"}
                      </span>
                    </div>
                  </div>

                  {/* 명소 */}
                  {r.famousSpots.length > 0 && (
                    <p className="text-text-muted flex items-center gap-1 truncate text-xs">
                      <MapPin size={11} className="shrink-0 text-[#ff4da6]" />
                      {r.famousSpots.join(" · ")}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
