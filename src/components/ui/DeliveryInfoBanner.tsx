// ============================================================
// COMPONENT — DeliveryInfoBanner
// Native-app trust strip on mobile + 4-column ledger on desktop
// ============================================================

"use client";

import { Truck, MapPin, ShieldCheck, Clock } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { formatPrice } from "@/lib/utils";

export default function DeliveryInfoBanner() {
  const { settings, isLoading } = useStoreSettings();

  if (isLoading && !settings) {
    return (
      <div className="mt-3 md:mt-4 h-10 md:h-16 rounded-xl bg-white border border-[#e6e4df] animate-pulse" />
    );
  }

  const freeAbove = settings?.free_delivery_above ?? 500;
  const deliveryCharge = settings?.flat_delivery_charge ?? 60;

  // Compact mobile pills — never truncates!
  const mobilePills = [
    {
      icon: Truck,
      label:
        freeAbove <= 10
          ? "Free Delivery"
          : `Free Delivery above ${formatPrice(freeAbove)}`,
    },
    {
      icon: Clock,
      label: "24-Hour Dispatch",
    },
    {
      icon: ShieldCheck,
      label: "Direct Wholesale",
    },
    {
      icon: MapPin,
      label: "Kozhikode District",
    },
  ];

  const desktopPillars = [
    {
      icon: Truck,
      title:
        freeAbove <= 10
          ? "Free Doorstep Delivery"
          : `Free Delivery > ${formatPrice(freeAbove)}`,
      subtitle:
        freeAbove <= 10
          ? "Across Kozhikode district"
          : `Flat ${formatPrice(deliveryCharge)} below threshold`,
    },
    {
      icon: Clock,
      title: "24-Hour Dispatch",
      subtitle: "Prompt doorstep fulfillment",
    },
    {
      icon: ShieldCheck,
      title: "Direct Wholesale",
      subtitle: "Adithya Trading Co. pricing",
    },
    {
      icon: MapPin,
      title: "Kozhikode District",
      subtitle: "Dedicated local network",
    },
  ];

  return (
    <section aria-label="Store guarantees and delivery policy" className="mt-3 md:mt-4">
      {/* ── Mobile: Single-Row Scrollable App Pill Strip ─────── */}
      <div
        className="md:hidden flex items-center gap-2 overflow-x-auto py-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {mobilePills.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex-shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-[#e6e4df] text-[11px] font-semibold text-[#061b49] whitespace-nowrap"
          >
            <Icon size={13} className="text-[#2a66f4] flex-shrink-0" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Desktop: 4-Column Architectural Service Ledger ──── */}
      <div className="hidden md:grid md:grid-cols-4 bg-white rounded-xl border border-[#e6e4df] divide-x divide-[#f1f0ec] overflow-hidden">
        {desktopPillars.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="flex items-center gap-3 px-4 py-3.5 min-w-0"
          >
            <div className="h-8 w-8 rounded-lg bg-[#f7f7f5] border border-[#e6e4df] flex items-center justify-center flex-shrink-0 text-[#061b49]">
              <Icon size={15} strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#061b49] truncate leading-tight tabular-nums">
                {title}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight tabular-nums">
                {subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
