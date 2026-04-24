// ============================================================
// COMPONENT — Input
// Base input with label, error state, and left/right icons
// Usage: <Input label="Phone" error="Required" leftIcon={<Phone />} />
// ============================================================

"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
          {props.required && (
            <span className="text-[var(--color-error)] ml-0.5">*</span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={cn(
            "w-full h-11 rounded-xl border bg-[var(--color-card)] text-[var(--color-text-primary)]",
            "text-sm placeholder:text-[var(--color-text-muted)]",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
              : "border-[var(--color-border)]",
            leftIcon ? "pl-10" : "pl-4",
            rightIcon ? "pr-10" : "pr-4",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 text-[var(--color-text-muted)]">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  );
}
