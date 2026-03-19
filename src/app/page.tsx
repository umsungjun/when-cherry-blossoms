import Link from "next/link";

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

  const stats: Record<BloomStatus, number> = {
    before: 0,
    blooming: 0,
    peak: 0,
    falling: 0,
    done: 0,
  };
  regions.forEach((r) => stats[r.status]++);

  const activeStats = (
    [
      {
        key: "peak" as BloomStatus,
        emoji: "🌸",
        color: "text-blossom-600 bg-blossom-100",
      },
      {
        key: "blooming" as BloomStatus,
        emoji: "🌷",
        color: "text-blossom-400 bg-blossom-50",
      },
      {
        key: "before" as BloomStatus,
        emoji: "🌱",
        color: "text-gray-500 bg-gray-100",
      },
      {
        key: "falling" as BloomStatus,
        emoji: "🍃",
        color: "text-orange-500 bg-orange-50",
      },
    ] as const
  ).filter((s) => stats[s.key] > 0);

  return (
    <>
      <HeroSection />

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
        {/* 전국 현황 배지 */}
        <section>
          <h2 className="text-blossom-900 mb-4 text-lg font-bold">
            📊 전국 벚꽃 현황
          </h2>
          <div className="flex flex-wrap gap-2">
            {activeStats.map(({ key, emoji, color }) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${color}`}
              >
                {emoji} {BLOOM_STATUS_LABEL[key]} {stats[key]}곳
              </span>
            ))}
          </div>
        </section>

        {/* 오늘 추천 */}
        {topRegions.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-blossom-900 text-lg font-bold">
                ✨ 오늘 가기 좋은 곳
              </h2>
              <Link
                href="/regions"
                className="text-blossom-400 hover:text-blossom-600 text-xs transition-colors"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topRegions.map((r) => (
                <RegionCard key={r.id} region={r} />
              ))}
            </div>
          </section>
        )}

        {/* AI 챗봇 배너 */}
        <section>
          <Link href="/chatbot">
            <div className="card card-hover cursor-pointer overflow-hidden">
              <div className="from-blossom-500 to-blossom-700 bg-gradient-to-r p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium opacity-80">
                      AI 벚꽃 도우미
                    </p>
                    <h3 className="text-lg font-bold">
                      어디로 가면 좋을까요? 🤖
                    </h3>
                    <p className="mt-1 text-sm opacity-80">
                      Gemini 2.0 Flash가 지금 개화 상황으로 추천해드려요
                    </p>
                  </div>
                  <span className="text-4xl opacity-90">🌸</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* 전국 지역 리스트 */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-blossom-900 text-lg font-bold">
              🗺️ 전국 지역별 예보
            </h2>
            <Link
              href="/regions"
              className="text-blossom-400 hover:text-blossom-600 text-xs transition-colors"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regions.slice(0, 6).map((r) => (
              <RegionCard key={r.id} region={r} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
