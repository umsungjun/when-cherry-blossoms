"use client";

import useSWR from "swr";

import { PetalFallRisk } from "@/types/region";
import { WeatherData } from "@/types/weather";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useWeather(lat: number, lng: number) {
  const { data, error, isLoading } = useSWR<
    WeatherData & { petalFallRisk: PetalFallRisk }
  >(
    `/api/weather?lat=${lat}&lng=${lng}`,
    fetcher,
    { refreshInterval: 1800000 } // 30분
  );

  return { weather: data, error, isLoading };
}
