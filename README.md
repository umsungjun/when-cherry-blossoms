# 벚꽃 언제 필까? 🌸

2026년 전국 벚꽃 개화 예보 서비스. 기상청 예보와 AI 예측 날짜를 비교하고, 낙화 위험도와 AI 여행 추천까지 한 번에 확인할 수 있습니다.

**배포 URL:** https://when-cherry-blossoms.kro.kr

---

## 주요 기능

- **기상청 vs AI 개화 비교** — 전국 16개 지역의 기상청 예보 + 적산온도(GDD) 기반 Gemini 2.5 Flash AI 예측 날짜를 나란히 표시
- **적산온도 기반 AI 예측** — Open-Meteo Historical API로 올해 2~3월 실측 기온을 수집하고, 위도별 GDD 임계값을 기반으로 과학적 개화 예측
- **낙화 위험도** — Open-Meteo 날씨 데이터(강수량·풍속·돌풍) 기반 실시간 위험도 산출
- **AI 버꼬** — Gemma 3 27B 기반 AI 챗봇, 벚꽃에 관한 질문에 답변
- **다크 / 라이트 모드** — 헤더 토글 버튼으로 전환 (Dark Sakura 테마)

## 기술 스택

| 구분 | 스택 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| AI (예측) | Google Gemini 2.5 Flash |
| AI (챗봇) | Google Gemma 3 27B |
| 날씨 | Open-Meteo API |
| 댓글 | Firebase Firestore |
| 분석 | Microsoft Clarity |
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

개화 날짜는 `src/lib/data/regions.ts`에 정적으로 관리됩니다 (Phase 1). 기상청 공공 API가 공개되면 해당 파일의 데이터 소스만 교체하면 됩니다 (Phase 2).

AI 예측은 Open-Meteo Historical API에서 올해 2월~현재까지의 실측 기온 데이터를 수집하고, 적산온도(GDD, 기준 5°C)와 최근 기온 추세, 향후 7일 예보를 Gemini 2.5 Flash에 제공하여 과학적 근거 기반의 개화·만개·낙화 날짜를 예측합니다. 결과는 인메모리 + 파일 캐시(3시간 TTL)로 관리됩니다.

개화 **상태**는 오늘 날짜와 예보 날짜를 비교해 런타임에 자동 계산됩니다 (`enrichRegion()`).

## 만든 사람

- GitHub: [umsungjun](https://github.com/umsungjun)
- LinkedIn: [frontend-developer-umsungjun](https://www.linkedin.com/in/frontend-developer-umsungjun/)
