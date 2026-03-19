"use client";

import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Snowflake, Sun, Wind } from "lucide-react";

import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { getWeatherDescription } from "@/lib/api/openmeteo";
import { isoToMonthDay } from "@/lib/utils/date";
import { WeatherData } from "@/types/weather";

function WeatherIcon({ code, size = 24 }: { code: number; size?: number }) {
  if (code === 0)  return <Sun           size={size} />;
  if (code <= 2)   return <CloudSun      size={size} />;
  if (code <= 3)   return <Cloud         size={size} />;
  if (code <= 49)  return <CloudFog      size={size} />;
  if (code <= 67)  return <CloudRain     size={size} />;
  if (code <= 77)  return <Snowflake     size={size} />;
  if (code <= 82)  return <CloudSnow     size={size} />;
  if (code <= 99)  return <CloudLightning size={size} />;
  return <Sun size={size} />;
}

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
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { current, daily } = weather;

  return (
    <div className="space-y-3">
      {/* 현재 날씨 */}
      <div className="flex items-center justify-between rounded-xl bg-sakura-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[#ff4da6]">
            <WeatherIcon code={current.weathercode} size={32} />
          </span>
          <div>
            <p className="text-lg font-bold text-text-primary">{Math.round(current.temperature)}°C</p>
            <p className="text-xs text-text-muted">{getWeatherDescription(current.weathercode)}</p>
          </div>
        </div>
        <div className="space-y-1 text-right text-xs text-text-muted">
          <p className="flex items-center justify-end gap-1"><Wind size={11} /> {Math.round(current.windspeed)} km/h</p>
          <p className="flex items-center justify-end gap-1"><CloudRain size={11} /> {current.precipitation.toFixed(1)} mm</p>
        </div>
      </div>

      {/* 7일 예보 */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {daily.slice(0, 7).map((d, i) => (
          <div key={d.date} className="flex flex-col items-center gap-1 rounded-xl border border-[rgba(255,77,166,0.2)] bg-sakura-900 px-2 py-2 text-center">
            <p className="text-xs font-medium text-text-muted">
              {i === 0 ? "오늘" : isoToMonthDay(d.date).replace("월 ", "/").replace("일", "")}
            </p>
            <span className="text-[#ff4da6]"><WeatherIcon code={d.weathercode} size={18} /></span>
            <p className="text-xs font-semibold text-text-primary">{Math.round(d.tempMax)}°</p>
            <p className="text-xs text-text-dim">{Math.round(d.tempMin)}°</p>
            {d.precipitationSum > 0 && <p className="text-xs text-blue-400">{d.precipitationSum.toFixed(1)}mm</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
