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
