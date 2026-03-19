import { cn } from "@/lib/utils/cn";

interface Props {
  className?: string;
}

export function Skeleton({ className }: Props) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function RegionCardSkeleton() {
  return (
    <div className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
