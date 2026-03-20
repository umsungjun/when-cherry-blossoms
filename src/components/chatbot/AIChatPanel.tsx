"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Bot, Flower2, Send, Trash2 } from "lucide-react";

import { useAIChat } from "@/lib/hooks/useAIChat";
import { cn } from "@/lib/utils/cn";

const QUICK_PROMPTS = [
  "서울 벚꽃 언제 펴?",
  "제주도 벚꽃 지금 볼 수 있어?",
  "이번 주말 벚꽃 보러 어디 가면 돼?",
  "벚꽃 만개 시기 놓쳤는데 아직 볼 데 있어?",
  "진해 군항제 벚꽃 언제가 제일 예뻐?",
  "비 오면 벚꽃 금방 져?",
  "벚꽃 야경 볼 만한 곳 추천해줘",
  "부산이랑 서울 중에 어디가 먼저 펴?",
];

export function AIChatPanel() {
  const { messages, isLoading, error, sendMessage, clearMessages } =
    useAIChat();
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-[rgba(255,77,166,0.2)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-[#ff4da6]" />
          <span className="text-text-primary text-sm font-semibold">
            AI 버꼬
          </span>
          <span className="bg-sakura-800 text-accent-light rounded-full px-2 py-0.5 text-xs">
            Gemini 2.0 Flash
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-text-faint transition-colors hover:text-[#ff4da6]"
            title="대화 초기화"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3 py-4">
            <p className="text-text-muted flex items-center justify-center gap-1.5 text-center text-sm">
              <Flower2 size={14} className="text-[#ff4da6]" />
              벚꽃에 대해 무엇이든 물어보세요!
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="bg-sakura-900 text-text-secondary rounded-xl border border-[rgba(255,77,166,0.2)] px-3 py-2 text-left text-xs transition-colors hover:border-[#ff4da6] hover:text-[#ff4da6]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "rounded-tr-sm bg-[#ff4da6] text-white"
                  : "bg-sakura-900 text-text-primary rounded-tl-sm border border-[rgba(255,77,166,0.2)]"
              )}
            >
              {msg.role === "ai" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-1 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-accent-light font-semibold">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-sakura-800 rounded px-1 py-0.5 font-mono text-xs text-[#ff4da6]">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-sakura-900 rounded-2xl rounded-tl-sm border border-[rgba(255,77,166,0.2)] px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-[#ff4da6]"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-center text-xs text-red-400">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-[rgba(255,77,166,0.2)] p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="벚꽃에 대해 물어보세요..."
          maxLength={500}
          rows={1}
          className="bg-sakura-900 text-text-primary placeholder:text-text-faint max-h-28 flex-1 resize-none rounded-xl border border-[rgba(255,77,166,0.2)] px-3 py-2 text-sm transition-colors outline-none focus:border-[#ff4da6]"
          style={{ scrollbarWidth: "none" }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            "rounded-xl p-2.5 transition-all",
            input.trim() && !isLoading
              ? "bg-[#ff4da6] text-white hover:bg-[#e0358a]"
              : "bg-sakura-800 text-text-faint cursor-not-allowed"
          )}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
