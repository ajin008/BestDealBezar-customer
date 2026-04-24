// ============================================================
// CART STORE
// Persisted in localStorage — survives page refresh + auth redirect
// Never calls Supabase directly — cart is purely client-side state
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CART_STORAGE_KEY, MAX_CART_QUANTITY } from "@/lib/constants";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed helpers (call as functions)
  getItemCount: () => number;
  getSubtotal: () => number;
  getItem: (productId: string) => CartItem | undefined;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === newItem.product_id
          );

          if (existing) {
            // Increment quantity, cap at stock or MAX_CART_QUANTITY
            const maxQty = Math.min(newItem.stock_quantity, MAX_CART_QUANTITY);
            return {
              items: state.items.map((i) =>
                i.product_id === newItem.product_id
                  ? { ...i, quantity: Math.min(i.quantity + 1, maxQty) }
                  : i
              ),
            };
          }

          // Add new item with quantity 1
          return {
            items: [...state.items, { ...newItem, quantity: 1 }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId
              ? {
                  ...i,
                  quantity: Math.min(
                    quantity,
                    i.stock_quantity,
                    MAX_CART_QUANTITY
                  ),
                }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, i) => sum + i.selling_price * i.quantity,
          0
        );
      },

      getItem: (productId) => {
        return get().items.find((i) => i.product_id === productId);
      },

      isInCart: (productId) => {
        return get().items.some((i) => i.product_id === productId);
      },
    }),
    {
      name: CART_STORAGE_KEY,
      // Only persist the items array — not the functions
      partialize: (state) => ({ items: state.items }),
    }
  )
);
