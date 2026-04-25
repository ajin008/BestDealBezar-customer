// ============================================================
// PAGE — /orders
// Shows all orders for logged-in user
// Protected — requires auth
// ============================================================

"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice, formatDate } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import { ROUTES } from "@/lib/constants";

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "delivered":
      return <CheckCircle size={15} className="text-green-500" />;
    case "shipped":
      return <Truck size={15} className="text-blue-500" />;
    case "cancelled":
      return <XCircle size={15} className="text-red-500" />;
    default:
      return <Clock size={15} className="text-amber-500" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-purple-50 text-purple-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-600",
  };

  const labels: Record<string, string> = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    processing: "Being Packed",
    shipped: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
        styles[status] ?? "bg-gray-50 text-gray-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default function OrdersPage() {
  useRequireAuth();
  const { user } = useAuthStore();
  const { orders, isLoading, error } = useOrders();

  if (!user) return null;

  return (
    <div className="container-app py-4 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href={ROUTES.home}
          className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} style={{ color: "var(--color-navy)" }} />
        </Link>
        <div>
          <h1
            className="text-xl font-black"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            My Orders
          </h1>
          <p className="text-xs text-gray-400">
            {orders.length > 0
              ? `${orders.length} orders`
              : "Track your orders"}
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="h-20 w-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--color-brand-50)" }}
          >
            <ClipboardList size={32} style={{ color: "var(--color-brand)" }} />
          </div>
          <h2
            className="text-xl font-black mb-1"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            No orders yet
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Your order history will appear here once you place an order
          </p>
          <Link
            href={ROUTES.products}
            className="flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <Package size={16} />
            Start Shopping
          </Link>
        </div>
      )}

      {/* Order list */}
      {!isLoading && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="bg-white rounded-2xl p-4 flex flex-col gap-3 transition-all hover:shadow-sm active:scale-[0.99]"
              style={{ border: "1.5px solid #e8ecef" }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className="text-sm font-black"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {order.order_number}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </div>

              {/* Items preview */}
              <div className="flex flex-col gap-1">
                {order.order_items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <StatusIcon status={order.status} />
                    <span className="text-xs text-gray-600 truncate">
                      {item.product_name}
                      <span className="text-gray-400"> × {item.quantity}</span>
                    </span>
                  </div>
                ))}
                {order.order_items.length > 2 && (
                  <p className="text-[11px] text-gray-400 ml-5">
                    +{order.order_items.length - 2} more items
                  </p>
                )}
              </div>

              {/* Bottom row */}
              <div
                className="flex items-center justify-between pt-2"
                style={{ borderTop: "1px solid #f1f5f9" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        order.payment_method === "cod" ? "#f0fdf4" : "#eff6ff",
                      color:
                        order.payment_method === "cod" ? "#16a34a" : "#2563eb",
                    }}
                  >
                    {order.payment_method === "cod"
                      ? "Cash on Delivery"
                      : "Online"}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        order.payment_status === "paid" ? "#f0fdf4" : "#fffbe6",
                      color:
                        order.payment_status === "paid" ? "#16a34a" : "#d97706",
                    }}
                  >
                    {order.payment_status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
                <span
                  className="text-sm font-black"
                  style={{ color: "var(--color-navy)" }}
                >
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
