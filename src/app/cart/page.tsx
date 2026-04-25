// ============================================================
// PAGE — /cart
// Shows cart items, totals, free delivery progress
// Proceed to checkout triggers auth if not logged in
// ============================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

// ── Free delivery progress bar ────────────────────────────────
function FreeDeliveryBar({
  subtotal,
  freeDeliveryAbove,
}: {
  subtotal: number;
  freeDeliveryAbove: number;
}) {
  const percent = Math.min((subtotal / freeDeliveryAbove) * 100, 100);
  const remaining = Math.max(freeDeliveryAbove - subtotal, 0);

  return (
    <div
      className="p-3 rounded-2xl"
      style={{ backgroundColor: "var(--color-brand-50)" }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <p
          className="text-xs font-semibold"
          style={{ color: "var(--color-navy)" }}
        >
          {remaining > 0 ? (
            <>
              Add <span className="font-black">{formatPrice(remaining)}</span>{" "}
              more for free delivery
            </>
          ) : (
            <span className="font-black text-green-600">
              🎉 You got free delivery!
            </span>
          )}
        </p>
        <span
          className="text-[10px] font-bold"
          style={{ color: "var(--color-brand)" }}
        >
          {Math.round(percent)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: "var(--color-brand)",
          }}
        />
      </div>
    </div>
  );
}

// ── Cart item row ─────────────────────────────────────────────
function CartItemRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="flex gap-3 p-3 bg-white rounded-2xl"
      style={{ border: "1.5px solid #e8ecef" }}
    >
      {/* Image */}
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: "72px", height: "72px", backgroundColor: "#f8fafc" }}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="72px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={20} className="text-gray-200" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p
            className="text-xs font-semibold leading-tight line-clamp-2"
            style={{ color: "var(--color-navy)" }}
          >
            {item.name}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{item.unit}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span
            className="text-sm font-black"
            style={{ color: "var(--color-navy)" }}
          >
            {formatPrice(item.selling_price * item.quantity)}
          </span>

          {/* Quantity controls */}
          <div
            className="flex items-center gap-0.5 rounded-xl overflow-hidden"
            style={{ border: "1.5px solid #e8ecef" }}
          >
            <button
              onClick={() => onUpdate(item.quantity - 1)}
              className="h-7 w-7 flex items-center justify-center transition-colors hover:bg-gray-50"
            >
              {item.quantity === 1 ? (
                <Trash2 size={12} className="text-red-400" />
              ) : (
                <Minus size={12} className="text-gray-500" />
              )}
            </button>
            <span
              className="w-7 text-center text-xs font-black"
              style={{ color: "var(--color-navy)" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdate(item.quantity + 1)}
              disabled={item.quantity >= item.stock_quantity}
              className="h-7 w-7 flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-40"
            >
              <Plus size={12} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors self-start"
      >
        <Trash2 size={13} className="text-red-400" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryAbove,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { user, openAuthModal } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  function handleCheckout() {
    if (!user) {
      openAuthModal();
      return;
    }
    window.location.href = ROUTES.checkout;
  }

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="container-app py-4">
        <div className="h-8 w-32 rounded-lg animate-pulse bg-gray-100 mb-6" />
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl animate-pulse bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container-app py-4">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="h-20 w-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--color-brand-50)" }}
          >
            <ShoppingCart size={32} style={{ color: "var(--color-brand)" }} />
          </div>
          <h2
            className="text-xl font-black mb-1"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Add items from our store to get started
          </p>
          <Link
            href={ROUTES.products}
            className="flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <ShoppingBag size={16} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.home}
            className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} style={{ color: "var(--color-navy)" }} />
          </Link>
          <div>
            <h1
              className="text-xl font-black leading-tight"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                color: "var(--color-navy)",
              }}
            >
              My Cart
            </h1>
            <p className="text-xs text-gray-400">{itemCount} items</p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Free delivery progress */}
        <FreeDeliveryBar
          subtotal={subtotal}
          freeDeliveryAbove={freeDeliveryAbove}
        />

        {/* Cart items */}
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <CartItemRow
              key={item.product_id}
              item={item}
              onUpdate={(qty) => updateQuantity(item.product_id, qty)}
              onRemove={() => removeItem(item.product_id)}
            />
          ))}
        </div>

        {/* Order summary */}
        <div
          className="bg-white rounded-2xl p-4 flex flex-col gap-3"
          style={{ border: "1.5px solid #e8ecef" }}
        >
          <h3
            className="text-sm font-black"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            Order Summary
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">
                Subtotal ({itemCount} items)
              </span>
              <span
                className="font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Delivery fee</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    deliveryFee === 0
                      ? "var(--color-brand)"
                      : "var(--color-navy)",
                }}
              >
                {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
              </span>
            </div>

            <div className="h-px my-1" style={{ backgroundColor: "#e8ecef" }} />

            <div className="flex justify-between">
              <span
                className="text-sm font-black"
                style={{ color: "var(--color-navy)" }}
              >
                Total
              </span>
              <span
                className="text-sm font-black"
                style={{ color: "var(--color-navy)" }}
              >
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Coupon placeholder */}
        <button
          className="flex items-center gap-2 p-3 rounded-2xl text-sm font-semibold transition-colors"
          style={{
            border: "1.5px dashed #e8ecef",
            color: "var(--color-brand)",
            backgroundColor: "var(--color-brand-50)",
          }}
        >
          <Tag size={15} />
          Apply coupon code
        </button>

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          className="w-full flex items-center justify-between h-13 px-5 rounded-2xl text-sm font-black text-white transition-all active:scale-[0.98]"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          <span>{user ? "Proceed to Checkout" : "Login to Checkout"}</span>
          <div className="flex items-center gap-1">
            <span>{formatPrice(total)}</span>
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Delivery note */}
        <p className="text-[11px] text-center text-gray-400 pb-2">
          Delivery within Kozhikode district only
        </p>
      </div>
    </div>
  );
}
