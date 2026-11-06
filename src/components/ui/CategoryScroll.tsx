// ============================================================
// COMPONENT — CategoryScroll
// Native-app 4-column grid on mobile + horizontal strip on desktop
// ============================================================

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { ROUTES } from "@/lib/constants";
import Skeleton from "@/components/ui/Skeleton";

function formatCategoryName(name: string): string {
  const map: Record<string, string> = {
    "Groceries & Staples": "Groceries",
    "Snacks & Dry Fruits": "Snacks & Nuts",
    "Household & Cleaning": "Household",
    "Cooking Essentials": "Cooking",
    "Juices & Soft Drinks": "Beverages",
    "Health & Wellness": "Wellness",
    "Personal Care": "Personal Care",
    "Dairy & Eggs": "Dairy & Eggs",
    "Fresh Produce": "Fresh Produce",
    "Meat & Seafood": "Meat & Fish",
    "gift items": "Gift Items",
    "Gift Items": "Gift Items",
  };
  if (map[name]) return map[name];
  // Ensure clean Title Case if DB has lowercase like "gift items"
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function CategoryScroll() {
  const { categories, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  }

  return (
    <section className="mt-6 md:mt-10" aria-labelledby="departments-heading">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3 pb-2.5 mb-3.5 border-b border-[#e6e4df]">
        <div>
          <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            Store Directory
          </span>
          <h2
            id="departments-heading"
            className="text-base md:text-xl font-bold tracking-tight text-[#061b49]"
          >
            Shop by Category
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.products}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a66f4] md:text-slate-600 md:hover:text-[#2a66f4] transition-colors"
          >
            <span>See all</span>
            <ArrowUpRight size={13} />
          </Link>

          {/* Desktop-only scroll arrows */}
          <div className="hidden md:flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll departments left"
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-white border border-[#e6e4df] text-slate-600 hover:border-slate-300 hover:text-[#061b49] active:scale-95 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll departments right"
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-white border border-[#e6e4df] text-slate-600 hover:border-slate-300 hover:text-[#061b49] active:scale-95 transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile: Native App 4-Column Bento Grid ──────────── */}
      <div className="grid grid-cols-4 gap-2.5 md:hidden">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          ))}

        {!isLoading &&
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${ROUTES.products}?category=${cat.slug}`}
              className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-[#e6e4df] p-1.5 shadow-2xs">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#f7f7f5]">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="22vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <LayoutGrid size={20} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#061b49] text-center leading-tight line-clamp-2 px-0.5">
                {formatCategoryName(cat.name)}
              </span>
            </Link>
          ))}
      </div>

      {/* ── Desktop: Horizontal Index Strip ─────────────────── */}
      <div
        ref={scrollRef}
        className="hidden md:flex gap-3 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[148px] rounded-xl bg-white border border-[#e6e4df] p-2.5 flex flex-col gap-2"
            >
              <Skeleton className="w-full aspect-4/3 rounded-lg" />
              <Skeleton className="h-3.5 w-3/4 rounded" />
            </div>
          ))}

        {!isLoading &&
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${ROUTES.products}?category=${cat.slug}`}
              className="flex-shrink-0 w-[148px] rounded-xl bg-white border border-[#e6e4df] hover:border-slate-300 hover:shadow-xs p-2 transition-all group"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-[#f7f7f5] border border-[#f1f0ec] mb-2">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <LayoutGrid size={20} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-1 px-0.5">
                <span className="text-xs font-semibold text-[#061b49] group-hover:text-[#2a66f4] transition-colors truncate leading-snug">
                  {formatCategoryName(cat.name)}
                </span>
                <ArrowUpRight
                  size={11}
                  className="text-slate-300 group-hover:text-[#2a66f4] flex-shrink-0 transition-colors"
                />
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
