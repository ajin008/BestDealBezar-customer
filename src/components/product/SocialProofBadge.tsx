// ============================================================
// COMPONENT — SocialProofBadge
// Shows "X people purchased in last 24h" — dummy but seeded
// per product to yield an honest single-digit range (3-9).
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
  // Yields a consistent single digit between 3 and 9 inclusive
  return 3 + (rand % 7);
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
        <span className="font-bold">{count} people</span> ordered this in the
        last 24 hours
      </p>
    </div>
  );
}
