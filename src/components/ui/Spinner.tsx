// ============================================================
// COMPONENT — Spinner
// Animated loading indicator
// Usage: <Spinner size="md" />
//        <Spinner size="lg" className="text-white" />
// ============================================================

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-2 border-current border-t-transparent animate-spin text-[var(--color-brand)]",
        size === "sm" && "h-4 w-4",
        size === "md" && "h-6 w-6",
        size === "lg" && "h-8 w-8",
        className
      )}
    />
  );
}
