"use client";

import Link from "next/link";

import { MapPin, MessageCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-sakura-800 hover:text-[#ff4da6]"
      aria-label="테마 전환"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,77,166,0.2)] bg-sakura-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-text-primary">
            벚꽃 언제 필까?
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/regions"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-sakura-800 hover:text-[#ff4da6]"
          >
            <MapPin size={15} />
            <span className="hidden sm:block">지역별</span>
          </Link>

          <Link
            href="/chatbot"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-sakura-800 hover:text-[#ff4da6]"
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
