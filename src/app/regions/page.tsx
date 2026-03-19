"use client";

import { useMemo, useState } from "react";

import { RegionCard } from "@/components/regions/RegionCard";
import { REGIONS } from "@/lib/data/regions";
import { BLOOM_STATUS_LABEL, enrichRegion } from "@/lib/utils/bloom";
import { BloomStatus } from "@/types/region";

const STATUS_TABS: {
  key: BloomStatus | "all";
  label: string;
  emoji: string;
}[] = [
  { key: "all", label: "전체", emoji: "🗺️" },
  { key: "peak", label: BLOOM_STATUS_LABEL.peak, emoji: "🌸" },
  { key: "blooming", label: BLOOM_STATUS_LABEL.blooming, emoji: "🌷" },
  { key: "before", label: BLOOM_STATUS_LABEL.before, emoji: "🌱" },
  { key: "falling", label: BLOOM_STATUS_LABEL.falling, emoji: "🍃" },
  { key: "done", label: BLOOM_STATUS_LABEL.done, emoji: "🍂" },
];

export default function RegionsPage() {
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
    const c: Record<BloomStatus | "all", number> = {
      all: regions.length,
      before: 0,
      blooming: 0,
      peak: 0,
      falling: 0,
      done: 0,
    };
    regions.forEach((r) => c[r.status]++);
    return c;
  }, [regions]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-blossom-900 text-2xl font-extrabold">
          🗺️ 전국 벚꽃 예보
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          2025년 기상청 예보 기반 · 매시간 갱신
        </p>
      </div>

      {/* 상태 탭 필터 */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(({ key, label, emoji }) => {
          const count = counts[key];
          if (key !== "all" && count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-blossom-600 text-white shadow-sm"
                  : "border-blossom-200 hover:border-blossom-300 hover:bg-blossom-50 border bg-white text-gray-600"
              }`}
            >
              {emoji} {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 지역 그리드 */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          해당 상태의 지역이 없어요
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RegionCard key={r.id} region={r} />
          ))}
        </div>
      )}
    </div>
  );
}
