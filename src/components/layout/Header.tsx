import Link from "next/link";

import { MapPin, MessageCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,77,166,0.2)] bg-[#0d0812]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-[#ffd6e8]">
            벚꽃 언제 필까?
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/regions"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#c090a8] transition-colors hover:bg-[#2d1535] hover:text-[#ff4da6]"
          >
            <MapPin size={15} />
            <span className="hidden sm:block">지역별</span>
          </Link>

          <Link
            href="/chatbot"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#c090a8] transition-colors hover:bg-[#2d1535] hover:text-[#ff4da6]"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:block">AI 도우미</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
