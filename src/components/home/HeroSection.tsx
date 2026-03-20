import { MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-80 items-center justify-center overflow-hidden text-center"
      style={{ background: "linear-gradient(135deg, #ff4da6 0%, #c2185b 100%)" }}
    >
      {/* 촘촘한 스케치 낙서 패턴 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
          className="opacity-[0.18]"
        >
          {[
            [60,40],[130,110],[210,30],[310,80],[420,25],[520,70],
            [640,35],[740,90],[850,45],[940,120],[30,200],[170,240],
            [280,190],[390,230],[480,170],[590,210],[700,180],[810,220],
            [920,175],[75,360],[190,400],[300,350],[450,390],[570,340],
            [680,380],[790,355],[900,410],[50,460],[240,470],[650,455],[880,470],
          ].map(([x,y],i) => (
            <text key={`h${i}`} x={x} y={y} fontSize={i%3===0?14:i%3===1?10:8} fill="#1a0a14" fontFamily="serif">♥</text>
          ))}
          {[
            [90,160],[230,60],[370,140],[500,30],[620,130],[760,60],
            [880,160],[150,320],[320,290],[460,340],[580,290],[720,320],
            [850,280],[100,440],[340,450],[500,420],[780,450],
          ].map(([x,y],i) => (
            <text key={`f${i}`} x={x} y={y} fontSize={i%2===0?18:13} fill="#1a0a14">❀</text>
          ))}
          {[
            [180,85],[440,110],[700,45],[960,80],[260,260],[550,255],[830,250],[120,480],[430,480],[860,475],
          ].map(([x,y],i) => (
            <text key={`sf${i}`} x={x} y={y} fontSize={10} fill="#1a0a14">✿</text>
          ))}
          {[
            [350,45],[670,100],[950,40],[200,175],[710,165],[980,220],[400,430],[750,440],
          ].map(([x,y],i) => (
            <text key={`st${i}`} x={x} y={y} fontSize={i%2===0?14:9} fill="#1a0a14">✦</text>
          ))}
          {[[140,75],[490,155],[810,70],[270,375],[600,360],[920,380]].map(([cx,cy],i) => (
            <g key={`b${i}`} transform={`translate(${cx},${cy})`}>
              <path d="M0 0 Q-12-10-16 0 Q-12 10 0 0" fill="none" stroke="#1a0a14" strokeWidth="1.8"/>
              <path d="M0 0 Q12-10 16 0 Q12 10 0 0" fill="none" stroke="#1a0a14" strokeWidth="1.8"/>
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#1a0a14" strokeWidth="1.2"/>
            </g>
          ))}
          <path d="M20 130 L38 118 L56 130 L74 118 L92 130 L110 118" fill="none" stroke="#1a0a14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M860 280 L878 268 L896 280 L914 268 L932 280 L950 268" fill="none" stroke="#1a0a14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M700 420 L718 408 L736 420 L754 408 L772 420" fill="none" stroke="#1a0a14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 320 Q50 300 70 325 Q95 350 130 330 Q165 310 185 335" fill="none" stroke="#1a0a14" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="70" cy="322" r="3.5" fill="#1a0a14"/>
          <circle cx="130" cy="328" r="3" fill="#1a0a14"/>
          <circle cx="185" cy="333" r="3.5" fill="#1a0a14"/>
          <path d="M820 80 Q855 60 875 88 Q900 115 940 95" fill="none" stroke="#1a0a14" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="875" cy="86" r="3" fill="#1a0a14"/>
          <path d="M30 480 A90 90 0 0 1 210 480" fill="none" stroke="#1a0a14" strokeWidth="7" strokeLinecap="round" opacity="0.8"/>
          <path d="M45 480 A75 75 0 0 1 195 480" fill="none" stroke="#1a0a14" strokeWidth="5" strokeLinecap="round" opacity="0.55"/>
          <line x1="930" y1="30" x2="980" y2="30" stroke="#1a0a14" strokeWidth="6" strokeLinecap="round"/>
          <line x1="935" y1="44" x2="978" y2="44" stroke="#1a0a14" strokeWidth="6" strokeLinecap="round"/>
          <line x1="940" y1="58" x2="975" y2="58" stroke="#1a0a14" strokeWidth="4" strokeLinecap="round"/>
          {[[400,300],[800,130],[550,460],[100,490]].map(([x,y],i) => (
            <g key={`x${i}`} transform={`translate(${x},${y})`}>
              <line x1="-7" y1="-7" x2="7" y2="7" stroke="#1a0a14" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="7" y1="-7" x2="-7" y2="7" stroke="#1a0a14" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4">
        <p className="mb-3 text-sm font-semibold text-white/75">
          2026 전국 벚꽃 개화 예보
        </p>
        <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          벚꽃 언제 필까?
        </h1>
        <p className="mb-8 text-lg font-medium text-white/80">
          전국 개화 예보 · 낙화 위험도 · AI 여행 추천
        </p>
        <a
          href="/regions"
          className="inline-flex items-center gap-2 rounded-full bg-sakura-950 px-7 py-3.5 text-sm font-bold text-[#ff4da6] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,77,166,0.3)]"
        >
          <MapPin size={15} />
          지역별 개화 보기
        </a>
      </div>
    </section>
  );
}
