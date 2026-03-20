"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Bot, Flower2, Send, Trash2 } from "lucide-react";

import { useAIChat } from "@/lib/hooks/useAIChat";
import { cn } from "@/lib/utils/cn";

const QUICK_PROMPTS = [
  "지금 당장 갈 수 있는 가장 좋은 곳은?",
  "서울 벚꽃은 언제 피나요?",
  "만개 시기를 놓쳤어요, 아직 볼 수 있는 곳은?",
  "이번 주말 비 예보, 어디가 좋을까요?",
];

export function AIChatPanel() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const submit = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-[rgba(255,77,166,0.2)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-[#ff4da6]" />
          <span className="text-sm font-semibold text-text-primary">AI 버꼬</span>
          <span className="rounded-full bg-sakura-800 px-2 py-0.5 text-xs text-accent-light">Gemini 2.0 Flash</span>
        </div>
        {messages.length > 0 && (
          <button onClick={clearMessages} className="text-text-faint transition-colors hover:text-[#ff4da6]" title="대화 초기화">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3 py-4">
            <p className="flex items-center justify-center gap-1.5 text-center text-sm text-text-muted">
              <Flower2 size={14} className="text-[#ff4da6]" />
              벚꽃 여행에 대해 무엇이든 물어보세요!
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {QUICK_PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="rounded-xl border border-[rgba(255,77,166,0.2)] bg-sakura-900 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:border-[#ff4da6] hover:text-[#ff4da6]">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              msg.role === "user"
                ? "rounded-tr-sm bg-[#ff4da6] text-white"
                : "rounded-tl-sm border border-[rgba(255,77,166,0.2)] bg-sakura-900 text-[#e8c0d4]"
            )}>
              {msg.role === "ai" ? (
                <ReactMarkdown components={{
                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-accent-light">{children}</strong>,
                  code: ({ children }) => <code className="rounded bg-sakura-800 px-1 py-0.5 font-mono text-xs text-[#ff4da6]">{children}</code>,
                }}>
                  {msg.content}
                </ReactMarkdown>
              ) : msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm border border-[rgba(255,77,166,0.2)] bg-sakura-900 px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <div key={delay} className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-[#ff4da6]" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-center text-xs text-red-400">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-[rgba(255,77,166,0.2)] p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="벚꽃에 대해 물어보세요..."
          maxLength={500}
          rows={1}
          className="max-h-28 flex-1 resize-none rounded-xl border border-[rgba(255,77,166,0.2)] bg-sakura-900 px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-faint focus:border-[#ff4da6]"
          style={{ scrollbarWidth: "none" }}
        />
        <button type="submit" disabled={isLoading || !input.trim()}
          className={cn("rounded-xl p-2.5 transition-all",
            input.trim() && !isLoading
              ? "bg-[#ff4da6] text-white hover:bg-[#e0358a]"
              : "cursor-not-allowed bg-sakura-800 text-text-faint"
          )}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
