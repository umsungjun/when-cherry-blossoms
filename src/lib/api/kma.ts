import fs from "fs";
import path from "path";

import { DateInfo, Region } from "@/types/region";

/**
 * 기상청 봄꽃개화현황 JSONP API 연동
 * 엔드포인트: https://www.kma.go.kr/kma/theme/flower_photojs.jsp
 * 1회 호출로 전국 13개 관측지점 현황을 모두 가져옴
 */

// 기상청 관측지점 → 프로젝트 지역 ID 매핑 (1:N — 하나의 관측지점이 여러 지역 커버)
const KMA_TO_REGIONS: Record<string, string[]> = {
  "여의도 윤중로": ["seoul"],
  "수원 경기도청": ["suwon"],
  인천자유공원: [], // 프로젝트에 인천 지역 없음
  "춘천 소양강댐": ["chuncheon"],
  "강릉 경포대": ["gangneung"],
  "청주 무심천변": [],
  "공주 계룡산": ["daejeon"], // 대전이 공주로 커버됨
  "전주-군산간 번영로": ["jeonju"],
  "영암 100리": ["mokpo", "gwangju"], // 영암 ≈ 목포·광주권
  "하동 쌍계사": ["suncheon", "yeosu"], // 하동 ≈ 순천·여수권
  "경주 보문관광단지": ["daegu", "pohang", "ulsan"], // 경주 ≈ 대구·포항·울산권
  "진해 여좌천": ["changwon"],
  "부산 남천동": ["busan"],
  // 제주: 기상청 벚꽃 관측지점 없음 → AI 예측으로만 제공
};

interface KmaPlaceData {
  obsPlace: string;
  sts: string; // "1": 개화 전, "2": 개화, "3": 만개
}

interface KmaFlowerData {
  cfShotDate?: string; // 개화일 "2026-03-24"
  ffShotDate?: string; // 만개일 "2026-03-30"
  flowerStatus?: string;
}

interface KmaResponse {
  flower: KmaFlowerData;
  places: KmaPlaceData[];
}

export interface KmaBloomData {
  regionId: string;
  bloom?: DateInfo;
  peak?: DateInfo;
  status: "before" | "blooming" | "peak"; // 기상청 발표 상태
}

// 캐시 설정
const KMA_CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간
const KMA_CACHE_FILE = path.join(process.cwd(), ".cache", "kma-bloom.json");

let kmaMemCache: {
  data: Record<string, KmaBloomData>;
  timestamp: number;
} | null = null;

function readKmaCacheFile(): typeof kmaMemCache {
  try {
    if (!fs.existsSync(KMA_CACHE_FILE)) return null;
    const raw = JSON.parse(fs.readFileSync(KMA_CACHE_FILE, "utf-8"));
    if (Date.now() - raw.timestamp < KMA_CACHE_TTL) return raw;
  } catch {
    /* 파일 손상 시 무시 */
  }
  return null;
}

function writeKmaCacheFile(data: Record<string, KmaBloomData>) {
  try {
    const dir = path.dirname(KMA_CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      KMA_CACHE_FILE,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    /* 쓰기 실패 시 무시 */
  }
}

/** "2026-03-24" → { month: 3, day: 24 } */
function parseDateStr(dateStr: string): DateInfo | undefined {
  if (!dateStr) return undefined;
  const parts = dateStr.split("-");
  if (parts.length < 3) return undefined;
  return { month: parseInt(parts[1], 10), day: parseInt(parts[2], 10) };
}

function stsToStatus(sts: string): KmaBloomData["status"] {
  if (sts === "3") return "peak";
  if (sts === "2") return "blooming";
  return "before";
}

/**
 * 기상청 JSONP 파싱 — applyFlowerData({...}); 래퍼 제거 후 JSON 파싱
 */
function parseJsonp(text: string): KmaResponse {
  const start = text.indexOf("(");
  const end = text.lastIndexOf(")");
  if (start === -1 || end === -1) throw new Error("Invalid JSONP response");
  return JSON.parse(text.slice(start + 1, end));
}

/**
 * 기상청에서 전국 벚꽃 개화 현황 가져오기
 * 아무 관측지점이나 조회하면 places 배열에 전체 13개 지점 포함
 */
async function fetchKmaData(): Promise<Record<string, KmaBloomData>> {
  const url =
    "https://www.kma.go.kr/kma/theme/flower_photojs.jsp?treeType=1&obsPlace=%EC%97%AC%EC%9D%98%EB%8F%84%20%EC%9C%A4%EC%A4%91%EB%A1%9C";

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "*/*",
    },
  });

  if (!res.ok) throw new Error(`KMA fetch failed: ${res.status}`);
  const text = await res.text();
  const data = parseJsonp(text);

  const result: Record<string, KmaBloomData> = {};

  // places 배열에서 전체 관측지점 상태 추출 (1:N 매핑)
  for (const place of data.places) {
    const regionIds = KMA_TO_REGIONS[place.obsPlace];
    if (!regionIds?.length) continue;

    for (const regionId of regionIds) {
      result[regionId] = {
        regionId,
        status: stsToStatus(place.sts),
      };
    }
  }

  // 개화/만개 상세 날짜는 각 지점별로 개별 조회 필요
  // sts와 무관하게 매핑된 모든 지점을 조회 — places[].sts가 "1"이어도 flower 객체에 실제 날짜가 있을 수 있음
  const bloomedPlaces = data.places.filter(
    (p) => KMA_TO_REGIONS[p.obsPlace]?.length
  );

  for (const place of bloomedPlaces) {
    const regionIds = KMA_TO_REGIONS[place.obsPlace]!;
    const detailUrl = `https://www.kma.go.kr/kma/theme/flower_photojs.jsp?treeType=1&obsPlace=${encodeURIComponent(place.obsPlace)}`;
    try {
      const detailRes = await fetch(detailUrl, {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "*/*" },
      });
      const detailText = await detailRes.text();
      const detail = parseJsonp(detailText);

      if (detail.flower) {
        const bloom = parseDateStr(detail.flower.cfShotDate ?? "");
        const peak = parseDateStr(detail.flower.ffShotDate ?? "");
        for (const regionId of regionIds) {
          result[regionId] = { ...result[regionId], bloom, peak };
        }
      }
    } catch {
      console.error(`KMA detail fetch failed for ${place.obsPlace}`);
    }
  }

  return result;
}

/**
 * 기상청 개화 데이터 조회 (캐시 적용)
 */
export async function getKmaBloomData(options?: {
  forceRefresh?: boolean;
}): Promise<Record<string, KmaBloomData>> {
  const force = options?.forceRefresh ?? false;

  // 인메모리 캐시
  if (
    !force &&
    kmaMemCache &&
    Date.now() - kmaMemCache.timestamp < KMA_CACHE_TTL
  ) {
    return kmaMemCache.data;
  }

  // 파일 캐시
  if (!force) {
    const fileCache = readKmaCacheFile();
    if (fileCache) {
      kmaMemCache = fileCache;
      console.log("KMA bloom data loaded from file cache");
      return fileCache.data;
    }
  }

  // API 호출
  try {
    console.log("Fetching KMA bloom data...");
    const data = await fetchKmaData();
    const count = Object.values(data).filter(
      (d) => d.status !== "before"
    ).length;
    console.log(
      `KMA bloom data: ${Object.keys(data).length} regions mapped, ${count} bloomed`
    );

    kmaMemCache = { data, timestamp: Date.now() };
    writeKmaCacheFile(data);
    return data;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`KMA fetch error: ${msg}`);
    return kmaMemCache?.data ?? {};
  }
}

/**
 * 기상청에서 개화·만개·낙화가 모두 확정된 지역 ID 집합
 * 이 지역들은 AI 예측이 불필요
 */
export function getKmaConfirmedIds(
  kmaData: Record<string, KmaBloomData>
): Set<string> {
  const ids = new Set<string>();
  for (const [regionId, data] of Object.entries(kmaData)) {
    // bloom과 peak이 모두 있으면 확정으로 간주 (낙화는 peak 기준 자동 계산 가능)
    if (data.bloom && data.peak) {
      ids.add(regionId);
    }
  }
  return ids;
}

/**
 * KMA 데이터를 Region 배열에 병합
 * 기상청 발표 날짜가 있으면 Region의 bloom/peak/fall을 덮어씀
 */
export function mergeKmaData(
  regions: Region[],
  kmaData: Record<string, KmaBloomData>
): Region[] {
  return regions.map((r) => {
    const kma = kmaData[r.id];
    if (!kma) return r;

    return {
      ...r,
      // 기상청 데이터가 있으면 우선 적용, 없으면 기존 값 유지
      bloom: kma.bloom ?? r.bloom,
      peak: kma.peak ?? r.peak,
    };
  });
}
