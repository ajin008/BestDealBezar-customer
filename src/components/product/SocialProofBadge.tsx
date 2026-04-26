// ============================================================
// COMPONENT — SocialProofBadge
// Shows "X people purchased in last 24h" — dummy but seeded
// per product so the number stays consistent on re-renders
// but varies across products.
// Usage: <SocialProofBadge productId={product.id} />
// ============================================================

"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";

interface SocialProofBadgeProps {
  productId: string;
  className?: string;
}

// Deterministic pseudo-random number seeded by productId
// so each product always gets the same count (no flicker on re-render)
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

function getPurchaseCount(productId: string): number {
  const rand = seededRandom(productId);
  // Range: 8 – 149, weighted toward lower numbers (feels more honest)
  const ranges = [
    { min: 8, max: 40, weight: 50 }, // most products: low
    { min: 41, max: 99, weight: 35 }, // some: moderate
    { min: 100, max: 149, weight: 15 }, // few: near-high
  ];
  const pick = rand % 100;
  let cumulative = 0;
  for (const range of ranges) {
    cumulative += range.weight;
    if (pick < cumulative) {
      return range.min + (rand % (range.max - range.min + 1));
    }
  }
  return 34;
}

export default function SocialProofBadge({
  productId,
  className = "",
}: SocialProofBadgeProps) {
  const count = useMemo(() => getPurchaseCount(productId), [productId]);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${className}`}
      style={{
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
      }}
    >
      {/* Pulsing green dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: "#22c55e" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: "#16a34a" }}
        />
      </span>

      <Users size={13} className="text-green-600 shrink-0" />

      <p className="text-xs font-medium text-green-800 leading-tight">
        <span className="font-bold">{count} people</span> bought this in the
        last 24 hours
      </p>
    </div>
  );
}
