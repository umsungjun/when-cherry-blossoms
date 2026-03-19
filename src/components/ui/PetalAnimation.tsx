"use client";

import { useMemo } from "react";

interface Petal {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
  rotate: string;
}

const PETAL_SVG = `
<svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 2C15 2,9 1,5 5C1 9,1 16,1 20C1 28,7 36,15 39C23 36,29 28,29 20C29 16,29 9,25 5C21 1,15 2,15 2Z"
    fill="url(#pg)" opacity="0.85"/>
  <path d="M12 4C14 9,15 7,15 2C15 7,16 9,18 4" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
  <path d="M15 38Q15 22,15 4" stroke="rgba(255,255,255,0.3)" stroke-width="0.6" stroke-linecap="round"/>
  <path d="M15 30Q10 24,7 18" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" stroke-linecap="round"/>
  <path d="M15 30Q20 24,23 18" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" stroke-linecap="round"/>
  <defs>
    <radialGradient id="pg" cx="45%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#fce4ec"/>
      <stop offset="55%" stop-color="#f48fb1"/>
      <stop offset="100%" stop-color="#e91e8c"/>
    </radialGradient>
  </defs>
</svg>
`;

const ENCODED_PETAL = `data:image/svg+xml;base64,${
  typeof window !== "undefined"
    ? btoa(PETAL_SVG)
    : Buffer.from(PETAL_SVG).toString("base64")
}`;

export function PetalAnimation({ count = 12 }: { count?: number }) {
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${16 + Math.random() * 14}px`,
      duration: `${6 + Math.random() * 8}s`,
      delay: `${Math.random() * 10}s`,
      opacity: `${0.5 + Math.random() * 0.5}`,
      rotate: `${Math.random() * 360}deg`,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="animate-petal-fall absolute"
          style={{
            left: p.left,
            top: "-5%",
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            transform: `rotate(${p.rotate})`,
          }}
        >
          <img
            src={ENCODED_PETAL}
            alt=""
            aria-hidden="true"
            className="h-full w-full"
          />
        </div>
      ))}
    </div>
  );
}
