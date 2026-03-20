import fs from "fs";
import path from "path";

import { RegionWithStatus } from "@/types/region";

import { PREDICTION_MODEL, genAI } from "./gemini";

export interface RegionPrediction {
  regionId: string;
  bloom: string;
  peak: string;
  fall: string;
}

const CACHE_TTL = 3 * 60 * 60 * 1000; // 3시간
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
 * Gemini 2.5 Flash로 전국 벚꽃 개화·만개·낙화 날짜 AI 예측
 * 무료 티어 일 20회 → 3시간 캐시로 일 최대 8회 호출
 */
export async function getAIPredictions(
  regions: RegionWithStatus[]
): Promise<Record<string, RegionPrediction>> {
  // 1순위: 인메모리 캐시
  if (memCache && Date.now() - memCache.timestamp < CACHE_TTL) {
    return memCache.data;
  }

  // 2순위: 파일 캐시 (서버 재시작 후에도 유효)
  const fileCache = readFileCache();
  if (fileCache) {
    memCache = fileCache;
    console.log("AI predictions loaded from file cache");
    return fileCache.data;
  }

  // 3순위: Gemini API 호출
  const today = new Date();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();

  const compact = regions
    .map(
      (r) =>
        `${r.id}|${r.name}|${r.lat}|${r.bloom.month}/${r.bloom.day}|${r.peak.month}/${r.peak.day}|${r.fall.month}/${r.fall.day}`
    )
    .join("\n");

  const prompt = `오늘:${mm}/${dd}. 2026 벚꽃 기상청 데이터(id|이름|위도|개화|만개|낙화):
${compact}

위도·기후 트렌드 고려해서 AI 예측 날짜를 JSON 배열로 반환.
형식: [{"regionId":"seoul","bloom":"4/3","peak":"4/8","fall":"4/13"},...]
기상청과 1~3일 차이가 자연스러움. 16개 전부 반환.`;

  try {
    const response = await genAI.models.generateContent({
      model: PREDICTION_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 16384,
        temperature: 0.3,
        responseMimeType: "application/json",
        // Gemini 2.5 Flash는 thinking 모델 — 사고 토큰을 최소화해야 JSON이 잘리지 않음
        thinkingConfig: { thinkingBudget: 256 },
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
      `AI predictions: ${predictions.length}/${regions.length} regions (fetched)`
    );

    const map: Record<string, RegionPrediction> = {};
    for (const p of predictions) {
      map[p.regionId] = p;
    }

    // 캐시 저장 (메모리 + 파일)
    memCache = { data: map, timestamp: Date.now() };
    writeFileCache(map);
    return map;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`AI prediction error: ${msg}`);
    console.error("GEMINI_API_KEY set:", !!process.env.GEMINI_API_KEY);
    return memCache?.data ?? {};
  }
}
