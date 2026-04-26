// ============================================================
// PAGE — /orders/[id]
// Single order detail + success state after checkout
// Cancel option for pending orders
// ============================================================

"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Package,
  ShoppingBag,
  AlertCircle,
  Clock,
  Truck,
  Home,
} from "lucide-react";
import { useOrder } from "@/hooks/useOrders";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import Skeleton from "@/components/ui/Skeleton";

// ── Status Step ───────────────────────────────────────────────
function StatusStep({
  label,
  completed,
  active,
  isLast,
}: {
  label: string;
  completed: boolean;
  active: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center relative">
      {/* Connector line - only show if not last item */}
      {!isLast && (
        <div
          className="absolute left-1/2 top-3 w-full h-[2px] -translate-y-1/2"
          style={{
            backgroundColor: completed ? "var(--color-brand)" : "#e8ecef",
          }}
        />
      )}

      {/* Step circle */}
      <div
        className="relative z-10 h-6 w-6 rounded-full flex items-center justify-center transition-all"
        style={{
          backgroundColor:
            completed || active ? "var(--color-brand)" : "#e8ecef",
        }}
      >
        {completed ? (
          <CheckCircle size={14} color="#fff" />
        ) : active ? (
          <div className="h-2 w-2 rounded-full bg-white" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-gray-400" />
        )}
      </div>

      {/* Step label */}
      <span
        className="text-[10px] font-semibold text-center mt-1.5 leading-tight whitespace-nowrap"
        style={{
          color: completed || active ? "var(--color-brand)" : "#9ca3af",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Order Timeline ────────────────────────────────────────────
function OrderTimeline({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Placed", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ];

  const currentIndex = steps.findIndex((step) => step.key === status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50">
        <XCircle size={20} className="text-red-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-600">Order Cancelled</p>
          <p className="text-xs text-red-500 mt-0.5">
            This order has been cancelled
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-stretch gap-0">
      {steps.map((step, index) => (
        <StatusStep
          key={step.key}
          label={step.label}
          completed={index < currentIndex}
          active={index === currentIndex}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
}

// ── Main Content ──────────────────────────────────────────────
function OrderDetailContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const { order, isLoading, error } = useOrder(id);

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      const json = await res.json();

      if (json.error) {
        setCancelError(json.error);
      } else {
        window.location.reload();
      }
    } catch {
      setCancelError("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  }

  // ── Loading ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container-app py-4 flex flex-col gap-3">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="container-app py-20 flex flex-col items-center text-center">
        <Package size={32} className="text-gray-300 mb-3" />
        <h2
          className="text-lg font-black mb-2"
          style={{ color: "var(--color-navy)" }}
        >
          Order not found
        </h2>
        <Link
          href={ROUTES.orders}
          className="mt-4 h-11 px-6 rounded-xl text-sm font-bold text-white inline-flex items-center"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-4 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href={ROUTES.orders}
          className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} style={{ color: "var(--color-navy)" }} />
        </Link>
        <div>
          <h1
            className="text-lg font-black"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            {order.order_number}
          </h1>
          <p className="text-xs text-gray-400">
            {formatDateTime(order.created_at)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Success banner */}
        {isSuccess && (
          <div
            className="p-4 rounded-2xl flex items-center gap-3"
            style={{
              backgroundColor: "var(--color-brand-50)",
              border: "1.5px solid var(--color-brand-200)",
            }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-brand)" }}
            >
              <CheckCircle size={20} color="#fff" />
            </div>
            <div>
              <p
                className="text-sm font-black"
                style={{ color: "var(--color-navy)" }}
              >
                Order placed successfully! 🎉
              </p>
              <p className="text-xs text-gray-500">
                We&apos;ll confirm your order shortly
              </p>
            </div>
          </div>
        )}

        {/* Order timeline */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1.5px solid #e8ecef" }}
        >
          <h2
            className="text-sm font-black mb-5"
            style={{ color: "var(--color-navy)" }}
          >
            Order Status
          </h2>
          <OrderTimeline status={order.status} />
        </div>

        {/* Order items */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ border: "1.5px solid #e8ecef" }}
        >
          <h2
            className="text-sm font-black mb-3"
            style={{ color: "var(--color-navy)" }}
          >
            Items ({order.order_items.length})
          </h2>
          <div className="flex flex-col gap-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  {item.product_image_url ? (
                    <Image
                      src={item.product_image_url}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {item.product_name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <span
                  className="text-sm font-black flex-shrink-0"
                  style={{ color: "var(--color-navy)" }}
                >
                  {formatPrice(item.total_price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ border: "1.5px solid #e8ecef" }}
        >
          <h2
            className="text-sm font-black mb-3"
            style={{ color: "var(--color-navy)" }}
          >
            Price Details
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Subtotal</span>
              <span
                className="font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                {formatPrice(order.subtotal)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--color-brand)" }}>
                  Discount {order.coupon_code ? `(${order.coupon_code})` : ""}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-brand)" }}
                >
                  -{formatPrice(order.discount_amount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Delivery fee</span>
              <span
                className="font-semibold"
                style={{
                  color:
                    order.delivery_fee === 0
                      ? "var(--color-brand)"
                      : "var(--color-navy)",
                }}
              >
                {order.delivery_fee === 0
                  ? "FREE"
                  : formatPrice(order.delivery_fee)}
              </span>
            </div>
            <div className="h-px" style={{ backgroundColor: "#e8ecef" }} />
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
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ border: "1.5px solid #e8ecef" }}
        >
          <h2
            className="text-sm font-black mb-3 flex items-center gap-2"
            style={{ color: "var(--color-navy)" }}
          >
            <MapPin size={14} style={{ color: "var(--color-brand)" }} />
            Delivery Address
          </h2>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-navy)" }}
          >
            {order.customer_name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{order.customer_phone}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.delivery_address}, {order.delivery_city} —{" "}
            {order.delivery_pincode}
          </p>
        </div>

        {/* Payment info */}
        <div
          className="bg-white rounded-2xl p-4"
          style={{ border: "1.5px solid #e8ecef" }}
        >
          <h2
            className="text-sm font-black mb-3 flex items-center gap-2"
            style={{ color: "var(--color-navy)" }}
          >
            <CreditCard size={14} style={{ color: "var(--color-brand)" }} />
            Payment
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {order.payment_method === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  order.payment_status === "paid" ? "#f0fdf4" : "#fffbe6",
                color: order.payment_status === "paid" ? "#16a34a" : "#d97706",
              }}
            >
              {order.payment_status === "paid" ? "Paid" : "Payment Pending"}
            </span>
          </div>
        </div>

        {/* Cancel order — only for pending orders */}
        {order.status === "pending" && (
          <div className="flex flex-col gap-2">
            {cancelError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{cancelError}</p>
              </div>
            )}
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
              style={{
                border: "1.5px solid #fee2e2",
                color: "#ef4444",
                backgroundColor: "#fff5f5",
              }}
            >
              {isCancelling ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  Cancel Order
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-gray-400">
              Orders can only be cancelled before confirmation
            </p>
          </div>
        )}

        {/* Continue shopping */}
        <Link
          href={ROUTES.products}
          className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold transition-all"
          style={{
            border: "2px solid var(--color-brand)",
            color: "var(--color-brand)",
            backgroundColor: "var(--color-brand-50)",
          }}
        >
          <ShoppingBag size={15} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailContent />
    </Suspense>
  );
}
