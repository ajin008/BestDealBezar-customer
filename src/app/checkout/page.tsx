// ============================================================
// PAGE — /checkout
// Protected route — requires auth
// Address selection + payment method + order summary
// COD + Razorpay
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Plus,
  CreditCard,
  Truck,
  CheckCircle,
  Loader2,
  AlertCircle,
  Home,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/stores/authStore";
import { useAddresses } from "@/hooks/useAddresses";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useCoupon } from "@/hooks/useCoupon";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Address } from "@/hooks/useAddresses";

type PaymentMethod = "cod" | "razorpay";

// ── Address selector ──────────────────────────────────────────
function AddressSelector({
  addresses,
  selected,
  onSelect,
  onAddNew,
}: {
  addresses: Address[];
  selected: Address | null;
  onSelect: (addr: Address) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2
        className="text-sm font-black flex items-center gap-2"
        style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          color: "var(--color-navy)",
        }}
      >
        <MapPin size={16} style={{ color: "var(--color-brand)" }} />
        Delivery Address
      </h2>

      {addresses.map((addr) => (
        <button
          key={addr.id}
          onClick={() => onSelect(addr)}
          className="w-full text-left p-3 rounded-2xl bg-white transition-all"
          style={{
            border:
              selected?.id === addr.id
                ? "2px solid var(--color-brand)"
                : "1.5px solid #e8ecef",
          }}
        >
          <div className="flex items-start gap-3">
            {/* Radio */}
            <div
              className="h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                borderColor:
                  selected?.id === addr.id ? "var(--color-brand)" : "#e8ecef",
                backgroundColor:
                  selected?.id === addr.id
                    ? "var(--color-brand)"
                    : "transparent",
              }}
            >
              {selected?.id === addr.id && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>

            {/* Address info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {addr.label === "Work" ? (
                  <Briefcase
                    size={12}
                    style={{ color: "var(--color-brand)" }}
                  />
                ) : (
                  <Home size={12} style={{ color: "var(--color-brand)" }} />
                )}
                <span
                  className="text-xs font-black"
                  style={{ color: "var(--color-navy)" }}
                >
                  {addr.label}
                </span>
                {addr.is_default && (
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: "var(--color-brand)" }}
                  >
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-gray-700">
                {addr.recipient_name} · {addr.phone}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {addr.address_line}, {addr.city} — {addr.pincode}
              </p>
            </div>
          </div>
        </button>
      ))}

      {/* Add new address */}
      <Link
        href="/addresses?redirect=/checkout"
        className="flex items-center justify-center gap-2 p-3 rounded-2xl text-sm font-bold transition-all"
        style={{
          border: "1.5px dashed #e8ecef",
          color: "var(--color-brand)",
          backgroundColor: "var(--color-brand-50)",
        }}
      >
        <Plus size={15} />
        Add New Address
      </Link>
    </div>
  );
}

// ── Payment method selector ───────────────────────────────────
function PaymentSelector({
  selected,
  onSelect,
  isCodEnabled,
  isOnlineEnabled,
}: {
  selected: PaymentMethod;
  onSelect: (m: PaymentMethod) => void;
  isCodEnabled: boolean;
  isOnlineEnabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2
        className="text-sm font-black flex items-center gap-2"
        style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          color: "var(--color-navy)",
        }}
      >
        <CreditCard size={16} style={{ color: "var(--color-brand)" }} />
        Payment Method
      </h2>

      {/* COD */}
      {isCodEnabled && (
        <button
          onClick={() => onSelect("cod")}
          className="w-full text-left p-3 rounded-2xl bg-white transition-all"
          style={{
            border:
              selected === "cod"
                ? "2px solid var(--color-brand)"
                : "1.5px solid #e8ecef",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor:
                  selected === "cod" ? "var(--color-brand)" : "#e8ecef",
                backgroundColor:
                  selected === "cod" ? "var(--color-brand)" : "transparent",
              }}
            >
              {selected === "cod" && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#f0fdf4" }}
            >
              <Truck size={16} className="text-green-600" />
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--color-navy)" }}
              >
                Cash on Delivery
              </p>
              <p className="text-xs text-gray-400">
                Pay when your order arrives
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Razorpay */}
      {isOnlineEnabled && (
        <button
          onClick={() => onSelect("razorpay")}
          className="w-full text-left p-3 rounded-2xl bg-white transition-all"
          style={{
            border:
              selected === "razorpay"
                ? "2px solid var(--color-brand)"
                : "1.5px solid #e8ecef",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor:
                  selected === "razorpay" ? "var(--color-brand)" : "#e8ecef",
                backgroundColor:
                  selected === "razorpay"
                    ? "var(--color-brand)"
                    : "transparent",
              }}
            >
              {selected === "razorpay" && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <CreditCard size={16} className="text-blue-600" />
            </div>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--color-navy)" }}
              >
                Pay Online
              </p>
              <p className="text-xs text-gray-400">
                UPI, Cards, Net Banking via Razorpay
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

// ── Order summary ─────────────────────────────────────────────
function OrderSummary({
  subtotal,
  deliveryFee,
  discount,
  couponCode,
  total,
  itemCount,
}: {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  itemCount: number;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-4 flex flex-col gap-2"
      style={{ border: "1.5px solid #e8ecef" }}
    >
      <h2
        className="text-sm font-black mb-1"
        style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          color: "var(--color-navy)",
        }}
      >
        Order Summary
      </h2>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Subtotal ({itemCount} items)</span>
        <span className="font-semibold" style={{ color: "var(--color-navy)" }}>
          {formatPrice(subtotal)}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--color-brand)" }}>
            Discount {couponCode ? `(${couponCode})` : ""}
          </span>
          <span
            className="font-semibold"
            style={{ color: "var(--color-brand)" }}
          >
            -{formatPrice(discount)}
          </span>
        </div>
      )}

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Delivery fee</span>
        <span
          className="font-semibold"
          style={{
            color:
              deliveryFee === 0 ? "var(--color-brand)" : "var(--color-navy)",
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
  );
}

// ── Main checkout page ────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuthStore();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { addresses, isLoading: addressLoading } = useAddresses();
  const { settings } = useStoreSettings();
  const { coupon } = useCoupon();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Auth guard
  useEffect(() => {
    if (mounted && !user) {
      openAuthModal();
      router.push(ROUTES.home);
    }
  }, [mounted, user, openAuthModal, router]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  // Set default payment method from settings
  useEffect(() => {
    if (settings) {
      if (settings.is_cod_enabled) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPaymentMethod("cod");
      } else if (settings.is_online_payment_enabled) {
        setPaymentMethod("razorpay");
      }
    }
  }, [settings]);

  const discount = coupon?.discount_amount ?? 0;
  const finalTotal = total - discount;

  async function handlePlaceOrder() {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }
    if (!user) {
      openAuthModal();
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsPlacing(true);
    setError(null);

    try {
      // Create order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: user.name ?? selectedAddress.recipient_name,
          customer_email: user.email ?? null,
          customer_phone: selectedAddress.phone,
          delivery_address: selectedAddress.address_line,
          delivery_city: selectedAddress.city,
          delivery_pincode: selectedAddress.pincode,
          payment_method: paymentMethod,
          coupon_code: coupon?.code ?? null,
          items: items.map((item) => ({
            product_id: item.product_id,
            product_image_url: item.image_url,
            quantity: item.quantity,
          })),
        }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
        setIsPlacing(false);
        return;
      }

      const order = json.data;

      // COD — go directly to success
      if (paymentMethod === "cod") {
        clearCart();
        router.push(`/orders/${order.id}?success=true`);
        return;
      }

      // Razorpay — create payment and open checkout
      const paymentRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id }),
      });

      const paymentJson = await paymentRes.json();

      if (paymentJson.error) {
        setError(paymentJson.error);
        setIsPlacing(false);
        return;
      }

      const { razorpay_order_id, amount, key_id, order_number } =
        paymentJson.data;

      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        // @ts-expect-error — Razorpay is loaded globally
        const rzp = new window.Razorpay({
          key: key_id,
          amount: amount * 100,
          currency: "INR",
          name: "BestDealBazar",
          description: `Order ${order_number}`,
          order_id: razorpay_order_id,
          prefill: {
            name: user.name ?? "",
            email: user.email ?? "",
            contact: selectedAddress.phone,
          },
          theme: { color: "var(--color-brand)" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            // Verify payment
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              }),
            });

            const verifyJson = await verifyRes.json();

            if (verifyJson.error) {
              setError("Payment verification failed. Contact support.");
              setIsPlacing(false);
              return;
            }

            clearCart();
            router.push(`/orders/${order.id}?success=true`);
          },
          modal: {
            ondismiss: () => {
              setIsPlacing(false);
              setError("Payment cancelled. Your order is saved — try again.");
            },
          },
        });

        rzp.open();
      };
    } catch {
      setError("Something went wrong. Please try again.");
      setIsPlacing(false);
    }
  }

  if (!mounted) return null;

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="container-app py-20 flex flex-col items-center text-center">
        <AlertCircle size={32} className="text-gray-300 mb-3" />
        <h2
          className="text-lg font-black mb-2"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            color: "var(--color-navy)",
          }}
        >
          Your cart is empty
        </h2>
        <Link
          href={ROUTES.products}
          className="mt-4 h-11 px-6 rounded-xl text-sm font-bold text-white inline-flex items-center"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-4 pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} style={{ color: "var(--color-navy)" }} />
        </button>
        <h1
          className="text-xl font-black"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            color: "var(--color-navy)",
          }}
        >
          Checkout
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Address section */}
        {addressLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl animate-pulse"
                style={{ backgroundColor: "#e8ecef" }}
              />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div
            className="p-4 rounded-2xl flex flex-col items-center gap-3 text-center"
            style={{
              backgroundColor: "var(--color-brand-50)",
              border: "1.5px dashed var(--color-brand-200)",
            }}
          >
            <MapPin size={24} style={{ color: "var(--color-brand)" }} />
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-navy)" }}
            >
              No delivery address saved
            </p>
            <Link
              href="/addresses"
              className="h-9 px-4 rounded-xl text-xs font-bold text-white inline-flex items-center gap-1"
              style={{ backgroundColor: "var(--color-brand)" }}
            >
              <Plus size={13} />
              Add Address
            </Link>
          </div>
        ) : (
          <AddressSelector
            addresses={addresses}
            selected={selectedAddress}
            onSelect={setSelectedAddress}
            onAddNew={() => router.push("/addresses")}
          />
        )}

        {/* Payment method */}
        <PaymentSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          isCodEnabled={settings?.is_cod_enabled ?? true}
          isOnlineEnabled={settings?.is_online_payment_enabled ?? false}
        />

        {/* Order summary */}
        <OrderSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          discount={discount}
          couponCode={coupon?.code}
          total={finalTotal}
          itemCount={items.length}
        />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Place order button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing || !selectedAddress}
          className="w-full flex items-center justify-between h-14 px-5 rounded-2xl text-sm font-black text-white transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          <span className="flex items-center gap-2">
            {isPlacing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            {isPlacing
              ? "Placing Order..."
              : paymentMethod === "cod"
              ? "Place Order (COD)"
              : "Pay & Place Order"}
          </span>
          <span>{formatPrice(finalTotal)}</span>
        </button>

        <p className="text-[11px] text-center text-gray-400">
          Delivery within Kozhikode district only
        </p>
      </div>
    </div>
  );
}
