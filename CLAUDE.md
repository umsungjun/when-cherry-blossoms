@AGENTS.md

# AI 모델 사용 정책

## 모델 구분 (`src/lib/api/gemini.ts`)

| 용도 | 모델 | 상수 |
|---|---|---|
| 계산·예측 (내부 로직) | `gemini-2.5-flash` | `PREDICTION_MODEL` |
| 유저 문답 (AI 버꼬 챗봇) | `gemma-3-27b-it` | `CHAT_MODEL` |

- **PREDICTION_MODEL**: 개화 예측, 추천 로직 등 서버 내부에서 AI를 호출할 때 사용. 무료 티어 일 20회 제한.
- **CHAT_MODEL**: `/api/chat` 유저 대화 전용. Gemma 3 27B 모델 사용.
- 새로운 AI 호출을 추가할 때 반드시 위 구분에 따라 올바른 상수를 선택할 것.
- **PREDICTION_MODEL 호출 주기**: `page.tsx`의 `revalidate = 10800` (3시간). 일 최대 8회 호출로 무료 20회 이내 유지.

# 데이터 소스 로드맵

## 현재 (Phase 1)
- 개화 날짜: `src/lib/data/regions.ts`에 하드코딩 (기상청 예보 기반 수동 입력)
- AI 예측: Gemini 2.5 Flash가 하드코딩 데이터 기반으로 방문 팁·추천 기간 생성 (`src/lib/api/prediction.ts`)

## 향후 (Phase 2) — 공공 API 연동 시
- `regions.ts` 하드코딩 → 기상청 공공 API fetch로 교체
- 메인 카드에 **기상청 예보 vs AI 예측** 두 날짜를 나란히 표시
- `enrichRegion()` 로직은 그대로 유지 (데이터 소스만 교체)
