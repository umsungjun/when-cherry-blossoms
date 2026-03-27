/**
 * Open-Meteo Historical Weather API를 활용한 적산온도(GDD) 계산
 *
 * 벚꽃 개화 예측의 핵심 지표:
 * - 적산온도(GDD): 2월 1일부터 일평균기온에서 기준온도(5°C)를 뺀 값의 누적합
 * - 한국 왕벚나무 개화 적산온도 임계값: 약 350~450°C·일 (위도별 차이)
 * - 최근 7일 평균기온: 직전 기온 추세 반영
 */

const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// 벚꽃 GDD 기준온도 (°C) — 왕벚나무 휴면타파 후 유효온도 기준
const BASE_TEMP = 5;

export interface RegionWeatherAnalysis {
  regionId: string;
  regionName: string;
  lat: number;
  /** 2월 1일~오늘까지 적산온도 (°C·일) */
  gddTotal: number;
  /** 최근 7일 평균기온 (°C) */
  recentAvgTemp: number;
  /** 최근 7일 최고기온 평균 (°C) */
  recentAvgTempMax: number;
  /** 최근 7일 최저기온 평균 (°C) */
  recentAvgTempMin: number;
  /** 3월 평균기온 (°C) */
  marchAvgTemp: number;
  /** 향후 7일 예보 평균기온 (°C) */
  forecastAvgTemp: number;
  /** 향후 7일 예보로 추가될 예상 GDD */
  forecastGddAdd: number;
  /** 기상청 기준 개화일까지 남은 일수 */
  daysUntilKmaBloom: number | null;
}

/** 과거 기상 데이터에서 GDD와 기온 통계 계산 */
async function fetchHistoricalTemp(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string
): Promise<{
  dates: string[];
  tempMeans: number[];
  tempMaxs: number[];
  tempMins: number[];
}> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    start_date: startDate,
    end_date: endDate,
    daily: "temperature_2m_mean,temperature_2m_max,temperature_2m_min",
    timezone: "Asia/Seoul",
  });

  const res = await fetch(`${ARCHIVE_URL}?${params}`, {
    next: { revalidate: 10800 }, // 3시간 캐시
  });

  if (!res.ok) throw new Error(`Historical API error: ${res.status}`);
  const json = await res.json();

  return {
    dates: json.daily.time ?? [],
    tempMeans: json.daily.temperature_2m_mean ?? [],
    tempMaxs: json.daily.temperature_2m_max ?? [],
    tempMins: json.daily.temperature_2m_min ?? [],
  };
}

/** 향후 7일 예보 기온 */
async function fetchForecastTemp(
  lat: number,
  lng: number
): Promise<{ tempMeans: number[] }> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "Asia/Seoul",
    forecast_days: "7",
  });

  const res = await fetch(`${FORECAST_URL}?${params}`, {
    next: { revalidate: 10800 },
  });

  if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
  const json = await res.json();

  const maxs: number[] = json.daily.temperature_2m_max ?? [];
  const mins: number[] = json.daily.temperature_2m_min ?? [];
  const means = maxs.map((max: number, i: number) => (max + mins[i]) / 2);

  return { tempMeans: means };
}

/** 적산온도(GDD) 계산 — base temp 이상인 날만 누적 */
function calcGDD(temps: number[]): number {
  return temps.reduce((sum, t) => {
    const eff = t - BASE_TEMP;
    return sum + (eff > 0 ? eff : 0);
  }, 0);
}

/**
 * 단일 지역의 기상 분석 데이터 생성
 * - 2월 1일~어제까지 과거 기온 (Open-Meteo Archive)
 * - 오늘~7일 후 예보 기온 (Open-Meteo Forecast)
 */
export async function analyzeRegionWeather(
  regionId: string,
  regionName: string,
  lat: number,
  lng: number,
  bloomMonth: number,
  bloomDay: number
): Promise<RegionWeatherAnalysis> {
  const today = new Date();
  const year = today.getFullYear();

  // 과거 데이터 범위: 2월 1일 ~ 어제
  const startDate = `${year}-02-01`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const endDate = yesterday.toISOString().slice(0, 10);

  const [hist, forecast] = await Promise.all([
    fetchHistoricalTemp(lat, lng, startDate, endDate),
    fetchForecastTemp(lat, lng),
  ]);

  // 적산온도 계산
  const gddTotal = Math.round(calcGDD(hist.tempMeans) * 10) / 10;

  // 최근 7일 평균기온
  const last7 = hist.tempMeans.slice(-7);
  const last7Max = hist.tempMaxs.slice(-7);
  const last7Min = hist.tempMins.slice(-7);
  const recentAvgTemp =
    Math.round((last7.reduce((a, b) => a + b, 0) / last7.length) * 10) / 10;
  const recentAvgTempMax =
    Math.round((last7Max.reduce((a, b) => a + b, 0) / last7Max.length) * 10) /
    10;
  const recentAvgTempMin =
    Math.round((last7Min.reduce((a, b) => a + b, 0) / last7Min.length) * 10) /
    10;

  // 3월 평균기온
  const marchTemps = hist.tempMeans.filter((_, i) =>
    hist.dates[i]?.startsWith(`${year}-03`)
  );
  const marchAvgTemp =
    marchTemps.length > 0
      ? Math.round(
          (marchTemps.reduce((a, b) => a + b, 0) / marchTemps.length) * 10
        ) / 10
      : 0;

  // 예보 기반 추가 GDD
  const forecastAvgTemp =
    Math.round(
      (forecast.tempMeans.reduce((a, b) => a + b, 0) /
        forecast.tempMeans.length) *
        10
    ) / 10;
  const forecastGddAdd = Math.round(calcGDD(forecast.tempMeans) * 10) / 10;

  // 기상청 개화일까지 남은 일수 (bloom 데이터 없으면 null)
  const daysUntilKmaBloom =
    bloomMonth > 0 && bloomDay > 0
      ? Math.round(
          (new Date(year, bloomMonth - 1, bloomDay).getTime() -
            today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return {
    regionId,
    regionName,
    lat,
    gddTotal,
    recentAvgTemp,
    recentAvgTempMax,
    recentAvgTempMin,
    marchAvgTemp,
    forecastAvgTemp,
    forecastGddAdd,
    daysUntilKmaBloom,
  };
}

/**
 * 전체 16개 지역의 기상 분석을 병렬 실행
 * 4개씩 배치 처리하여 API rate limit 방지
 */
export async function analyzeAllRegions(
  regions: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    bloom?: { month: number; day: number };
  }[]
): Promise<RegionWeatherAnalysis[]> {
  const BATCH_SIZE = 4;
  const results: RegionWeatherAnalysis[] = [];

  for (let i = 0; i < regions.length; i += BATCH_SIZE) {
    const batch = regions.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((r) =>
        analyzeRegionWeather(
          r.id,
          r.name,
          r.lat,
          r.lng,
          r.bloom?.month ?? 0,
          r.bloom?.day ?? 0
        )
      )
    );
    results.push(...batchResults);
  }

  return results;
}
