const ADJECTIVES = [
  "빠른",
  "귀여운",
  "작은",
  "졸린",
  "배고픈",
  "행복한",
  "신나는",
  "수줍은",
  "용감한",
  "느린",
  "밝은",
  "포근한",
  "촉촉한",
  "달콤한",
  "상큼한",
  "따뜻한",
  "차가운",
  "부드러운",
  "씩씩한",
  "엉뚱한",
  "똑똑한",
  "아기",
  "구름같은",
  "봄같은",
];

const ANIMALS = [
  "판다",
  "토끼",
  "고양이",
  "강아지",
  "햄스터",
  "다람쥐",
  "여우",
  "곰",
  "오리",
  "병아리",
  "고슴도치",
  "너구리",
  "수달",
  "펭귄",
  "코알라",
  "미어캣",
  "캥거루",
  "라마",
  "알파카",
  "플라밍고",
  "수리부엉이",
  "카피바라",
];

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}
