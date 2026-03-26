import Link from "next/link";

import {
  BarChart3,
  Bot,
  Clock,
  Flower,
  Flower2,
  Leaf,
  MapPin,
  Sparkles,
  Sprout,
} from "lucide-react";

import { HeroSection } from "@/components/home/HeroSection";
import { HomeJsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAIPredictions } from "@/lib/api/prediction";
import { REGIONS } from "@/lib/data/regions";
import { BLOOM_STATUS_LABEL, enrichRegion } from "@/lib/utils/bloom";
import { BloomStatus } from "@/types/region";

// Vercel Cron으로 하루 1회 AI 예측 갱신 → 24시간 간격으로 재생성
export const revalidate = 86400;

export default async function HomePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const regions = REGIONS.map((r) => enrichRegion(r, today));
  const { data: predictions, updatedAt } = await getAIPredictions(regions);
  const hasPredictions = Object.keys(predictions).length > 0;

  const stats: Record<BloomStatus | "unknown", number> = {
    before: 0,
    blooming: 0,
    peak: 0,
    falling: 0,
    done: 0,
    unknown: 0,
  };
  regions.forEach((r) => stats[r.status]++);

  const activeStats = (
    [
      {
        key: "peak" as BloomStatus,
        icon: <Flower2 size={13} />,
        color: "text-[#ff4da6] bg-sakura-700",
      },
      {
        key: "blooming" as BloomStatus,
        icon: <Flower size={13} />,
        color: "text-accent-light bg-sakura-700",
      },
      {
        key: "before" as BloomStatus,
        icon: <Sprout size={13} />,
        color: "text-text-muted bg-sakura-800",
      },
      {
        key: "falling" as BloomStatus,
        icon: <Leaf size={13} />,
        color: "text-orange-400 bg-status-falling-bg",
      },
    ] as const
  ).filter((s) => stats[s.key] > 0);

  return (
    <>
      <HomeJsonLd />
      <HeroSection />

      <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-10">
        {/* 전국 현황 — 표시할 데이터가 있을 때만 노출 */}
        {activeStats.length > 0 && (
          <section>
            <h2 className="text-text-primary mb-4 flex items-center gap-2 text-lg font-bold">
              <BarChart3 size={18} className="text-[#ff4da6]" />
              전국 벚꽃 현황
            </h2>
            <div className="flex flex-wrap gap-2">
              {activeStats.map(({ key, icon, color }) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${color}`}
                >
                  {icon} {BLOOM_STATUS_LABEL[key]} {stats[key]}곳
                </span>
              ))}
            </div>
          </section>
        )}

        {/* AI 꽃길 예측 — 기상청 vs AI 비교 */}
        <section>
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary flex items-center gap-2 text-lg font-bold">
                <Flower2 size={18} className="text-[#ff4da6]" />
                전국 개화 예보
                {hasPredictions && (
                  <span className="bg-sakura-700 text-accent-light rounded-full px-2 py-0.5 text-xs font-normal">
                    Gemini 2.5 Flash
                  </span>
                )}
              </h2>
              <Link
                href="/regions"
                className="text-text-muted text-xs transition-colors hover:text-[#ff4da6]"
              >
                상세 보기 →
              </Link>
            </div>
            {updatedAt > 0 && (
              <p className="text-text-muted flex items-center gap-1 text-xs">
                <Clock size={12} />
                AI 예측 업데이트:{" "}
                {new Date(updatedAt).toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r) => {
              const pred = predictions[r.id];
              return (
                <Link key={r.id} href={`/regions/${r.id}`}>
                  <div className="card card-hover cursor-pointer p-5 transition-all">
                    {/* 헤더 */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary text-sm font-bold">
                          {r.name}
                        </span>
                        <span className="text-text-muted text-xs">
                          {r.province}
                        </span>
                      </div>
                      <StatusBadge
                        status={r.status}
                        className="px-1.5 py-0.5 text-[10px]"
                      />
                    </div>

                    {/* 비교 테이블 */}
                    <div className="space-y-1.5 text-xs">
                      {/* 테이블 헤더 */}
                      <div className="text-text-muted grid grid-cols-4 gap-1 text-center">
                        <span className="text-left"></span>
                        <span>개화</span>
                        <span>만개</span>
                        <span>낙화</span>
                      </div>

                      {/* 기상청 데이터 */}
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

                      {/* AI 예측 데이터 */}
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
                    {r.famousSpots[0] && (
                      <p className="text-text-muted mt-2.5 flex items-center gap-1 truncate text-xs">
                        <MapPin size={10} className="shrink-0 text-[#ff4da6]" />
                        {r.famousSpots[0].name}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI 버꼬 배너 */}
        <section>
          <Link href="/chatbot">
            <div className="card card-hover cursor-pointer overflow-hidden">
              <div
                className="p-5"
                style={{
                  background:
                    "linear-gradient(135deg, #ff4da6 0%, #c2185b 100%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs font-medium text-white/75">
                      AI 버꼬
                    </p>
                    <h3 className="text-lg font-bold text-white">
                      어디로 가면 좋을까요?
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      AI 버꼬가 지금 개화 상황으로 추천해드려요
                    </p>
                  </div>
                  <Bot size={36} className="text-white opacity-20" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </>
  );
}
