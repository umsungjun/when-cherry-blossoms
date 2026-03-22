import { cn } from "@/lib/utils/cn";
import { formatMonthDay } from "@/lib/utils/date";
import { RegionWithStatus } from "@/types/region";

interface Props {
  region: RegionWithStatus;
  className?: string;
}

export function BloomTimeline({ region, className }: Props) {
  const { bloomProgress, status } = region;

  // 기상청 데이터 없으면 빈 타임라인
  if (status === "unknown") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="bg-sakura-800 relative h-2 rounded-full" />
        <p className="text-text-muted text-center text-xs">
          기상청 데이터 대기 중
        </p>
      </div>
    );
  }

  const steps = [
    { key: "bloom", label: "개화", date: formatMonthDay(region.bloom), pct: 0 },
    { key: "peak", label: "만개", date: formatMonthDay(region.peak), pct: 50 },
    { key: "fall", label: "낙화", date: formatMonthDay(region.fall), pct: 100 },
  ];

  const activeIdx =
    status === "before"
      ? -1
      : status === "blooming"
        ? 0
        : status === "peak"
          ? 1
          : status === "falling"
            ? 2
            : 3;

  return (
    <div className={cn("space-y-2", className)}>
      {/* 프로그레스 바 */}
      <div className="bg-sakura-800 relative h-2 rounded-full">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${bloomProgress}%`,
            background: "linear-gradient(to right, #ff80c0, #ff4da6)",
          }}
        />
        <div className="border-sakura-900 absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-[#ff4da6] shadow-sm" />
      </div>

      {/* 라벨 */}
      <div className="flex justify-between text-xs">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "flex flex-col items-center gap-0.5",
              i === 2 && "items-end"
            )}
          >
            <span
              className={cn(
                "font-semibold",
                i <= activeIdx ? "text-[#ff4da6]" : "text-text-faint"
              )}
            >
              {s.label}
            </span>
            <span className="text-text-dim">{s.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
