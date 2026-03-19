import { DailyForecast, WeatherData } from "@/types/weather";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(
  lat: number,
  lng: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    timezone: "Asia/Seoul",
    current: "temperature_2m,windspeed_10m,precipitation,weathercode,is_day",
    daily: [
      "precipitation_sum",
      "precipitation_hours",
      "windspeed_10m_max",
      "windgusts_10m_max",
      "weathercode",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
    ].join(","),
    forecast_days: "7",
  });

  const res = await fetch(`${BASE_URL}?${params}`, {
    next: { revalidate: 1800 }, // 30분 캐시
  });

  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

  const json = await res.json();

  const daily: DailyForecast[] = json.daily.time.map(
    (date: string, i: number) => ({
      date,
      precipitationSum: json.daily.precipitation_sum[i] ?? 0,
      precipitationHours: json.daily.precipitation_hours[i] ?? 0,
      windspeedMax: json.daily.windspeed_10m_max[i] ?? 0,
      windgustsMax: json.daily.windgusts_10m_max[i] ?? 0,
      weathercode: json.daily.weathercode[i] ?? 0,
      tempMax: json.daily.temperature_2m_max[i] ?? 0,
      tempMin: json.daily.temperature_2m_min[i] ?? 0,
      sunrise: json.daily.sunrise[i] ?? "",
      sunset: json.daily.sunset[i] ?? "",
    })
  );

  return {
    current: {
      temperature: json.current.temperature_2m,
      windspeed: json.current.windspeed_10m,
      precipitation: json.current.precipitation,
      weathercode: json.current.weathercode,
      is_day: json.current.is_day,
    },
    daily,
    timezone: json.timezone,
  };
}

/** WMO 날씨 코드 → 한글 설명 */
export function getWeatherDescription(code: number): string {
  if (code === 0) return "맑음";
  if (code <= 2) return "구름 조금";
  if (code <= 3) return "흐림";
  if (code <= 49) return "안개";
  if (code <= 59) return "이슬비";
  if (code <= 67) return "비";
  if (code <= 77) return "눈";
  if (code <= 82) return "소나기";
  if (code <= 86) return "눈 소나기";
  if (code <= 99) return "뇌우";
  return "알 수 없음";
}

/** WMO 코드 → 이모지 */
export function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}
