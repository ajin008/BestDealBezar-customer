// ============================================================
// COMPONENT — Skeleton
// Placeholder shimmer while content loads
// Usage: <Skeleton className="h-4 w-32" />
//        <Skeleton className="h-48 w-full rounded-2xl" />
// ============================================================

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-(--color-border)", className)}
    />
  );
}
