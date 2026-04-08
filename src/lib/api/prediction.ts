import fs from "fs";
import path from "path";

import { RegionWithStatus } from "@/types/region";

import { PREDICTION_MODEL, genAI } from "./gemini";
import { RegionWeatherAnalysis, analyzeAllRegions } from "./historical-weather";

export interface RegionPrediction {
  regionId: string;
  bloom: string;
  peak: string;
  fall: string;
}

export interface PredictionResult {
  data: Record<string, RegionPrediction>;
  updatedAt: number; // 예측 생성 시각 (ms timestamp)
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간 (Vercel Cron으로 하루 1회 갱신)
const CACHE_FILE = path.join(process.cwd(), ".cache", "ai-predictions.json");

// 인메모리 캐시
let memCache: {
  data: Record<string, RegionPrediction>;
  timestamp: number;
} | null = null;

/** 파일 캐시 읽기 — dev 서버 재시작 시에도 유지 */
function readFileCache(): typeof memCache {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    if (Date.now() - raw.timestamp < CACHE_TTL) return raw;
  } catch {
    /* 파일 손상 시 무시 */
  }
  return null;
}

/** 파일 캐시 쓰기 */
function writeFileCache(data: Record<string, RegionPrediction>) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    /* 쓰기 실패 시 무시 */
  }
}

/**
 * 적산온도(GDD) + 기상 예보 기반 프롬프트 생성
 * 과거 데이터를 활용해 Gemini가 실질적인 분석 예측을 수행하도록 함
 */
function buildPredictionPrompt(
  regions: RegionWithStatus[],
  weatherData: RegionWeatherAnalysis[]
): string {
  const today = new Date();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  const year = today.getFullYear();

  // 지역별 기상 분석 데이터를 정리
  const weatherMap = new Map(weatherData.map((w) => [w.regionId, w]));

  const regionLines = regions
    .map((r) => {
      const w = weatherMap.get(r.id);
      if (!w) return null;
      const kmaLine =
        r.bloom && r.peak && r.fall
          ? `기상청:개화${r.bloom.month}/${r.bloom.day},만개${r.peak.month}/${r.peak.day},낙화${r.fall.month}/${r.fall.day}`
          : `기상청:미발표`;
      return [
        `${r.id}|${r.name}|위도${r.lat}`,
        kmaLine,
        `GDD:${w.gddTotal}°C·일|최근7일평균:${w.recentAvgTemp}°C(최고${w.recentAvgTempMax}/최저${w.recentAvgTempMin})`,
        `3월평균:${w.marchAvgTemp}°C|예보7일평균:${w.forecastAvgTemp}°C(+GDD${w.forecastGddAdd})`,
        w.daysUntilKmaBloom !== null
          ? `기상청개화까지:${w.daysUntilKmaBloom}일`
          : `기상청개화일:미정`,
      ].join("|");
    })
    .filter(Boolean)
    .join("\n");

  return `당신은 벚꽃 개화 예측 전문 기상 AI입니다. ${year}년 ${mm}월 ${dd}일 기준으로 실제 기상 데이터를 분석하여 정확한 예측을 수행하세요.

## 벚꽃 개화 과학적 기준
- 왕벚나무 개화 적산온도(GDD, 기준5°C) 임계값: 위도 33~34°는 약 320~370°C·일, 위도 35~36°는 약 370~420°C·일, 위도 37~38°는 약 400~450°C·일
- 개화→만개: 평균 4~6일 (기온 높으면 3~4일, 낮으면 6~7일)
- 만개→낙화 시작: 평균 5~7일 (비·바람 시 단축)
- 최근 기온이 15°C 이상 유지되면 개화가 촉진됨
- 급격한 기온 하강(꽃샘추위)이 있으면 개화가 1~3일 지연됨

## 과거 서울 개화일 참조 (적산온도와의 상관)
- 2024: 4/3 개화 (3월 평균 7.8°C, 온난)
- 2023: 3/24 개화 (3월 평균 10.2°C, 역대급 이른 봄)
- 2022: 4/1 개화 (3월 평균 8.5°C)
- 2021: 3/24 개화 (3월 평균 9.8°C)
- 2020: 3/27 개화 (3월 평균 8.9°C)
서울 기준 3월 평균 8~9°C → 4/1~4/5, 10°C 이상 → 3월 말 개화 경향

## 올해 실측 기상 데이터 (Open-Meteo)
${regionLines}

## 분석 지침
1. 각 지역의 현재 GDD를 임계값과 비교하여 개화까지 남은 열량 산출
2. 향후 7일 예보 기온으로 GDD 증가 속도를 추정
3. 최근 7일 기온 추세(상승/하강)를 반영
4. 위도별 임계값 차이를 고려 (남쪽일수록 낮은 GDD에서 개화)
5. 기상청 예보와 독립적으로 예측하되, 근거가 있는 차이만 반영

## 출력 형식
JSON 배열만 출력. ${regions.length}개 전부 반환.
[{"regionId":"seoul","bloom":"4/3","peak":"4/8","fall":"4/13"},...]`;
}

/**
 * Gemini 2.5 Flash + 적산온도 기반 벚꽃 개화 예측
 * 실제 기상 데이터를 분석하여 과학적 근거가 있는 예측 수행
 */
export async function getAIPredictions(
  regions: RegionWithStatus[],
  options?: { forceRefresh?: boolean; kmaConfirmedIds?: Set<string> }
): Promise<PredictionResult> {
  const force = options?.forceRefresh ?? false;
  const kmaConfirmedIds = options?.kmaConfirmedIds ?? new Set();

  // 1순위: 인메모리 캐시 (forceRefresh 시 스킵)
  if (!force && memCache && Date.now() - memCache.timestamp < CACHE_TTL) {
    return { data: memCache.data, updatedAt: memCache.timestamp };
  }

  // 2순위: 파일 캐시 (서버 재시작 후에도 유효, forceRefresh 시 스킵)
  if (!force) {
    const fileCache = readFileCache();
    if (fileCache) {
      memCache = fileCache;
      console.log("AI predictions loaded from file cache");
      return { data: fileCache.data, updatedAt: fileCache.timestamp };
    }
  }

  // 기존 캐시 데이터 확보 (머지용)
  const existingData = memCache?.data ?? readFileCache()?.data ?? {};

  // 기상청 확정 지역은 캐시에 이미 예측이 있으면 재조회 안 함
  // 캐시에 없는 경우에만 한 번 예측 생성
  const needsAI = regions.filter(
    (r) => !kmaConfirmedIds.has(r.id) || !existingData[r.id]
  );

  if (kmaConfirmedIds.size > 0) {
    const skipped = regions.filter(
      (r) => kmaConfirmedIds.has(r.id) && existingData[r.id]
    ).length;
    console.log(
      `AI prediction: ${skipped} KMA-confirmed regions skipped (cached), ${needsAI.length} regions need AI`
    );
  }

  // 모든 지역이 캐시에 있으면 AI 호출 스킵
  if (needsAI.length === 0) {
    return { data: existingData, updatedAt: memCache?.timestamp ?? Date.now() };
  }

  // 3순위: 기상 데이터 수집 + Gemini API 호출 (KMA 미확정 지역만)
  try {
    console.log("Fetching historical weather data for AI prediction...");
    const weatherData = await analyzeAllRegions(needsAI);
    console.log(
      `Weather analysis complete: ${weatherData.length} regions, avg GDD: ${Math.round(weatherData.reduce((s, w) => s + w.gddTotal, 0) / weatherData.length)}°C·일`
    );

    const prompt = buildPredictionPrompt(needsAI, weatherData);

    const response = await genAI.models.generateContent({
      model: PREDICTION_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 16384,
        temperature: 0.3,
        responseMimeType: "application/json",
        // 사고 토큰을 적절히 할당 — 기상 분석에 더 많은 추론 필요
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });

    const text = response.text ?? "[]";
    const cleaned = text
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();

    let predictions: RegionPrediction[];
    try {
      predictions = JSON.parse(cleaned);
    } catch {
      const lastBrace = cleaned.lastIndexOf("}");
      if (lastBrace === -1) throw new Error("No valid JSON found");
      const partial = cleaned.slice(0, lastBrace + 1) + "]";
      predictions = JSON.parse(partial);
    }

    console.log(
      `AI predictions: ${predictions.length}/${needsAI.length} regions (GDD-based, ${kmaConfirmedIds.size} KMA-confirmed skipped)`
    );

    const map: Record<string, RegionPrediction> = {};
    for (const p of predictions) {
      map[p.regionId] = p;
    }

    // 기존 캐시와 머지 — 확정 지역의 이전 예측 데이터 보존
    const merged = { ...existingData, ...map };

    // 캐시 저장 (메모리 + 파일)
    const now = Date.now();
    memCache = { data: merged, timestamp: now };
    writeFileCache(merged);
    return { data: merged, updatedAt: now };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`AI prediction error: ${msg}`);
    console.error("GEMINI_API_KEY set:", !!process.env.GEMINI_API_KEY);
    // existingData를 우선 반환 — memCache가 없어도 파일 캐시 데이터 보존
    return {
      data: Object.keys(existingData).length > 0 ? existingData : (memCache?.data ?? {}),
      updatedAt: memCache?.timestamp ?? 0,
    };
  }
}

