/**
 * 한국관광공사 TourAPI로 명소 대표 이미지를 1회 수집하여 regions.ts에 반영하는 스크립트
 * 실행: npx tsx scripts/fetch-spot-images.ts
 */

import * as fs from "fs";
import * as path from "path";

const TOUR_KEY = process.env.TOUR_API_KEY;
if (!TOUR_KEY) {
  console.error("TOUR_API_KEY 환경변수를 설정해주세요.");
  process.exit(1);
}

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

interface TourItem {
  title: string;
  firstimage: string;
  firstimage2: string; // 썸네일
  contentid: string;
}

interface TourResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      items: { item: TourItem[] | TourItem } | "";
      totalCount: number;
    };
  };
}

// 키워드로 관광지 검색하여 대표 이미지 URL 반환
async function searchSpotImage(keyword: string): Promise<string | null> {
  // serviceKey는 URLSearchParams로 인코딩하면 안 됨
  const url = `${BASE_URL}/searchKeyword2?serviceKey=${TOUR_KEY}&numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=WhenCherryBlossoms&_type=json&arrange=A&keyword=${encodeURIComponent(keyword)}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`  ❌ API 에러: ${res.status}`);
    return null;
  }

  const text = await res.text();
  let data: TourResponse;
  try {
    data = JSON.parse(text);
  } catch {
    console.error(`  ❌ JSON 파싱 실패: ${text.slice(0, 100)}`);
    return null;
  }

  const items = data.response?.body?.items;
  if (!items || typeof items === "string") return null;

  const itemList = Array.isArray(items.item) ? items.item : [items.item];

  // 이미지가 있는 첫 번째 항목 반환
  for (const item of itemList) {
    if (item.firstimage) {
      return item.firstimage;
    }
  }

  return null;
}

async function main() {
  const regionsPath = path.resolve(__dirname, "../src/lib/data/regions.ts");
  let content = fs.readFileSync(regionsPath, "utf-8");

  // 이미 imageUrl이 있는 명소는 스킵하기 위해 없는 것만 추출
  // { name: "명소", lat: xx, lng: yy } 패턴 매칭
  const spotRegex = /\{ name: "([^"]+)"(?:, lat: [^,]+, lng: [^}]+)? \}/g;
  const spots: string[] = [];
  let match;
  while ((match = spotRegex.exec(content)) !== null) {
    // 이미 imageUrl이 있으면 스킵
    const surrounding = content.slice(match.index, match.index + match[0].length + 50);
    if (!surrounding.includes("imageUrl")) {
      spots.push(match[1]);
    }
  }

  console.log(`총 ${spots.length}개 명소 이미지 수집 시작...\n`);

  let found = 0;
  let notFound: string[] = [];

  for (const spotName of spots) {
    // "벚꽃길" 등을 제거하고 핵심 장소명으로 검색
    const searchName = spotName
      .replace(/\s*(벚꽃길|벚꽃|왕벚꽃길|진달래·벚꽃길)$/, "")
      .trim() || spotName;

    console.log(`🔍 "${spotName}" → 검색어: "${searchName}"`);
    let imageUrl = await searchSpotImage(searchName);

    // 폴백: 원본 이름으로 재시도
    if (!imageUrl && searchName !== spotName) {
      console.log(`  🔄 원본 "${spotName}"으로 재시도...`);
      imageUrl = await searchSpotImage(spotName);
    }

    if (imageUrl) {
      // regions.ts에서 해당 명소 객체에 imageUrl 추가
      // { name: "명소", lat: xx, lng: yy } → { name: "명소", lat: xx, lng: yy, imageUrl: "..." }
      const namePattern = `name: "${spotName}"`;
      const spotObjRegex = new RegExp(
        `(\\{ ${namePattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^}]*)(\\s*\\})`
      );
      content = content.replace(spotObjRegex, `$1, imageUrl: "${imageUrl}"$2`);
      console.log(`  ✅ 이미지 확보`);
      found++;
    } else {
      console.warn(`  ⚠️ 이미지 없음`);
      notFound.push(spotName);
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(regionsPath, content, "utf-8");
  console.log(`\n✨ 완료! ${found}/${spots.length}개 이미지 확보`);

  if (notFound.length > 0) {
    console.log(`\n❌ 이미지 없는 명소 (${notFound.length}개):`);
    notFound.forEach((s) => console.log(`  - ${s}`));
  }
}

main().catch(console.error);
