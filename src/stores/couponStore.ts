import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppliedCoupon } from "@/hooks/useCoupon";

interface CouponState {
  coupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  clearCoupon: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      coupon: null,
      setCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: null }),
    }),
    { name: "bdb-coupon" }
  )
);
