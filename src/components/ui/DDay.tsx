import { cn } from "@/lib/utils/cn";
import { formatDDay } from "@/lib/utils/date";
import { BloomStatus } from "@/types/region";

interface Props {
  status: BloomStatus | "unknown";
  daysUntilBloom: number | null;
  daysUntilPeak: number | null;
  daysUntilFall: number | null;
  className?: string;
}

export function DDay({
  status,
  daysUntilBloom,
  daysUntilPeak,
  daysUntilFall,
  className,
}: Props) {
  if (status === "unknown") {
    return (
      <span className={cn("text-text-muted text-xs", className)}>
        기상청 데이터 대기 중
      </span>
    );
  }

  let label = "";
  let days: number | null = 0;
  let colorClass = "";

  switch (status) {
    case "before":
      label = "개화";
      days = daysUntilBloom;
      colorClass = "text-text-muted";
      break;
    case "blooming":
      label = "만개";
      days = daysUntilPeak;
      colorClass = "text-accent-light";
      break;
    case "peak":
      label = "낙화";
      days = daysUntilFall;
      colorClass = "text-[#ff4da6]";
      break;
    case "falling":
      label = "종료";
      days = daysUntilFall;
      colorClass = "text-orange-400";
      break;
    case "done":
      return (
        <span className={cn("text-text-dim text-xs", className)}>
          시즌 종료
        </span>
      );
  }

  if (days === null) {
    return (
      <span className={cn("text-text-muted text-xs", className)}>
        {label} 날짜 미정
      </span>
    );
  }

  return (
    <span className={cn("text-sm font-bold", colorClass, className)}>
      {label} {formatDDay(days)}
    </span>
  );
}
