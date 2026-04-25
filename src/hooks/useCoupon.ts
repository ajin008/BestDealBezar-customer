// ============================================================
// HOOK — useCoupon
// Validates coupon code against cart subtotal
// Stores applied coupon in state
// ============================================================

"use client";

import { useState } from "react";

export interface AppliedCoupon {
  code: string;
  type: string;
  discount_value: number;
  discount_amount: number;
  description: string | null;
}

export function useCoupon() {
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function applyCoupon(
    code: string,
    subtotal: number
  ): Promise<{ success: boolean }> {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
        return { success: false };
      }

      setCoupon(json.data);
      return { success: true };
    } catch {
      setError("Failed to apply coupon");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setError(null);
  }

  return {
    coupon,
    isLoading,
    error,
    applyCoupon,
    removeCoupon,
    discount: coupon?.discount_amount ?? 0,
  };
}
