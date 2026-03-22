"use client";

import Link from "next/link";

import {
  CalendarDays,
  ChevronLeft,
  CloudSun,
  Leaf,
  MapPin,
} from "lucide-react";

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
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Link
        href="/regions"
        className="text-text-muted inline-flex items-center gap-1 text-sm transition-colors hover:text-[#ff4da6]"
      >
        <ChevronLeft size={16} /> 전국 예보로
      </Link>

      {/* 헤더 카드 */}
      <div className="card space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-text-primary text-2xl font-extrabold">
              {region.name}
            </h1>
            <p className="text-text-muted text-sm">{region.province}</p>
          </div>
          <StatusBadge status={region.status} />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            {
              label: "개화",
              date: formatMonthDay(region.bloom),
              active:
                region.status !== "before" && region.status !== "unknown",
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
              className={`rounded-xl px-2 py-3 ${active ? "bg-sakura-800" : "bg-sakura-900"}`}
            >
              <p
                className={`text-xs font-semibold ${active ? "text-[#ff4da6]" : "text-text-faint"}`}
              >
                {label}
              </p>
              <p
                className={`mt-0.5 text-sm font-bold ${active ? "text-text-primary" : "text-text-dim"}`}
              >
                {date}
              </p>
            </div>
          ))}
        </div>

        <BloomTimeline region={region} />
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
          <h2 className="text-text-primary mb-3 flex items-center gap-2 text-base font-bold">
            <MapPin size={16} className="text-[#ff4da6]" /> 추천 명소
          </h2>
          <ul className="space-y-2">
            {region.famousSpots.map((spot) => (
              <li
                key={spot}
                className="text-text-secondary flex items-center gap-2 text-sm"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff4da6]" />
                {spot}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 날씨 */}
      <div className="card p-5">
        <h2 className="text-text-primary mb-3 flex items-center gap-2 text-base font-bold">
          <CloudSun size={16} className="text-[#ff4da6]" /> 현재 날씨 &amp; 예보
        </h2>
        <WeatherWidget weather={weather} isLoading={isLoading} />
      </div>

      {/* 낙화 위험도 */}
      {(isLoading || weather?.petalFallRisk) && (
        <div className="card p-5">
          <h2 className="text-text-primary mb-3 flex items-center gap-2 text-base font-bold">
            <Leaf size={16} className="text-[#ff4da6]" /> 낙화 위험도
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="border-sakura-800 h-6 w-6 animate-spin rounded-full border-2 border-t-[#ff4da6]" />
            </div>
          ) : weather?.petalFallRisk ? (
            <PetalFallRisk risk={weather.petalFallRisk} />
          ) : null}
        </div>
      )}

      {/* 봄 축제 */}
      {festivals.length > 0 && (
        <div className="card p-5">
          <h2 className="text-text-primary mb-3 flex items-center gap-2 text-base font-bold">
            <CalendarDays size={16} className="text-[#ff4da6]" /> 관련 봄 축제
          </h2>
          <div className="space-y-3">
            {festivals.map((festival) => {
              const fStatus = getFestivalStatus(festival, today);
              return (
                <div
                  key={festival.id}
                  className="rounded-xl border border-[rgba(255,77,166,0.2)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-text-primary text-sm font-semibold">
                        {festival.name}
                      </p>
                      <p className="text-text-muted mt-0.5 text-xs">
                        {formatFestivalDates(festival)} · {festival.location}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        fStatus === "ongoing"
                          ? "bg-sakura-700 text-[#ff4da6]"
                          : fStatus === "upcoming"
                            ? "bg-status-upcoming-bg text-status-upcoming-text"
                            : "bg-sakura-800 text-text-dim"
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
                        className="bg-sakura-700 text-accent-light rounded-full px-2.5 py-0.5 text-xs"
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
