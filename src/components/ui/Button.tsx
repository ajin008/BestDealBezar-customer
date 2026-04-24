// ============================================================
// COMPONENT — Button
// Base button with variants, sizes, and loading state
// Usage: <Button variant="primary" size="md" isLoading>Add to Cart</Button>
// ============================================================

"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        // Base
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        // Variants
        variant === "primary" && [
          "bg-[var(--color-brand)] text-white",
          "hover:bg-[var(--color-brand-dark)]",
          "focus-visible:ring-[var(--color-brand)]",
          "active:scale-[0.98]",
        ],
        variant === "secondary" && [
          "bg-[var(--color-accent)] text-white",
          "hover:bg-[var(--color-accent-dark)]",
          "focus-visible:ring-[var(--color-accent)]",
          "active:scale-[0.98]",
        ],
        variant === "outline" && [
          "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-page)] hover:border-[var(--color-brand)]",
          "focus-visible:ring-[var(--color-brand)]",
        ],
        variant === "ghost" && [
          "bg-transparent text-[var(--color-text-secondary)]",
          "hover:bg-[var(--color-page)] hover:text-[var(--color-text-primary)]",
          "focus-visible:ring-[var(--color-brand)]",
        ],
        variant === "danger" && [
          "bg-[var(--color-error)] text-white",
          "hover:opacity-90",
          "focus-visible:ring-[var(--color-error)]",
          "active:scale-[0.98]",
        ],

        // Sizes
        size === "sm" && "h-8 px-3 text-xs gap-1.5",
        size === "md" && "h-10 px-4 text-sm gap-2",
        size === "lg" && "h-12 px-6 text-base gap-2",
        size === "icon" && "h-10 w-10 p-0",

        // Full width
        fullWidth && "w-full",

        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
