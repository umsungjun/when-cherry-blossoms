"use client";

import { useCallback, useEffect, useState } from "react";

import { ChatHistory, ChatMessage } from "@/types/chat";

const STORAGE_KEY = "cherry_chat_messages";
const MAX_MESSAGES = 50;

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // localStorage 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored));
    } catch {
      /* 무시 */
    }
  }, []);

  const saveMessages = (msgs: ChatMessage[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(msgs.slice(-MAX_MESSAGES))
      );
    } catch {
      /* 무시 */
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      const optimistic = [...messages, userMsg];
      setMessages(optimistic);
      setIsLoading(true);
      setError(null);

      // Gemini API용 history 변환 (대화 내역)
      const history: ChatHistory[] = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "응답 실패");
        }

        const aiMsg: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: "ai",
          content: data.answer,
          timestamp: Date.now(),
        };

        const updated = [...optimistic, aiMsg];
        setMessages(updated);
        saveMessages(updated);
      } catch (e) {
        // 롤백
        setMessages(messages);
        setError(e instanceof Error ? e.message : "오류가 발생했어요");
        setTimeout(() => setError(null), 6000);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { messages, isLoading, error, sendMessage, clearMessages };
}
