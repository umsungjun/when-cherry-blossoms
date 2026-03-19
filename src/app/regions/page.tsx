"use client";

import { useMemo, useState } from "react";

import { Flower, Flower2, Leaf, Map, Sprout } from "lucide-react";

import { RegionCard } from "@/components/regions/RegionCard";
import { REGIONS } from "@/lib/data/regions";
import { BLOOM_STATUS_LABEL, enrichRegion } from "@/lib/utils/bloom";
import { BloomStatus } from "@/types/region";

const STATUS_TABS: { key: BloomStatus | "all"; label: string; icon: React.ReactNode }[] = [
  { key: "all",     label: "전체",                      icon: <Map     size={13} /> },
  { key: "peak",    label: BLOOM_STATUS_LABEL.peak,    icon: <Flower2 size={13} /> },
  { key: "blooming",label: BLOOM_STATUS_LABEL.blooming,icon: <Flower  size={13} /> },
  { key: "before",  label: BLOOM_STATUS_LABEL.before,  icon: <Sprout  size={13} /> },
  { key: "falling", label: BLOOM_STATUS_LABEL.falling, icon: <Leaf    size={13} /> },
  { key: "done",    label: BLOOM_STATUS_LABEL.done,    icon: <Leaf    size={13} className="opacity-40" /> },
];

export default function RegionsPage() {
  const [activeTab, setActiveTab] = useState<BloomStatus | "all">("all");

  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const regions = useMemo(() => REGIONS.map((r) => enrichRegion(r, today)), [today]);
  const filtered = useMemo(() => activeTab === "all" ? regions : regions.filter((r) => r.status === activeTab), [regions, activeTab]);
  const counts = useMemo(() => {
    const c: Record<BloomStatus | "all", number> = { all: regions.length, before: 0, blooming: 0, peak: 0, falling: 0, done: 0 };
    regions.forEach((r) => c[r.status]++);
    return c;
  }, [regions]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[#ffd6e8]">
          <Map size={22} className="text-[#ff4da6]" />
          전국 벚꽃 예보
        </h1>
        <p className="mt-1 text-sm text-[#9e6a7e]">2026년 기상청 예보 기반 · 매시간 갱신</p>
      </div>

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
                  : "border border-[rgba(255,77,166,0.2)] bg-sakura-900 text-[#c090a8] hover:border-[#ff4da6] hover:text-[#ff4da6]"
              }`}
            >
              {icon} {label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === key ? "bg-white/20 text-white" : "bg-sakura-800 text-[#9e6a7e]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#9e6a7e]">해당 상태의 지역이 없어요</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => <RegionCard key={r.id} region={r} />)}
        </div>
      )}
    </div>
  );
}
