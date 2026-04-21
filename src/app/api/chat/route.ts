import { NextRequest, NextResponse } from "next/server";

import { CHAT_MODEL, buildSystemPrompt, genAI } from "@/lib/api/gemini";
import { REGIONS } from "@/lib/data/regions";
import { readFirestorePredictions } from "@/lib/firebase/predictions";
import { enrichRegion } from "@/lib/utils/bloom";
import { ChatHistory } from "@/types/chat";
import { DateInfo } from "@/types/region";

const parseDate = (s: string): DateInfo => {
  const [month, day] = s.split("/").map(Number);
  return { month, day };
};

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = (await req.json()) as {
      message: string;
      history: ChatHistory[];
    };

    if (!message?.trim() || message.length > 500) {
      return NextResponse.json(
        { error: "메시지를 확인해주세요" },
        { status: 400 }
      );
    }

    // AI 예측 캐시에서 bloom/peak/fall 날짜를 가져와 regions에 머지
    const today = new Date();
    const predResult = await readFirestorePredictions();
    const predData = predResult?.data ?? {};

    const enrichedRegions = REGIONS.map((r) => {
      const pred = predData[r.id];
      if (!pred) return enrichRegion(r, today);
      return enrichRegion(
        {
          ...r,
          bloom: parseDate(pred.bloom),
          peak: parseDate(pred.peak),
          fall: parseDate(pred.fall),
        },
        today
      );
    });

    const systemPrompt = buildSystemPrompt(enrichedRegions);

    // Gemma는 systemInstruction 미지원 → 첫 번째 user/model 턴으로 대체
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "네, 알겠습니다!" }] },
      ...history.slice(-18), // 최대 18개 이전 메시지
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await genAI.models.generateContent({
      model: CHAT_MODEL,
      contents,
      config: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    const answer = response.text ?? "죄송해요, 잠시 후 다시 시도해주세요.";
    return NextResponse.json({ answer });
  } catch (e: unknown) {
    console.error("Chat error:", e);
    const isQuota = e instanceof Error && e.message.includes("429");
    if (isQuota) {
      return NextResponse.json(
        {
          error: "잠시 후 다시 시도해주세요 (사용량 초과)",
          code: "QUOTA_EXCEEDED",
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "AI 응답 실패", code: "API_ERROR" },
      { status: 500 }
    );
  }
}
