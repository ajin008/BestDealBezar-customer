// ============================================================
// COMPONENT — CouponInput
// Handles coupon code input, validation, and display
// ============================================================

"use client";

import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AppliedCoupon } from "@/hooks/useCoupon";

interface CouponInputProps {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  isLoading: boolean;
  error: string | null;
  onApply: (code: string, subtotal: number) => Promise<{ success: boolean }>;
  onRemove: () => void;
}

export default function CouponInput({
  subtotal,
  appliedCoupon,
  isLoading,
  error,
  onApply,
  onRemove,
}: CouponInputProps) {
  const [code, setCode] = useState("");

  async function handleApply() {
    const result = await onApply(code, subtotal);
    if (result.success) setCode("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleApply();
  }

  // Applied state
  if (appliedCoupon) {
    return (
      <div
        className="rounded-2xl p-3 flex items-center justify-between gap-2"
        style={{
          backgroundColor: "var(--color-brand-50)",
          border: "1.5px solid var(--color-brand-200)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <Check size={14} color="#fff" />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-black"
              style={{ color: "var(--color-navy)" }}
            >
              {appliedCoupon.code} applied!
            </p>
            <p
              className="text-[11px] font-semibold"
              style={{ color: "var(--color-brand)" }}
            >
              You save {formatPrice(appliedCoupon.discount_amount)}
              {appliedCoupon.type === "percent" &&
                ` (${appliedCoupon.discount_value}% off)`}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="h-7 w-7 flex items-center justify-center rounded-xl hover:bg-white transition-colors flex-shrink-0"
        >
          <X size={14} className="text-gray-400" />
        </button>
      </div>
    );
  }

  // Input state
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center gap-2 p-1.5 rounded-2xl"
        style={{
          border: error ? "1.5px solid #ef4444" : "1.5px dashed #e8ecef",
          backgroundColor: error ? "#fff5f5" : "var(--color-brand-50)",
        }}
      >
        <div
          className="h-8 w-8 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ backgroundColor: "var(--color-brand-100)" }}
        >
          <Tag size={14} style={{ color: "var(--color-brand)" }} />
        </div>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter coupon code"
          className="flex-1 bg-transparent text-xs font-semibold outline-none placeholder:text-gray-400"
          style={{ color: "var(--color-navy)" }}
        />

        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="h-8 px-3 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          {isLoading ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-red-500 font-medium px-1">{error}</p>
      )}
    </div>
  );
}
