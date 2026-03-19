"use client";

import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { getWeatherDescription, getWeatherEmoji } from "@/lib/api/openmeteo";
import { isoToMonthDay } from "@/lib/utils/date";
import { WeatherData } from "@/types/weather";

interface Props {
  weather: WeatherData | undefined;
  isLoading: boolean;
}

export function WeatherWidget({ weather, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { current, daily } = weather;

  return (
    <div className="space-y-3">
      {/* 현재 날씨 */}
      <div className="bg-blossom-50 flex items-center justify-between rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {getWeatherEmoji(current.weathercode)}
          </span>
          <div>
            <p className="text-blossom-900 text-lg font-bold">
              {Math.round(current.temperature)}°C
            </p>
            <p className="text-xs text-gray-500">
              {getWeatherDescription(current.weathercode)}
            </p>
          </div>
        </div>
        <div className="space-y-0.5 text-right text-xs text-gray-500">
          <p>💨 {Math.round(current.windspeed)} km/h</p>
          <p>🌧️ {current.precipitation.toFixed(1)} mm</p>
        </div>
      </div>

      {/* 7일 예보 */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {daily.slice(0, 7).map((d, i) => (
          <div
            key={d.date}
            className="border-blossom-100 flex flex-col items-center gap-1 rounded-xl border bg-white px-2 py-2 text-center shadow-sm"
          >
            <p className="text-xs font-medium text-gray-500">
              {i === 0
                ? "오늘"
                : isoToMonthDay(d.date).replace("월 ", "/").replace("일", "")}
            </p>
            <span className="text-xl">{getWeatherEmoji(d.weathercode)}</span>
            <p className="text-blossom-900 text-xs font-semibold">
              {Math.round(d.tempMax)}°
            </p>
            <p className="text-xs text-gray-400">{Math.round(d.tempMin)}°</p>
            {d.precipitationSum > 0 && (
              <p className="text-xs text-blue-400">
                {d.precipitationSum.toFixed(1)}mm
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
