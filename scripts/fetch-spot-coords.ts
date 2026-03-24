/**
 * Kakao Local API로 명소 좌표를 1회 수집하여 regions.ts에 반영하는 스크립트
 * 실행: npx tsx scripts/fetch-spot-coords.ts
 *
 * 무료 쿼터 내 사용 (총 ~40건, 월 300,000건 한도)
 */

import * as fs from "fs";
import * as path from "path";

const KAKAO_KEY = process.env.KAKAO_REST_API_KEY;
if (!KAKAO_KEY) {
  console.error("KAKAO_REST_API_KEY 환경변수를 설정해주세요.");
  process.exit(1);
}

interface KakaoPlace {
  place_name: string;
  x: string; // lng
  y: string; // lat
  place_url: string;
}

interface KakaoResponse {
  documents: KakaoPlace[];
}

// "벚꽃길" 등을 제거한 폴백 검색어 생성
function getFallbackQueries(name: string): string[] {
  const queries: string[] = [];
  // "OO 벚꽃길" → "OO", "OO 벚꽃" → "OO"
  const stripped = name
    .replace(/\s*(벚꽃길|벚꽃|진달래·벚꽃길)$/, "")
    .trim();
  if (stripped && stripped !== name) queries.push(stripped);
  // "OO 벚꽃길" → "OO 공원" 등은 이미 랜드마크명이므로 그대로
  return queries;
}

// 명소 이름으로 Kakao 키워드 검색 (실패 시 폴백 검색어로 재시도)
async function searchPlace(
  query: string,
): Promise<{ lat: number; lng: number } | null> {
  const candidates = [query, ...getFallbackQueries(query)];

  for (const q of candidates) {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(q)}&size=1`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
    });

    if (!res.ok) {
      console.error(`  ❌ API 에러: ${res.status} ${res.statusText}`);
      return null;
    }

    const data: KakaoResponse = await res.json();
    if (data.documents.length > 0) {
      if (q !== query) console.log(`  🔄 폴백 "${q}"로 검색 성공`);
      const place = data.documents[0];
      return {
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      };
    }
  }

  console.warn(`  ⚠️ "${query}" 검색 결과 없음 (폴백 포함)`);
  return null;
}

async function main() {
  const regionsPath = path.resolve(
    __dirname,
    "../src/lib/data/regions.ts",
  );
  let content = fs.readFileSync(regionsPath, "utf-8");

  // regions.ts에서 명소 이름 추출
  const spotRegex = /\{ name: "([^"]+)" \}/g;
  const spots: string[] = [];
  let match;
  while ((match = spotRegex.exec(content)) !== null) {
    spots.push(match[1]);
  }

  console.log(`총 ${spots.length}개 명소 좌표 수집 시작...\n`);

  let updated = 0;
  for (const spotName of spots) {
    console.log(`🔍 "${spotName}" 검색 중...`);
    const coords = await searchPlace(spotName);

    if (coords) {
      // { name: "명소" } → { name: "명소", lat: xx, lng: yy }
      const oldStr = `{ name: "${spotName}" }`;
      const newStr = `{ name: "${spotName}", lat: ${coords.lat}, lng: ${coords.lng} }`;
      content = content.replace(oldStr, newStr);
      console.log(`  ✅ lat: ${coords.lat}, lng: ${coords.lng}`);
      updated++;
    }

    // API 호출 간격 (과도한 요청 방지)
    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync(regionsPath, content, "utf-8");
  console.log(`\n✨ 완료! ${updated}/${spots.length}개 명소 좌표 업데이트됨`);
}

main().catch(console.error);
