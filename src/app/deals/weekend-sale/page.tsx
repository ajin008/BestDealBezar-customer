// app/deals/weekend-sale/client.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, ArrowLeft, Gift } from "lucide-react";

export default function WeekendSaleClient() {
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifyMe = () => {
    setIsNotified(true);
    setTimeout(() => {
      setIsNotified(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="container-app">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} className="text-navy" />
            </Link>
            <h1 className="text-sm font-semibold text-navy">Weekend Sale</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>

      <div className="container-app py-12">
        <div className="max-w-sm mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-50 flex items-center justify-center">
            <Gift size={28} className="text-brand" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-navy mb-2">Coming Soon</h1>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-6">
            Weekend deals are on their way. Get notified when we launch!
          </p>

          {/* Notify Button */}
          <button
            onClick={handleNotifyMe}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            <Bell size={16} />
            {isNotified ? "✓ You're on the list!" : "Notify Me"}
          </button>

          {/* Back link */}
          <Link
            href="/products"
            className="inline-block mt-6 text-xs text-gray-400 hover:text-brand transition-colors"
          >
            ← Back to shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
