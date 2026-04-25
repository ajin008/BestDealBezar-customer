// ============================================================
// COMPONENT — DeliveryInfoBanner
// Shows delivery info pulled from store settings
// Free delivery threshold + delivery area
// ============================================================

"use client";

import { Truck, MapPin, Zap } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { formatPrice } from "@/lib/utils";

export default function DeliveryInfoBanner() {
  const { settings } = useStoreSettings();

  const freeAbove = settings?.free_delivery_above ?? 500;
  const deliveryCharge = settings?.flat_delivery_charge ?? 60;

  return (
    <div
      className="mt-4 rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid var(--color-brand-100)" }}
    >
      <div className="flex items-stretch">
        {/* Free delivery */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-center"
          style={{ backgroundColor: "var(--color-brand-50)" }}
        >
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <Truck size={15} color="#fff" />
          </div>
          <p
            className="text-[11px] font-black leading-tight"
            style={{ color: "var(--color-navy)" }}
          >
            Free Delivery
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">
            above {formatPrice(freeAbove)}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{ width: "1px", backgroundColor: "var(--color-brand-100)" }}
        />

        {/* Delivery charge */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-center"
          style={{ backgroundColor: "var(--color-brand-50)" }}
        >
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <Zap size={15} color="#fff" />
          </div>
          <p
            className="text-[11px] font-black leading-tight"
            style={{ color: "var(--color-navy)" }}
          >
            Fast Delivery
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">
            only {formatPrice(deliveryCharge)} fee
          </p>
        </div>

        {/* Divider */}
        <div
          style={{ width: "1px", backgroundColor: "var(--color-brand-100)" }}
        />

        {/* Delivery area */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 text-center"
          style={{ backgroundColor: "var(--color-brand-50)" }}
        >
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <MapPin size={15} color="#fff" />
          </div>
          <p
            className="text-[11px] font-black leading-tight"
            style={{ color: "var(--color-navy)" }}
          >
            Kozhikode
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">
            district only
          </p>
        </div>
      </div>
    </div>
  );
}
