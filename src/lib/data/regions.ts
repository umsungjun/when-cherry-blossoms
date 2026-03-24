import { Region } from "@/types/region";

export const REGIONS: Region[] = [
  // ── 수도권 ──
  {
    id: "seoul",
    name: "서울",
    englishName: "Seoul",
    lat: 37.5665,
    lng: 126.978,
    province: "서울특별시",
    famousSpots: [
      { name: "여의도 벚꽃길", lat: 37.5250892160129, lng: 126.947545050571 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/93/3492893_image2_1.jpg"},
      { name: "석촌호수 벚꽃길", lat: 37.51008968822101, lng: 127.1057213421415 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/76/3500876_image2_1.jpg"},
      { name: "서울숲", lat: 37.5443222301513, lng: 127.037617759165 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/01/3532301_image2_1.jpg"},
    ],
  },
  {
    id: "suwon",
    name: "수원",
    englishName: "Suwon",
    lat: 37.2636,
    lng: 127.0286,
    province: "경기도",
    famousSpots: [
      { name: "수원 화성 벚꽃길", lat: 37.2869569586225, lng: 127.011795743342 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/36/2613036_image2_1.jpg"},
      { name: "광교호수공원", lat: 37.28422019285532, lng: 127.06692544726018 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/60/3588560_image2_1.jpg"},
    ],
  },
  // ── 강원 ──
  {
    id: "chuncheon",
    name: "춘천",
    englishName: "Chuncheon",
    lat: 37.8813,
    lng: 127.7298,
    province: "강원특별자치도",
    famousSpots: [
      { name: "의암호 벚꽃길", lat: 37.872118362359785, lng: 127.68434170190555 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/55/3533855_image2_1.jpg"},
      { name: "소양강 스카이워크", lat: 37.89327760440946, lng: 127.72366385956643, imageUrl: "http://tong.visitkorea.or.kr/cms/resource/15/2616515_image2_1.bmp" },
    ],
  },
  {
    id: "gangneung",
    name: "강릉",
    englishName: "Gangneung",
    lat: 37.7519,
    lng: 128.8761,
    province: "강원특별자치도",
    famousSpots: [
      { name: "경포호 벚꽃길", lat: 37.79555514873209, lng: 128.90233728167775 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/58/179558_image2_1.jpg"},
      { name: "남산공원 벚꽃길", lat: 37.5524979951415, lng: 126.989316855952 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/05/3022205_image2_1.jpg"},
    ],
  },
  // ── 충청 ──
  {
    id: "daejeon",
    name: "대전",
    englishName: "Daejeon",
    lat: 36.3504,
    lng: 127.3845,
    province: "대전광역시",
    famousSpots: [
      { name: "유등천 벚꽃길", lat: 36.3261506941347, lng: 127.388906821149, imageUrl: "http://tong.visitkorea.or.kr/cms/resource/76/3350776_image2_1.jpg" },
      { name: "한밭수목원", lat: 36.36994889192411, lng: 127.38801706985069 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/76/3350776_image2_1.jpg"},
    ],
  },
  // ── 전라 ──
  {
    id: "jeonju",
    name: "전주",
    englishName: "Jeonju",
    lat: 35.8242,
    lng: 127.148,
    province: "전라북도",
    famousSpots: [
      { name: "덕진공원 벚꽃길", lat: 35.8474875517327, lng: 127.12102461543232 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/54/3526454_image2_1.jpg"},
      { name: "전주천 벚꽃길", lat: 35.8855026587775, lng: 127.089959613353 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/97/3054097_image2_1.jpg"},
    ],
  },
  {
    id: "gwangju",
    name: "광주",
    englishName: "Gwangju",
    lat: 35.1595,
    lng: 126.8526,
    province: "광주광역시",
    famousSpots: [
      { name: "충장로 벚꽃길", lat: 37.62520472467372, lng: 126.83614193280738 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/58/3453358_image2_1.jpg"},
      { name: "광주천 벚꽃길", lat: 35.16830105217562, lng: 126.8642164724057, imageUrl: "http://tong.visitkorea.or.kr/cms/resource/58/3453358_image2_1.jpg" },
    ],
  },
  {
    id: "suncheon",
    name: "순천",
    englishName: "Suncheon",
    lat: 34.9506,
    lng: 127.4875,
    province: "전라남도",
    famousSpots: [
      { name: "순천만 국가정원", lat: 34.9292183256846, lng: 127.498901621838, imageUrl: "https://tong.visitkorea.or.kr/cms/resource/76/1971676_image2_1.jpg" },
      { name: "팔마경기장 벚꽃길", lat: 34.9360841384054, lng: 127.518283092972, imageUrl: "https://tong.visitkorea.or.kr/cms/resource/76/1971676_image2_1.jpg" },
    ],
  },
  {
    id: "yeosu",
    name: "여수",
    englishName: "Yeosu",
    lat: 34.7604,
    lng: 127.6622,
    province: "전라남도",
    famousSpots: [
      { name: "영취산 진달래·벚꽃길", lat: 35.507413614608154, lng: 128.57688944311212 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/89/4010789_image2_1.jpg"},
      { name: "돌산공원", lat: 34.7305471491985, lng: 127.739927808873 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/54/3534454_image2_1.jpg"},
    ],
  },
  {
    id: "mokpo",
    name: "목포",
    englishName: "Mokpo",
    lat: 34.8118,
    lng: 126.3922,
    province: "전라남도",
    famousSpots: [
      { name: "유달산 벚꽃길", lat: 34.789908703139815, lng: 126.37263283814109 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/97/1887197_image2_1.jpg"},
      { name: "삼학도 벚꽃길", lat: 37.4853616966891, lng: 127.017041541487 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/15/3521515_image2_1.jpg"},
    ],
  },
  // ── 경상 ──
  {
    id: "daegu",
    name: "대구",
    englishName: "Daegu",
    lat: 35.8714,
    lng: 128.6014,
    province: "대구광역시",
    famousSpots: [
      { name: "이월드 벚꽃길", lat: 35.854605222773095, lng: 128.5611667344503 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/96/4018396_image2_1.jpg"},
      { name: "앞산공원 벚꽃길", lat: 35.82721640685348, lng: 128.58765535374687 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/43/3338343_image2_1.jpg"},
      { name: "달성공원 벚꽃길", lat: 35.8740343528945, lng: 128.577757377213 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/60/3565160_image2_1.jpg"},
    ],
  },
  {
    id: "pohang",
    name: "포항",
    englishName: "Pohang",
    lat: 36.019,
    lng: 129.3435,
    province: "경상북도",
    famousSpots: [
      { name: "형산강 벚꽃길", lat: 36.0193884555177, lng: 129.377925689723 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/79/3499479_image2_1.jpg"},
      { name: "영일대해수욕장", lat: 36.0550695749354, lng: 129.378187000619 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/46/3584546_image2_1.jpg"},
    ],
  },
  {
    id: "ulsan",
    name: "울산",
    englishName: "Ulsan",
    lat: 35.5384,
    lng: 129.3114,
    province: "울산광역시",
    famousSpots: [
      { name: "태화강 국가정원", lat: 35.5480699197143, lng: 129.297046216516 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/43/3422843_image2_1.png"},
      { name: "작천정 벚꽃길", lat: 35.54742439282003, lng: 129.11490691841274 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/99/3512199_image2_1.jpg"},
    ],
  },
  {
    id: "busan",
    name: "부산",
    englishName: "Busan",
    lat: 35.1796,
    lng: 129.0756,
    province: "부산광역시",
    famousSpots: [
      { name: "온천천 벚꽃길", lat: 35.192673787800494, lng: 129.0959777683683 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/33/2822333_image2_1.png"},
      { name: "삼락공원 벚꽃길", lat: 35.16913430208613, lng: 128.97318637650778, imageUrl: "https://tong.visitkorea.or.kr/cms/resource/90/3497090_image2_1.jpg" },
      { name: "대저 벚꽃길", lat: 35.2095242586851, lng: 128.984252034745 , imageUrl: "https://tong.visitkorea.or.kr/cms/resource/14/3491914_image2_1.jpg"},
    ],
  },
  {
    id: "changwon",
    name: "창원",
    englishName: "Changwon",
    lat: 35.2279,
    lng: 128.6811,
    province: "경상남도",
    famousSpots: [
      { name: "진해 군항제", lat: 35.1493925576009, lng: 128.659631080052, imageUrl: "https://tong.visitkorea.or.kr/cms/resource/72/4020672_image2_1.JPG" },
      { name: "경화역 벚꽃길", lat: 35.1592422630322, lng: 128.68669561412 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/04/3516504_image2_1.jpg"},
      { name: "여좌천 벚꽃길", lat: 35.1622297838177, lng: 128.660414261631 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/01/3329901_image2_1.jpg"},
    ],
  },
  // ── 제주 ──
  {
    id: "jeju",
    name: "제주",
    englishName: "Jeju",
    lat: 33.4996,
    lng: 126.5312,
    province: "제주특별자치도",
    famousSpots: [
      { name: "녹산로 벚꽃길", lat: 33.3937048344241, lng: 126.731674016969 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/69/3588469_image2_1.jpg"},
      { name: "전농로 왕벚꽃길", lat: 33.5044186001404, lng: 126.515812059181 , imageUrl: "http://tong.visitkorea.or.kr/cms/resource/66/3523366_image2_1.jpg"},
      { name: "제주대학교 벚꽃길", lat: 33.459339534077, lng: 126.55925116397, imageUrl: "http://tong.visitkorea.or.kr/cms/resource/66/3523366_image2_1.jpg" },
    ],
  },
];

export const getRegionById = (id: string): Region | undefined =>
  REGIONS.find((r) => r.id === id);
