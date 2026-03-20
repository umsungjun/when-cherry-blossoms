import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sakura-950 text-text-muted shrink-0 border-t border-[rgba(255,77,166,0.15)] py-6 text-center text-xs">
      <p>
        벚꽃 언제 필까? · 개화 데이터는 기상청 예보 기반이며 실제와 다를 수
        있습니다
      </p>
      <p className="text-text-dim mt-1">
        날씨 데이터: Open-Meteo · AI: Gemini 2.0 Flash
      </p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <a
          href="https://github.com/umsungjun"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted flex items-center gap-1.5 transition-colors hover:text-[#ff4da6]"
        >
          <Github size={14} />
          umsungjun
        </a>
        <a
          href="https://www.linkedin.com/in/frontend-developer-umsungjun/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted flex items-center gap-1.5 transition-colors hover:text-[#ff4da6]"
        >
          <Linkedin size={14} />
          frontend-developer-umsungjun
        </a>
      </div>
    </footer>
  );
}
