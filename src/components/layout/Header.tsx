import Link from "next/link";

import { MapPin, MessageCircle } from "lucide-react";

export function Header() {
  const today = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <header className="border-blossom-200 sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-blossom-600 text-lg font-extrabold tracking-tight">
            🌸 벚꽃 언제 필까?
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <span className="mr-3 hidden text-xs text-gray-400 sm:block">
            {today}
          </span>

          <Link
            href="/regions"
            className="hover:bg-blossom-50 hover:text-blossom-600 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors"
          >
            <MapPin size={15} />
            <span className="hidden sm:block">지역별</span>
          </Link>

          <Link
            href="/chatbot"
            className="hover:bg-blossom-50 hover:text-blossom-600 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:block">AI 도우미</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
