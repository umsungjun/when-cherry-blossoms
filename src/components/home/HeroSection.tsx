import { PetalAnimation } from "@/components/ui/PetalAnimation";

export function HeroSection() {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="from-blossom-100 to-blossom-50 relative overflow-hidden bg-gradient-to-b py-20 text-center">
      <PetalAnimation count={14} />

      {/* 배경 손그림 장식 */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle
            cx="100"
            cy="80"
            r="40"
            fill="none"
            stroke="#c2185b"
            strokeWidth="3"
          />
          <circle
            cx="700"
            cy="300"
            r="55"
            fill="none"
            stroke="#c2185b"
            strokeWidth="3"
          />
          <path
            d="M50 350 Q150 300, 200 350 Q250 400, 350 350"
            fill="none"
            stroke="#c2185b"
            strokeWidth="2"
          />
          <path
            d="M600 50 Q650 100, 700 50 Q750 0, 800 50"
            fill="none"
            stroke="#c2185b"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <p className="text-blossom-400 mb-2 text-sm font-medium">{today}</p>
        <h1 className="text-blossom-900 mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
          벚꽃 언제 필까?
        </h1>
        <p className="text-blossom-700 mb-8 text-lg">
          전국 벚꽃 개화 예보 · 낙화 위험도 · AI 여행 추천
        </p>
        <a
          href="/regions"
          className="bg-blossom-600 hover:bg-blossom-700 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          🌸 지역별 개화 보기
        </a>
      </div>
    </section>
  );
}
