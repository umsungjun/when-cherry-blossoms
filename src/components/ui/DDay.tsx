import { cn } from "@/lib/utils/cn";
import { formatDDay } from "@/lib/utils/date";
import { BloomStatus } from "@/types/region";

interface Props {
  status: BloomStatus;
  daysUntilBloom: number;
  daysUntilPeak: number;
  daysUntilFall: number;
  className?: string;
}

export function DDay({
  status,
  daysUntilBloom,
  daysUntilPeak,
  daysUntilFall,
  className,
}: Props) {
  let label = "";
  let days = 0;
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

  return (
    <span className={cn("text-sm font-bold", colorClass, className)}>
      {label} {formatDDay(days)}
    </span>
  );
}
