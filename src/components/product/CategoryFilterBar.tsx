// ============================================================
// COMPONENT — CategoryFilterBar
// Editorial department navigation + filter/sort toolbar
// Reads/writes URL search params — no local state for filters
// ============================================================

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { ArrowUpDown, ChevronDown, Sparkles, Star, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
];

export default function CategoryFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "";
  const activeSearch = searchParams.get("search") ?? "";
  const isFeatured = searchParams.get("featured") === "true";
  const isNewArrival = searchParams.get("new_arrival") === "true";

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);

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

  function toggleBoolParam(key: string, current: boolean) {
    updateParam(key, current ? "" : "true");
  }

  function clearAllFilters() {
    router.push("/products");
  }

  const hasActiveFilters =
    Boolean(activeCategory) ||
    Boolean(activeSearch) ||
    isFeatured ||
    isNewArrival ||
    Boolean(activeSort);

  // Determine editorial header title & subtitle
  const pageTitle = activeSearch
    ? `Results for "${activeSearch}"`
    : activeCategoryObj
      ? activeCategoryObj.name
      : isNewArrival
        ? "New Arrivals"
        : isFeatured
          ? "Featured Selection"
          : "All Groceries & Essentials";

  const pageSubtitle = activeSearch
    ? "Matching items across our wholesale catalog"
    : activeCategoryObj
      ? `Curated ${activeCategoryObj.name.toLowerCase()} at direct wholesale prices`
      : "Everyday pantry staples, fresh goods & household supplies delivered across Kozhikode";

  return (
    <div className="bg-white border-b border-[#e6e4df]">
      {/* ── Editorial Page Header ────────────────────────────── */}
      <div className="container-app pt-3.5 pb-3 md:pt-7 md:pb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 md:gap-3">
          <div>
            <div className="hidden md:flex items-center gap-2 text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-1">
              <span>Catalog</span>
              <span>/</span>
              <span className="text-slate-700 font-semibold">
                {activeCategoryObj ? activeCategoryObj.name : "All Departments"}
              </span>
            </div>
            <h1
              className="text-lg md:text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-navy)" }}
            >
              {pageTitle}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 max-w-xl line-clamp-1 md:line-clamp-none">
              {pageSubtitle}
            </p>
          </div>

          {/* Quick curation toggles (Featured / New Arrivals) */}
          <div className="flex items-center gap-1.5 md:gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => toggleBoolParam("featured", isFeatured)}
              className={`inline-flex items-center gap-1.5 h-7 md:h-8 px-2.5 md:px-3 rounded-lg text-[11px] md:text-xs font-medium transition-colors border ${
                isFeatured
                  ? "bg-[#061b49] text-white border-[#061b49]"
                  : "bg-[#fafaf9] text-slate-600 border-[#e6e4df] hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Star
                size={11}
                className={isFeatured ? "fill-amber-400 text-amber-400" : "text-slate-400"}
              />
              Featured
            </button>

            <button
              type="button"
              onClick={() => toggleBoolParam("new_arrival", isNewArrival)}
              className={`inline-flex items-center gap-1.5 h-7 md:h-8 px-2.5 md:px-3 rounded-lg text-[11px] md:text-xs font-medium transition-colors border ${
                isNewArrival
                  ? "bg-[#061b49] text-white border-[#061b49]"
                  : "bg-[#fafaf9] text-slate-600 border-[#e6e4df] hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Sparkles
                size={11}
                className={isNewArrival ? "text-sky-300" : "text-slate-400"}
              />
              New In
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 h-7 md:h-8 px-2 md:px-2.5 rounded-lg text-[11px] md:text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/60 transition-colors"
                title="Reset all filters"
              >
                <X size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky Department & Sort Bar ─────────────────────── */}
      <div
        className="sticky top-[102px] md:top-14 z-30 bg-white/95 backdrop-blur-md border-t border-[#f1f0ec]"
      >
        <div className="container-app">
          <div className="flex items-center justify-between gap-3 py-2.5">
            {/* Department pills — horizontal scroll */}
            <nav
              ref={scrollRef}
              aria-label="Product departments"
              className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0 py-0.5"
              style={{ scrollbarWidth: "none" }}
            >
              <button
                type="button"
                onClick={() => updateParam("category", "")}
                className={`flex-shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === ""
                    ? "bg-[#2a66f4] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                All Items
              </button>

              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 h-8 w-24 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}

              {!isLoading &&
                categories.map((cat) => {
                  const active = activeCategory === cat.slug;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => updateParam("category", cat.slug)}
                      className={`flex-shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        active
                          ? "bg-[#2a66f4] text-white shadow-xs"
                          : "bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
            </nav>

            {/* Vertical hairline divider */}
            <div className="h-5 w-px bg-[#e6e4df] flex-shrink-0" />

            {/* Sort control */}
            <div className="relative flex-shrink-0 flex items-center">
              <label htmlFor="catalog-sort" className="sr-only">
                Sort products
              </label>
              <ArrowUpDown
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                id="catalog-sort"
                name="sort"
                value={activeSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="editorial-select h-8 pl-7 pr-7 rounded-lg text-xs font-semibold text-slate-700 bg-[#fafaf9] border border-[#e6e4df] hover:border-slate-300 focus:border-[#2a66f4] outline-none cursor-pointer appearance-none transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
