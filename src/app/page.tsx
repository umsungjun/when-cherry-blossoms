import Link from "next/link";

import { BarChart3, Bot, Flower, Flower2, Leaf, Map, Sparkles, Sprout } from "lucide-react";

import { HeroSection } from "@/components/home/HeroSection";
import { RegionCard } from "@/components/regions/RegionCard";
import { REGIONS } from "@/lib/data/regions";
import { BLOOM_STATUS_LABEL, enrichRegion } from "@/lib/utils/bloom";
import { BloomStatus } from "@/types/region";

export const revalidate = 3600;

export default function HomePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const regions = REGIONS.map((r) => enrichRegion(r, today));

  const topRegions = regions
    .filter((r) => r.status === "peak" || r.status === "blooming")
    .sort((a, b) => {
      if (a.status === "peak" && b.status !== "peak") return -1;
      if (b.status === "peak" && a.status !== "peak") return 1;
      return a.daysUntilFall - b.daysUntilFall;
    })
    .slice(0, 3);

  const stats: Record<BloomStatus, number> = { before: 0, blooming: 0, peak: 0, falling: 0, done: 0 };
  regions.forEach((r) => stats[r.status]++);

  const activeStats = (
    [
      { key: "peak"    as BloomStatus, icon: <Flower2 size={13} />, color: "text-[#ff4da6] bg-[#4d1555]" },
      { key: "blooming"as BloomStatus, icon: <Flower  size={13} />, color: "text-[#ff80c0] bg-[#3d1545]" },
      { key: "before"  as BloomStatus, icon: <Sprout  size={13} />, color: "text-[#9e6a7e] bg-[#2d1535]" },
      { key: "falling" as BloomStatus, icon: <Leaf    size={13} />, color: "text-orange-400 bg-[#3d2020]" },
    ] as const
  ).filter((s) => stats[s.key] > 0);

  return (
    <>
      <HeroSection />

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        {/* 전국 현황 */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#ffd6e8]">
            <BarChart3 size={18} className="text-[#ff4da6]" />
            전국 벚꽃 현황
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeStats.map(({ key, icon, color }) => (
              <span key={key} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${color}`}>
                {icon} {BLOOM_STATUS_LABEL[key]} {stats[key]}곳
              </span>
            ))}
          </div>
        </section>

        {/* 오늘 추천 */}
        {topRegions.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#ffd6e8]">
                <Sparkles size={18} className="text-[#ff4da6]" />
                오늘 가기 좋은 곳
              </h2>
              <Link href="/regions" className="text-xs text-[#9e6a7e] transition-colors hover:text-[#ff4da6]">
                전체 보기 →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topRegions.map((r) => <RegionCard key={r.id} region={r} />)}
            </div>
          </section>
        )}

        {/* AI 챗봇 배너 */}
        <section>
          <Link href="/chatbot">
            <div className="card card-hover cursor-pointer overflow-hidden">
              <div className="p-5" style={{ background: "linear-gradient(135deg, #ff4da6 0%, #c2185b 100%)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium text-white/75">AI 도우미</p>
                    <h3 className="text-lg font-bold text-white">어디로 가면 좋을까요?</h3>
                    <p className="mt-1 text-sm text-white/80">Gemini 2.0 Flash가 지금 개화 상황으로 추천해드려요</p>
                  </div>
                  <Bot size={36} className="text-white opacity-20" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* 전국 지역 리스트 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#ffd6e8]">
              <Map size={18} className="text-[#ff4da6]" />
              전국 지역별 예보
            </h2>
            <Link href="/regions" className="text-xs text-[#9e6a7e] transition-colors hover:text-[#ff4da6]">
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regions.slice(0, 6).map((r) => <RegionCard key={r.id} region={r} />)}
          </div>
        </section>
      </div>
    </>
  );
}
