import { BLOOM_STATUS_COLOR, BLOOM_STATUS_LABEL } from "@/lib/utils/bloom";
import { cn } from "@/lib/utils/cn";
import { BloomStatus } from "@/types/region";

interface Props {
  status: BloomStatus;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        BLOOM_STATUS_COLOR[status],
        className
      )}
    >
      {status === "peak" && <span className="mr-1">🌸</span>}
      {status === "blooming" && <span className="mr-1">🌷</span>}
      {status === "falling" && <span className="mr-1">🍃</span>}
      {BLOOM_STATUS_LABEL[status]}
    </span>
  );
}
