import { GoogleGenAI } from "@google/genai";

import { RegionWithStatus } from "@/types/region";

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const STATUS_LABEL: Record<string, string> = {
  before: "개화 전",
  blooming: "개화 중",
  peak: "만개 중",
  falling: "낙화 중",
  done: "종료",
  unknown: "정보 없음",
};

/** 현재 개화 현황을 담은 시스템 프롬프트 생성 */
export function buildSystemPrompt(regions: RegionWithStatus[]): string {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const regionLines = regions
    .map((r) => {
      const status = STATUS_LABEL[r.status] ?? "정보 없음";
      const dates = [
        r.bloom ? `개화 ${r.bloom.month}/${r.bloom.day}` : null,
        r.peak ? `만개 ${r.peak.month}/${r.peak.day}` : null,
        r.fall ? `낙화 ${r.fall.month}/${r.fall.day}` : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `- ${r.name}: ${status}${dates ? ` (${dates})` : ""}`;
    })
    .join("\n");

  return `당신은 벚꽃에 관해 뭐든 알려주는 AI 도우미입니다.

오늘 날짜: ${today}

현재 전국 벚꽃 현황 (AI 예측 기반):
${regionLines}

답변 규칙:
- 항상 한국어로 답변하세요
- 위 현황 데이터를 반드시 참고하여 답변하세요 (종료된 지역은 꽃이 졌다고 안내)
- 개화일·만개일·낙화일을 구체적으로 포함하세요
- 친근하고 따뜻한 말투를 사용하세요
- 200자 이내로 간결하게 답변하세요 (상세 질문 시 확장 가능)
- 벚꽃과 관련 없는 질문이면 "저는 벚꽃 전문이라 그건 잘 모르겠어요 🌸" 라고 답하세요`;
}

// 계산·AI 예측용 — 무료 티어 일 20회, 내부 로직에서 사용
export const PREDICTION_MODEL = "gemini-2.5-flash";

// 유저 문답(AI 버꼬)용 — Gemma 4 31B
export const CHAT_MODEL = "gemma-4-31b-it";
