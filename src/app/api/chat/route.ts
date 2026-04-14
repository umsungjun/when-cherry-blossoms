import { NextRequest, NextResponse } from "next/server";

import { CHAT_MODEL, buildSystemPrompt, genAI } from "@/lib/api/gemini";
import { REGIONS } from "@/lib/data/regions";
import { enrichRegion } from "@/lib/utils/bloom";
import { ChatHistory } from "@/types/chat";

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

    // 현재 개화 현황 주입
    const today = new Date();
    const enrichedRegions = REGIONS.map((r) => enrichRegion(r, today));
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
