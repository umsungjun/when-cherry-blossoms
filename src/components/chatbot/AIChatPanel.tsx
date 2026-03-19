"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Bot, Send, Trash2 } from "lucide-react";

import { useAIChat } from "@/lib/hooks/useAIChat";
import { cn } from "@/lib/utils/cn";

const QUICK_PROMPTS = [
  "지금 당장 갈 수 있는 가장 좋은 곳은?",
  "서울 벚꽃은 언제 피나요?",
  "만개 시기를 놓쳤어요, 아직 볼 수 있는 곳은?",
  "이번 주말 비 예보, 어디가 좋을까요?",
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="border-blossom-100 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blossom-500" />
          <span className="text-blossom-900 text-sm font-semibold">
            벚꽃 AI 도우미
          </span>
          <span className="bg-blossom-100 text-blossom-500 rounded-full px-2 py-0.5 text-xs">
            Gemini 2.0 Flash
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-gray-300 transition-colors hover:text-gray-500"
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
            <p className="text-center text-sm text-gray-400">
              🌸 벚꽃 여행에 대해 무엇이든 물어보세요!
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="border-blossom-200 hover:border-blossom-300 hover:bg-blossom-50 rounded-xl border bg-white px-3 py-2 text-left text-xs text-gray-600 transition-colors"
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
                  ? "bg-blossom-600 rounded-tr-sm text-white"
                  : "border-blossom-100 rounded-tl-sm border bg-white text-gray-700"
              )}
            >
              {msg.role === "ai" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-1 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-blossom-700 font-semibold">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-blossom-50 text-blossom-600 rounded px-1 py-0.5 font-mono text-xs">
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
            <div className="border-blossom-100 rounded-2xl rounded-tl-sm border bg-white px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="bg-blossom-300 animate-pulse-soft h-1.5 w-1.5 rounded-full"
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
        className="border-blossom-100 flex items-end gap-2 border-t p-3"
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
          className="border-blossom-200 focus:border-blossom-400 max-h-28 flex-1 resize-none rounded-xl border px-3 py-2 text-sm transition-colors outline-none placeholder:text-gray-300"
          style={{ scrollbarWidth: "none" }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            "rounded-xl p-2.5 transition-all",
            input.trim() && !isLoading
              ? "bg-blossom-600 hover:bg-blossom-700 text-white"
              : "cursor-not-allowed bg-gray-100 text-gray-300"
          )}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
