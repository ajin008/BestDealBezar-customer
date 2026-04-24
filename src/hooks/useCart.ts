// ============================================================
// HOOK — useCart
// Thin wrapper around cartStore
// Provides computed values ready for UI consumption
// ============================================================

"use client";

import { useCartStore } from "@/stores/cartStore";
import { useStoreSettings } from "./useStoreSettings";

export function useCart() {
  const store = useCartStore();
  const { settings } = useStoreSettings();

  const subtotal = store.getSubtotal();
  const itemCount = store.getItemCount();

  const deliveryFee =
    settings && subtotal >= settings.free_delivery_above
      ? 0
      : settings?.flat_delivery_charge ?? 60;

  const freeDeliveryAbove = settings?.free_delivery_above ?? 500;
  const amountForFreeDelivery = Math.max(0, freeDeliveryAbove - subtotal);
  const total = subtotal + deliveryFee;

  return {
    // State
    items: store.items,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryAbove,
    amountForFreeDelivery,
    isEmpty: store.items.length === 0,

    // Actions
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    getItem: store.getItem,
    isInCart: store.isInCart,
  };
}
