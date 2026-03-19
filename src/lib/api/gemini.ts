import { GoogleGenAI } from "@google/genai";

import { RegionWithStatus } from "@/types/region";

import { BLOOM_STATUS_LABEL } from "../utils/bloom";

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
  };

  for (const r of regions) {
    grouped[r.status]?.push(r.name);
  }

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `당신은 대한민국 벚꽃 여행 전문 AI 어시스턴트입니다.

오늘 날짜: ${today}

현재 전국 벚꽃 개화 상황:
- 만개 중: ${grouped.peak.join(", ") || "없음"}
- 개화 중: ${grouped.blooming.join(", ") || "없음"}
- 개화 전 (1주일 이내): ${grouped.before.join(", ") || "없음"}
- 낙화 중: ${grouped.falling.join(", ") || "없음"}
- 종료: ${grouped.done.join(", ") || "없음"}

답변 규칙:
- 항상 한국어로 답변하세요
- 구체적인 날짜와 지역명을 포함하세요
- 친근하고 따뜻한 말투를 사용하세요
- 200자 이내로 간결하게 답변하세요 (상세 질문 시 확장 가능)
- 벚꽃 관련 질문이 아니면 "저는 벚꽃 여행 전문이에요 🌸" 라고 답하세요`;
}

// gemini-2.0-flash: Gemma 3 27B 대비 한국어·추론 품질이 월등히 높고 무료 티어 지원
// Gemma를 원하는 경우 "gemma-3-27b-it" 로 교체 가능
export const GEMMA_MODEL = "gemini-2.0-flash";
