// ============================================================
// COMPONENT — Badge
// Small label for status, tags, discounts
// Usage: <Badge variant="success">In Stock</Badge>
//        <Badge variant="discount">20% OFF</Badge>
// ============================================================

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "discount";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export default function Badge({
  variant = "default",
  size = "md",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",

        // Variants
        variant === "default" &&
          "bg-(--color-page) text-(--color-text-secondary) border border-(--color-border)",
        variant === "success" && "bg-emerald-50 text-emerald-700",
        variant === "warning" && "bg-amber-50 text-amber-700",
        variant === "error" && "bg-red-50 text-red-600",
        variant === "info" && "bg-blue-50 text-blue-700",
        variant === "discount" && "bg-(--color-accent) text-white",

        // Sizes
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-xs px-2.5 py-1",

        className
      )}
    >
      {children}
    </span>
  );
}
