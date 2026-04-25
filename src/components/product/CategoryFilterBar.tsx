// ============================================================
// COMPONENT — CategoryFilterBar
// Sticky horizontal category tabs + sort dropdown
// Reads/writes URL search params — no local state for filters
// ============================================================

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
];

export default function CategoryFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div
      className="sticky z-30 bg-white w-full"
      style={{
        top: 0,
        borderBottom: "1.5px solid #e8ecef",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="container-app">
        <div className="flex items-center gap-2 py-2.5">
          {/* Category tabs — scrollable, takes all remaining space */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto flex-1 min-w-0"
            style={{ scrollbarWidth: "none" }}
          >
            {/* All tab */}
            <button
              onClick={() => updateParam("category", "")}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={
                activeCategory === ""
                  ? { backgroundColor: "var(--color-brand)", color: "#fff" }
                  : { backgroundColor: "#f1f5f9", color: "#555" }
              }
            >
              All
            </button>

            {/* Skeleton tabs */}
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-7 w-20 rounded-xl animate-pulse"
                  style={{ backgroundColor: "#e8ecef" }}
                />
              ))}

            {/* Category tabs */}
            {!isLoading &&
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam("category", cat.slug)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                  style={
                    activeCategory === cat.slug
                      ? { backgroundColor: "var(--color-brand)", color: "#fff" }
                      : { backgroundColor: "#f1f5f9", color: "#555" }
                  }
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* Divider */}
          <div
            className="flex-shrink-0 self-stretch w-px my-1"
            style={{ backgroundColor: "#e8ecef" }}
          />

          {/* Sort — fixed width, never shrinks */}
          <div className="relative flex-shrink-0">
            <SlidersHorizontal
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
            />
            <select
              value={activeSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="h-8 pl-7 pr-6 rounded-xl text-xs font-semibold outline-none cursor-pointer appearance-none"
              style={{
                border: "1.5px solid #e8ecef",
                backgroundColor: "#f8fafc",
                color: "var(--color-navy)",
                minWidth: "130px",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
