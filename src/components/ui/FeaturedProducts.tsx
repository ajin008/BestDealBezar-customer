// ============================================================
// COMPONENT — FeaturedProducts (reusable)
// Editorial product shelf — supports carousel & responsive grid
// Used for: Featured, New Arrivals, All Products, Related
// ============================================================

"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "../product/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import type { ProductFilters } from "@/types";

interface FeaturedProductsProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  filters?: ProductFilters;
  seeAllHref?: string;
  layout?: "carousel" | "grid";
}

export default function FeaturedProducts({
  eyebrow,
  title,
  subtitle,
  filters = {},
  seeAllHref,
  layout = "carousel",
}: FeaturedProductsProps) {
  const { products, isLoading } = useProducts({
    ...filters,
    limit: filters.limit ?? 8,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "right" ? 480 : -480,
      behavior: "smooth",
    });
  }

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mt-7 md:mt-11">
      {/* Editorial Section Header */}
      <div className="flex items-end justify-between gap-3 pb-2.5 mb-3.5 border-b border-[#e6e4df]">
        <div className="min-w-0">
          {eyebrow && (
            <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              {eyebrow}
            </span>
          )}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-base md:text-xl font-bold tracking-tight text-[#061b49]">
              {title}
            </h2>
            {subtitle && (
              <span className="hidden sm:inline text-xs text-slate-500 font-normal">
                — {subtitle}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="sm:hidden text-[11px] text-slate-500 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-semibold text-[#2a66f4] md:text-[#061b49] md:bg-white md:hover:bg-[#061b49] md:hover:text-white md:border md:border-[#e6e4df] md:hover:border-[#061b49] transition-colors"
            >
              <span>See all</span>
              <ArrowRight size={12} />
            </Link>
          )}
          {layout === "carousel" && (
            <div className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label={`Scroll ${title} left`}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white border border-[#e6e4df] text-slate-600 hover:border-slate-300 hover:text-[#061b49] active:scale-95 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label={`Scroll ${title} right`}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white border border-[#e6e4df] text-slate-600 hover:border-slate-300 hover:text-[#061b49] active:scale-95 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout Option */}
      {layout === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
          {isLoading
            ? Array.from({ length: filters.limit ?? 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white border border-[#e6e4df] overflow-hidden"
                >
                  <div className="aspect-square bg-[#f9f9f7] border-b border-[#f1f0ec]">
                    <Skeleton className="w-full h-full rounded-none" />
                  </div>
                  <div className="p-3.5 flex flex-col gap-2">
                    <Skeleton className="h-3 w-14 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <div className="pt-2 border-t border-[#f3f2ee] flex justify-between items-center mt-1">
                      <Skeleton className="h-5 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      ) : (
        /* Responsive Carousel Layout: 2 on mobile, 3 on tablet, 4 on desktop */
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-12px)]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="rounded-xl bg-white border border-[#e6e4df] overflow-hidden">
                  <div className="aspect-square bg-[#f9f9f7] border-b border-[#f1f0ec]">
                    <Skeleton className="w-full h-full rounded-none" />
                  </div>
                  <div className="p-3.5 flex flex-col gap-2">
                    <Skeleton className="h-3 w-14 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <div className="pt-2 border-t border-[#f3f2ee] flex justify-between items-center mt-1">
                      <Skeleton className="h-5 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {!isLoading &&
            products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-12px)] flex"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="w-full">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
