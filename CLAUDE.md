# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 빌드 및 개발 명령어

```bash
pnpm dev          # 개발 서버 (Turbopack)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
npx prettier --write "src/**/*.{ts,tsx}"  # 전체 포맷팅
```

테스트 프레임워크는 아직 설정되지 않음.

## 아키텍처

Next.js 16 App Router + Tailwind CSS v4 + Firebase Firestore 기반 벚꽃 개화 예보 서비스.

### 핵심 데이터 흐름

```
REGIONS (src/lib/data/regions.ts, 16개 지역 정적 데이터)
  ↓ enrichRegion(region, today)
RegionWithStatus (status, bloomProgress, daysUntil* 런타임 계산)
  ↓
페이지 렌더링 (메인, 지역별, 상세)
```

`Region`(정적 DateInfo)을 `RegionWithStatus`(런타임 상태)로 변환하는 `enrichRegion()`이 데이터 흐름의 핵심. 직접 상태를 계산하지 말고 항상 이 함수를 사용할 것.

### 페이지 구조

- `/` — 서버 컴포넌트. AI 예측 fetch + 기상청 vs AI 비교 카드 그리드
- `/regions` — 서버에서 predictions fetch → `RegionsClient`(클라이언트)에 prop 전달
- `/regions/[regionId]` — 상세 페이지 (날씨, 타임라인, 댓글, 추천명소 이미지)
- `/chatbot` — AI 버꼬 채팅 UI

### API 라우트

- `POST /api/chat` — Gemma 3 27B 유저 대화 (시스템 프롬프트에 현재 개화 현황 주입)
- `GET /api/weather?lat=X&lng=Y` — Open-Meteo 7일 예보 + 낙화 위험도
- `GET /api/bloom-status` — 전국 개화 상태
- `GET /api/recommendation` — 날씨 기반 방문 추천 (scoreRegion 알고리즘)
- `GET /api/cron/update-predictions` — Vercel Cron 전용. `CRON_SECRET` 인증 필요, `forceRefresh`로 AI 예측 갱신

## AI 모델 사용 정책

| 용도 | 모델 | 상수 | 제한 |
|---|---|---|---|
| 계산·예측 (내부 로직) | `gemini-2.5-flash` | `PREDICTION_MODEL` | 무료 20회/일 |
| 유저 문답 (AI 버꼬) | `gemma-3-27b-it` | `CHAT_MODEL` | 요청별 |

- 새 AI 호출 추가 시 반드시 위 구분에 따라 올바른 상수를 선택할 것.
- **Prediction 캐싱**: 인메모리 + `.cache/ai-predictions.json` 파일 이중 캐시 (24시간 TTL). Vercel Cron으로 매일 KST 12:00에 `forceRefresh`로 갱신. dev 서버 재시작 시에도 파일 캐시에서 즉시 로드.
- **Chat**: Gemma는 `systemInstruction` 미지원 → 첫 메시지로 시스템 프롬프트 주입. history 최대 18개.
- `revalidate = 86400` (24시간) → Vercel Cron이 하루 1회 능동 갱신하므로 ISR은 폴백 역할.

## 테마 시스템 (다크/라이트)

`next-themes` (`attribute="class"`, `defaultTheme="light"`)로 전환. `html.light` 클래스가 CSS 변수를 오버라이드.

**컴포넌트에서 색상 사용 규칙:**
- 텍스트: `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-faint`, `text-text-dim`
- 배경: `bg-sakura-950` ~ `bg-sakura-600` (라이트 모드에서 자동 역전)
- 액센트: `text-[#ff4da6]` (핫 핑크, 양쪽 모드 공용)
- **하드코딩 hex 사용 금지** — 반드시 CSS 변수 기반 Tailwind 클래스 사용

## Tailwind v4 주의사항

- `@theme {}` 블록에서 커스텀 색상 토큰 정의 (globals.css)
- 그래디언트: `bg-gradient-to-r` ❌ → `bg-linear-to-r` ✅
- `@theme`의 `--color-*` 변수는 `html.light`에서 런타임 오버라이드 가능

## Firebase 패턴

- **지연 초기화**: `getDb()`, `getFirebaseAuth()` 호출로만 접근 (SSR 안전)
- **댓글**: `regions/{regionId}/comments` 컬렉션, `onSnapshot()` 실시간 구독
- 직접 `initializeApp()` 호출 금지.

## 명소 데이터 & 외부 API

### 명소 구조 (`FamousSpot`)

```typescript
{ name: string, lat?: number, lng?: number, imageUrl?: string }
```

- 좌표: Kakao Local API로 1회 수집 → `regions.ts`에 정적 저장 (`scripts/fetch-spot-coords.ts`)
- 이미지: 한국관광공사 TourAPI(KorService2)로 1회 수집 → `regions.ts`에 정적 저장 (`scripts/fetch-spot-images.ts`)
- 런타임 API 호출 없음 — 모든 데이터 빌드 시점에 확정

### 외부 API 키 (1회성 스크립트용)

| API | 키 | 용도 |
|---|---|---|
| Kakao Local | `KAKAO_REST_API_KEY` | 명소 좌표 검색 |
| 한국관광공사 TourAPI | `TOUR_API_KEY` | 명소 대표 이미지 |

**TourAPI 주의**: 엔드포인트는 `KorService2` (not KorService1), API 메서드는 `searchKeyword2`.

## 캐싱 전략 요약

| 대상 | TTL | 방식 |
|---|---|---|
| AI 예측 | 24시간 | 인메모리 + 파일 (`.cache/ai-predictions.json`) + Vercel Cron 매일 갱신 |
| 날씨 (Open-Meteo) | 30분 | Next.js `revalidate` + 날짜 변경 시 자동 갱신 |
| 메인/지역 페이지 | 24시간 | Next.js `revalidate = 86400` |
| 명소 좌표/이미지 | 영구 | `regions.ts` 정적 데이터 |

## 데이터 소스 로드맵

**현재 (Phase 1)**: `regions.ts` 하드코딩 + Gemini 2.5 Flash AI 예측 날짜 생성

**향후 (Phase 2)**: 기상청 봄꽃개화현황 페이지 크롤링 연동. 기상청 날씨누리 페이지는 JS 동적 렌더링 — 실제 데이터 발표 후 Network 탭에서 내부 API 엔드포인트 확인 필요. `enrichRegion()` 로직 유지, 메인 카드에 기상청 vs AI 두 날짜 나란히 표시 (현재 UI 이미 대응).
