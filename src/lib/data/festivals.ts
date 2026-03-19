export interface Festival {
  id: string;
  name: string;
  regionId: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  description: string;
  highlights: string[];
  website?: string;
}

export const FESTIVALS: Festival[] = [
  {
    id: "jinhae-gunhangje",
    name: "진해 군항제",
    regionId: "changwon",
    location: "경남 창원시 진해구",
    startDate: "2026-03-28",
    endDate: "2026-04-06",
    description:
      "국내 최대 규모의 벚꽃 축제. 100만 그루 벚나무가 장관을 이루며 군악대 퍼레이드, 야간 조명이 유명합니다.",
    highlights: [
      "여좌천 벚꽃 터널",
      "경화역 벚꽃길",
      "야간 조명",
      "군악대 퍼레이드",
    ],
    website: "https://www.changwon.go.kr/gunhangje",
  },
  {
    id: "jeju-wangbeot",
    name: "제주 왕벚꽃 축제",
    regionId: "jeju",
    location: "제주시 전농로 일대",
    startDate: "2026-03-27",
    endDate: "2026-03-30",
    description:
      "왕벚꽃 자생지 제주에서 열리는 축제. 전농로 1.2km 왕벚꽃 터널과 다양한 문화공연이 함께합니다.",
    highlights: ["전농로 벚꽃 터널", "녹산로 유채꽃 동시 감상", "문화공연"],
  },
  {
    id: "busan-oncheoncheon",
    name: "부산 온천천 벚꽃 축제",
    regionId: "busan",
    location: "부산 동래구 온천천",
    startDate: "2026-03-28",
    endDate: "2026-04-05",
    description:
      "온천천 3km를 따라 펼쳐지는 벚꽃 길. 야간 조명과 함께 바다 도시 부산의 봄을 만끽하세요.",
    highlights: ["온천천 벚꽃 야경", "푸드트럭 마켓", "플리마켓"],
  },
  {
    id: "seoul-yeouido",
    name: "서울 여의도 봄꽃 축제",
    regionId: "seoul",
    location: "서울 영등포구 여의도 한강공원",
    startDate: "2026-04-02",
    endDate: "2026-04-13",
    description:
      "여의도 한강공원 1.7km 벚꽃 터널과 한강 뷰가 어우러지는 서울의 대표 봄꽃 축제입니다.",
    highlights: ["윤중로 벚꽃 터널", "한강 피크닉", "야간 개장", "버스킹"],
  },
  {
    id: "gyeongju-blossom",
    name: "경주 벚꽃마라톤&문화축제",
    regionId: "gyeongju",
    location: "경북 경주시 보문관광단지",
    startDate: "2026-04-05",
    endDate: "2026-04-08",
    description:
      "천년 고도 경주에서 벚꽃을 배경으로 열리는 마라톤과 문화축제. 불국사·석굴암 야경과 함께 즐기세요.",
    highlights: ["보문호수 벚꽃 산책", "마라톤 대회", "야간 문화공연", "야경"],
  },
  {
    id: "jeonju-blossom",
    name: "전주 완산 벚꽃 한마당",
    regionId: "jeonju",
    location: "전북 전주시 완산공원",
    startDate: "2026-04-04",
    endDate: "2026-04-08",
    description:
      "완산공원 벚꽃동산에서 한옥마을과 함께 즐기는 봄 축제. 한식 푸드존과 전통공연이 열립니다.",
    highlights: [
      "완산공원 벚꽃 전망대",
      "한옥마을 연계",
      "전통 공연",
      "한식 특식",
    ],
  },
  {
    id: "daegu-apsan",
    name: "대구 앞산 벚꽃 축제",
    regionId: "daegu",
    location: "대구 남구 앞산공원",
    startDate: "2026-04-04",
    endDate: "2026-04-09",
    description:
      "대구 시민의 쉼터 앞산공원의 벚꽃 축제. 신천 벚꽃길 10km와 연계해 도시 전체가 봄빛으로 물듭니다.",
    highlights: ["앞산 케이블카", "신천 10km 벚꽃길", "야간 경관 조명"],
  },
  {
    id: "suwon-hwaseong",
    name: "수원 화성 봄 문화제",
    regionId: "suwon",
    location: "경기 수원시 화성 행궁 일대",
    startDate: "2026-04-04",
    endDate: "2026-04-12",
    description:
      "유네스코 세계유산 수원화성 성곽을 따라 핀 벚꽃과 조선 시대 궁중 문화를 함께 즐기는 특별한 축제입니다.",
    highlights: [
      "화성 성곽 벚꽃 산책",
      "야간 행궁 개방",
      "궁중 문화 체험",
      "전통 공연",
    ],
  },
  {
    id: "yeosu-spring",
    name: "여수 봄꽃 축제",
    regionId: "yeosu",
    location: "전남 여수시 돌산공원·오동도",
    startDate: "2026-03-29",
    endDate: "2026-04-05",
    description:
      "여수 밤바다와 함께하는 봄꽃 축제. 오동도 동백·벚꽃과 돌산대교 야경이 어우러지는 낭만적인 봄입니다.",
    highlights: ["오동도 동백+벚꽃 동시 감상", "돌산대교 야경", "해산물 특식"],
  },
  {
    id: "boseong-green-tea",
    name: "보성 차밭 봄 페스타",
    regionId: "boseong",
    location: "전남 보성군 율어면",
    startDate: "2026-04-01",
    endDate: "2026-04-07",
    description:
      "초록 녹차밭과 흰 벚꽃의 환상적인 대비. 벚꽃 아래 차 한 잔의 여유를 즐길 수 있습니다.",
    highlights: ["녹차밭+벚꽃 포토스팟", "차 시음 체험", "봄나물 요리 강좌"],
  },
];

/** regionId로 해당 지역 축제 필터링 */
export function getFestivalsByRegion(regionId: string): Festival[] {
  return FESTIVALS.filter((f) => f.regionId === regionId);
}

/** 오늘 기준 진행 중이거나 다가오는 축제 (30일 이내) */
export function getUpcomingFestivals(today: Date = new Date()): Festival[] {
  const limit = new Date(today);
  limit.setDate(limit.getDate() + 30);

  return FESTIVALS.filter((f) => {
    const end = new Date(f.endDate);
    const start = new Date(f.startDate);
    return end >= today && start <= limit;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** 축제 날짜 포맷 "3월 28일 ~ 4월 6일" */
export function formatFestivalDates(festival: Festival): string {
  const s = new Date(festival.startDate);
  const e = new Date(festival.endDate);
  return `${s.getMonth() + 1}월 ${s.getDate()}일 ~ ${e.getMonth() + 1}월 ${e.getDate()}일`;
}

/** 오늘 기준 축제 상태 */
export function getFestivalStatus(
  festival: Festival,
  today: Date = new Date()
): "upcoming" | "ongoing" | "ended" {
  const start = new Date(festival.startDate);
  const end = new Date(festival.endDate);
  if (today < start) return "upcoming";
  if (today <= end) return "ongoing";
  return "ended";
}
