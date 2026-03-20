import { Metadata } from "next";

import { Bot } from "lucide-react";

import { AIChatPanel } from "@/components/chatbot/AIChatPanel";

export const metadata: Metadata = {
  title: "AI 버꼬",
  description:
    "Gemini 2.0 Flash AI가 현재 전국 벚꽃 개화 상황을 바탕으로 여행지를 추천해드려요.",
};

export default function ChatbotPage() {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col overflow-hidden px-4 py-6">
      <div className="mb-4">
        <h1 className="text-text-primary flex items-center gap-2 text-xl font-extrabold">
          <Bot size={22} className="text-[#ff4da6]" />
          AI 버꼬
        </h1>
        <p className="text-text-muted mt-0.5 text-xs">
          Gemini 2.0 Flash · 현재 개화 현황 반영
        </p>
      </div>
      <div className="card min-h-0 flex-1 overflow-hidden">
        <AIChatPanel />
      </div>
    </div>
  );
}
