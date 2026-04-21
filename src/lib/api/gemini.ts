import { GoogleGenAI } from "@google/genai";

import { RegionWithStatus } from "@/types/region";

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

/** 현재 개화 현황을 담은 시스템 프롬프트 생성 */
export function buildSystemPrompt(regions: RegionWithStatus[]): string {
  const grouped: Record<string, string[]> = {
    peak: [],
    blooming: [],
    before: [],
    falling: [],
    done: [],
    unknown: [],
  };

  for (const r of regions) {
    grouped[r.status]?.push(r.name);
  }

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `당신은 벚꽃에 관해 뭐든 알려주는 AI 도우미입니다.

오늘 날짜: ${today}

현재 전국 벚꽃 개화 상황:
- 만개 중: ${grouped.peak.join(", ") || "없음"}
- 개화 중: ${grouped.blooming.join(", ") || "없음"}
- 개화 전 (1주일 이내): ${grouped.before.join(", ") || "없음"}
- 낙화 중: ${grouped.falling.join(", ") || "없음"}
- 종료: ${grouped.done.join(", ") || "없음"}
- 기상청 데이터 미발표: ${grouped.unknown.join(", ") || "없음"}

답변 규칙:
- 항상 한국어로 답변하세요
- 구체적인 날짜와 지역명을 포함하세요
- 친근하고 따뜻한 말투를 사용하세요
- 200자 이내로 간결하게 답변하세요 (상세 질문 시 확장 가능)
- 벚꽃과 관련 없는 질문이면 "저는 벚꽃 전문이라 그건 잘 모르겠어요 🌸" 라고 답하세요`;
}

// 계산·AI 예측용 — 무료 티어 일 20회, 내부 로직에서 사용
export const PREDICTION_MODEL = "gemini-2.5-flash";

// 유저 문답(AI 버꼬)용 — Gemma 4 31B
export const CHAT_MODEL = "gemma-4-31b-it";
