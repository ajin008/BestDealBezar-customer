// ============================================================
// COMPONENT — FeaturedProducts
// Horizontal scroll section showing featured products
// Shows 2 at a time on mobile, 4 on desktop
// ============================================================

// ============================================================
// COMPONENT — FeaturedProducts (reusable)
// Horizontal scroll section — accepts filter props
// Used for: Featured, New Arrivals, All Products
// ============================================================

"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "../product/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import { ROUTES } from "@/lib/constants";
import type { ProductFilters } from "@/types";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  filters?: ProductFilters;
  seeAllHref?: string;
}

export default function FeaturedProducts({
  title,
  subtitle,
  filters = {},
  seeAllHref,
}: FeaturedProductsProps) {
  const { products, isLoading } = useProducts({
    ...filters,
    limit: filters.limit ?? 8,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  }

  if (!isLoading && products.length === 0) return null;

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2
            className="text-base font-black leading-tight"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              color: "var(--color-navy)",
            }}
          >
            {title}
          </h2>
          {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="flex items-center gap-1 text-xs font-bold transition-colors mr-1"
              style={{ color: "var(--color-brand)" }}
            >
              See all
              <ArrowRight size={12} />
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            className="h-7 w-7 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100 active:scale-95"
            style={{ border: "1.5px solid #e8ecef" }}
          >
            <ChevronLeft size={14} className="text-gray-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="h-7 w-7 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100 active:scale-95"
            style={{ border: "1.5px solid #e8ecef" }}
          >
            <ChevronRight size={14} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {/* Skeletons */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: "calc(50% - 6px)", scrollSnapAlign: "start" }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1.5px solid #e8ecef" }}
              >
                <div style={{ aspectRatio: "1/1" }}>
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-2.5 flex flex-col gap-2">
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <div className="flex justify-between items-center mt-1">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-7 w-7 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Products */}
        {!isLoading &&
          products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: "calc(50% - 6px)", scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </div>
  );
}
