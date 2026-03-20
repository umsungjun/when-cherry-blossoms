# 벚꽃 언제 필까? 🌸

2026년 전국 벚꽃 개화 예보 서비스. 지역별 개화일·만개일·낙화일과 낙화 위험도, AI 여행 추천까지 한 번에 확인할 수 있습니다.

**배포 URL:** https://when-cherry-blossoms.vercel.app

---

## 주요 기능

- **지역별 개화 예보** — 전국 16개 지역의 개화·만개·낙화 예정일 (서울부터 수도권·지방 순)
- **낙화 위험도** — Open-Meteo 날씨 데이터(강수량·풍속·돌풍) 기반 실시간 위험도 산출
- **AI 버꼬** — Gemini 2.0 Flash 기반 AI 챗봇, 현재 개화 현황에 맞춘 여행지 추천
- **다크 / 라이트 모드** — 헤더 토글 버튼으로 전환 (Dark Sakura 테마)

## 기술 스택

| 구분 | 스택 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 2.0 Flash |
| 날씨 | Open-Meteo API |
| 댓글 | Firebase Firestore |
| 배포 | Vercel |

## 로컬 실행

```bash
pnpm install
pnpm dev
```

`.env.local` 필요:

```env
GEMINI_API_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 데이터 구조

개화 날짜는 `src/lib/data/regions.ts`에 정적으로 관리됩니다. 기상청 공공 API가 공개되면 해당 파일의 데이터 소스만 교체하면 됩니다.

개화 **상태**는 오늘 날짜와 예보 날짜를 비교해 런타임에 자동 계산됩니다 (`enrichRegion()`).

## 만든 사람

- GitHub: [umsungjun](https://github.com/umsungjun)
- LinkedIn: [frontend-developer-umsungjun](https://www.linkedin.com/in/frontend-developer-umsungjun/)
