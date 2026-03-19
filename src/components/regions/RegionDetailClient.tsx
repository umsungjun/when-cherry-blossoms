"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import { CommentSection } from "@/components/community/CommentSection";
import { BloomTimeline } from "@/components/regions/BloomTimeline";
import { DDay } from "@/components/ui/DDay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PetalFallRisk } from "@/components/weather/PetalFallRisk";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import {
  formatFestivalDates,
  getFestivalStatus,
  getFestivalsByRegion,
} from "@/lib/data/festivals";
import { useWeather } from "@/lib/hooks/useWeather";
import { cn } from "@/lib/utils/cn";
import { formatMonthDay } from "@/lib/utils/date";
import { RegionWithStatus } from "@/types/region";

interface Props {
  region: RegionWithStatus;
}

export function RegionDetailClient({ region }: Props) {
  const { weather, isLoading } = useWeather(region.lat, region.lng);
  const festivals = getFestivalsByRegion(region.id);
  const today = new Date();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* 뒤로 가기 */}
      <Link
        href="/regions"
        className="hover:text-blossom-600 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors"
      >
        <ChevronLeft size={16} />
        전국 예보로
      </Link>

      {/* 헤더 */}
      <div className="card space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-blossom-900 text-2xl font-extrabold">
              {region.name}
            </h1>
            <p className="text-sm text-gray-400">{region.province}</p>
          </div>
          <StatusBadge status={region.status} />
        </div>

        {/* 개화 정보 */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            {
              label: "개화",
              date: formatMonthDay(region.bloom),
              active: region.status !== "before",
            },
            {
              label: "만개",
              date: formatMonthDay(region.peak),
              active:
                region.status === "peak" ||
                region.status === "falling" ||
                region.status === "done",
            },
            {
              label: "낙화",
              date: formatMonthDay(region.fall),
              active: region.status === "falling" || region.status === "done",
            },
          ].map(({ label, date, active }) => (
            <div
              key={label}
              className={`rounded-xl px-2 py-3 ${active ? "bg-blossom-100" : "bg-gray-50"}`}
            >
              <p
                className={`text-xs font-semibold ${active ? "text-blossom-600" : "text-gray-400"}`}
              >
                {label}
              </p>
              <p
                className={`mt-0.5 text-sm font-bold ${active ? "text-blossom-900" : "text-gray-500"}`}
              >
                {date}
              </p>
            </div>
          ))}
        </div>

        {/* 타임라인 */}
        <BloomTimeline region={region} />

        {/* D-Day */}
        <DDay
          status={region.status}
          daysUntilBloom={region.daysUntilBloom}
          daysUntilPeak={region.daysUntilPeak}
          daysUntilFall={region.daysUntilFall}
        />
      </div>

      {/* 명소 */}
      {region.famousSpots.length > 0 && (
        <div className="card p-5">
          <h2 className="text-blossom-900 mb-3 text-base font-bold">
            📍 추천 명소
          </h2>
          <ul className="space-y-2">
            {region.famousSpots.map((spot) => (
              <li
                key={spot}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="bg-blossom-400 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                {spot}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 날씨 */}
      <div className="card p-5">
        <h2 className="text-blossom-900 mb-3 text-base font-bold">
          🌤️ 현재 날씨 & 예보
        </h2>
        <WeatherWidget weather={weather} isLoading={isLoading} />
      </div>

      {/* 낙화 위험도 */}
      {(isLoading || weather?.petalFallRisk) && (
        <div className="card p-5">
          <h2 className="text-blossom-900 mb-3 text-base font-bold">
            🍃 낙화 위험도
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="border-blossom-200 border-t-blossom-500 h-6 w-6 animate-spin rounded-full border-2" />
            </div>
          ) : weather?.petalFallRisk ? (
            <PetalFallRisk risk={weather.petalFallRisk} />
          ) : null}
        </div>
      )}

      {/* 관련 봄 축제 */}
      {festivals.length > 0 && (
        <div className="card p-5">
          <h2 className="text-blossom-900 mb-3 text-base font-bold">
            🎪 관련 봄 축제
          </h2>
          <div className="space-y-3">
            {festivals.map((festival) => {
              const fStatus = getFestivalStatus(festival, today);
              return (
                <div
                  key={festival.id}
                  className="border-blossom-100 rounded-xl border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-blossom-900 text-sm font-semibold">
                        {festival.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {formatFestivalDates(festival)} · {festival.location}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        fStatus === "ongoing"
                          ? "bg-blossom-100 text-blossom-600"
                          : fStatus === "upcoming"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {fStatus === "ongoing"
                        ? "진행 중"
                        : fStatus === "upcoming"
                          ? "예정"
                          : "종료"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {festival.highlights.map((h) => (
                      <span
                        key={h}
                        className="bg-blossom-50 text-blossom-600 rounded-full px-2.5 py-0.5 text-xs"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 커뮤니티 */}
      <div className="card p-5">
        <CommentSection regionId={region.id} />
      </div>
    </div>
  );
}
