"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { ROUTES } from "@/lib/constants";
import Skeleton from "@/components/ui/Skeleton";

// Fallback bg colors per slug — shown behind image or when no image
const CATEGORY_COLORS: Record<string, string> = {
  "groceries-staples": "#e8f5ee",
  beverages: "#fff3e0",
  "snacks-dry-fruits": "#fce4ec",
  "household-cleaning": "#e3f2fd",
  "personal-care": "#f3e5f5",
  "dairy-eggs": "#fffde7",
  "cooking-essentials": "#fbe9e7",
  "fresh-produce": "#f1f8e9",
  "meat-seafood": "#e8eaf6",
  "gift-items": "#fdf4ff",
};

function shortName(name: string): string {
  const map: Record<string, string> = {
    "Groceries & Staples": "Groceries",
    "Snacks & Dry Fruits": "Snacks",
    "Household & Cleaning": "Household",
    "Cooking Essentials": "Cooking",
    "Juices & Soft Drinks": "Juices",
    "Health & Wellness": "Health",
  };
  return map[name] ?? name;
}

export default function CategoryScroll() {
  const { categories, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "right" ? 320 : -320,
      behavior: "smooth",
    });
  }

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-base font-black"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            color: "var(--color-navy)",
          }}
        >
          Shop by Category
        </h2>

        {/* Scroll arrows */}
        <div className="flex items-center gap-1">
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

      {/* Scroll container — shows exactly 4 at a time */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 flex-shrink-0"
              style={{ width: "calc(25% - 9px)", scrollSnapAlign: "start" }}
            >
              <Skeleton className="w-full rounded-2xl aspect-square" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          ))}

        {/* Category items */}
        {!isLoading &&
          categories.map((cat) => {
            const bg = CATEGORY_COLORS[cat.slug] ?? "#f1f5f9";

            return (
              <Link
                key={cat.id}
                href={`${ROUTES.products}?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
                style={{
                  width: "calc(25% - 9px)",
                  scrollSnapAlign: "start",
                }}
              >
                {/* Image box */}
                <div
                  className="w-full rounded-2xl overflow-hidden relative transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                  style={{
                    backgroundColor: bg,
                    aspectRatio: "1 / 1",
                  }}
                >
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 120px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ color: "#94a3b8" }}
                    >
                      <LayoutGrid size={24} />
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-[10px] font-semibold text-center leading-tight w-full truncate px-1"
                  style={{ color: "var(--color-navy)" }}
                >
                  {shortName(cat.name)}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
