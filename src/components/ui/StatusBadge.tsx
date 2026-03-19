import { Flower, Flower2, Leaf } from "lucide-react";

import { BLOOM_STATUS_COLOR, BLOOM_STATUS_LABEL } from "@/lib/utils/bloom";
import { cn } from "@/lib/utils/cn";
import { BloomStatus } from "@/types/region";

interface Props {
  status: BloomStatus;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", BLOOM_STATUS_COLOR[status], className)}>
      {status === "peak"     && <Flower2 size={11} />}
      {status === "blooming" && <Flower  size={11} />}
      {status === "falling"  && <Leaf    size={11} />}
      {BLOOM_STATUS_LABEL[status]}
    </span>
  );
}
