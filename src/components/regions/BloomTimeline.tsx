import { cn } from "@/lib/utils/cn";
import { formatMonthDay } from "@/lib/utils/date";
import { RegionWithStatus } from "@/types/region";

interface Props {
  region: RegionWithStatus;
  className?: string;
}

export function BloomTimeline({ region, className }: Props) {
  const { bloomProgress, status } = region;

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
      <div className="bg-blossom-100 relative h-2 rounded-full">
        <div
          className="from-blossom-300 to-blossom-500 h-full rounded-full bg-gradient-to-r transition-all duration-500"
          style={{ width: `${bloomProgress}%` }}
        />
        {/* 만개 마커 */}
        <div className="bg-blossom-400 absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm" />
      </div>

      {/* 라벨 */}
      <div className="flex justify-between text-xs">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "flex flex-col items-center gap-0.5",
              i === 1 && "items-center",
              i === 2 && "items-end"
            )}
          >
            <span
              className={cn(
                "font-semibold",
                i <= activeIdx ? "text-blossom-500" : "text-gray-400"
              )}
            >
              {s.label}
            </span>
            <span className="text-gray-400">{s.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
