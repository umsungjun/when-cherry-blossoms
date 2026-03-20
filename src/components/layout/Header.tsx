"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import Link from "next/link";

import { MapPin, MessageCircle, Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // 서버/클라이언트 hydration 불일치 방지 — 마운트 후에만 아이콘 렌더
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-8 rounded-lg" />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="text-text-muted hover:bg-sakura-800 rounded-lg p-1.5 transition-colors hover:text-[#ff4da6]"
      aria-label="테마 전환"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function Header() {
  return (
    <header className="bg-sakura-950/90 sticky top-0 z-50 border-b border-[rgba(255,77,166,0.2)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-text-primary text-lg font-extrabold tracking-tight">
            벚꽃 언제 필까?
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/regions"
            className="text-text-secondary hover:bg-sakura-800 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:text-[#ff4da6]"
          >
            <MapPin size={15} />
            <span className="hidden sm:block">지역별</span>
          </Link>

          <Link
            href="/chatbot"
            className="text-text-secondary hover:bg-sakura-800 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:text-[#ff4da6]"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:block">AI 버꼬</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
