// ============================================================
// COMPONENT — ProductGrid
// Editorial retail catalog grid with active filter chips,
// layout density toggle, and progressive pagination (20/page)
// ============================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  RotateCcw,
  X,
  LayoutGrid,
  Grid3x3,
  ArrowDown,
} from "lucide-react";
import ProductCard from "./ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import type { ProductWithImages } from "@/types/database";

const PAGE_SIZE = 20;

interface ProductsResponse {
  data: ProductWithImages[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

async function fetchProducts(
  params: URLSearchParams
): Promise<ProductsResponse> {
  const res = await fetch(`/api/products?${params.toString()}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export default function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denseDesktop, setDenseDesktop] = useState(false);

  const initialLoadRef = useRef(false);
  const filterKeyRef = useRef<string>("");

  const activeCategory = searchParams.get("category");
  const activeSearch = searchParams.get("search");
  const activeFeatured = searchParams.get("featured");
  const activeNewArrival = searchParams.get("new_arrival");
  const activeSort = searchParams.get("sort");

  // Build API params from URL
  const buildParams = useCallback(
    (pageNum: number) => {
      const params = new URLSearchParams();

      if (activeCategory) params.set("category", activeCategory);
      if (activeSearch) params.set("search", activeSearch);
      if (activeFeatured) params.set("featured", activeFeatured);
      if (activeNewArrival) params.set("new_arrival", activeNewArrival);
      if (activeSort === "price_asc") params.set("sort", "price_asc");
      if (activeSort === "price_desc") params.set("sort", "price_desc");
      if (activeSort === "newest") params.set("sort", "newest");

      params.set("page", String(pageNum));
      params.set("limit", String(PAGE_SIZE));
      return params;
    },
    [
      activeCategory,
      activeSearch,
      activeFeatured,
      activeNewArrival,
      activeSort,
    ]
  );

  // Create a unique key for current filters
  const getFilterKey = useCallback(() => {
    return `${activeCategory}|${activeSearch}|${activeFeatured}|${activeNewArrival}|${activeSort}`;
  }, [
    activeCategory,
    activeSearch,
    activeFeatured,
    activeNewArrival,
    activeSort,
  ]);

  // Load products function
  const loadProducts = useCallback(
    async (pageNum: number, isReset: boolean = false) => {
      try {
        const res = await fetchProducts(buildParams(pageNum));
        if (isReset) {
          setProducts(res.data ?? []);
        } else {
          setProducts((prev) => [...prev, ...(res.data ?? [])]);
        }
        setTotal(res.pagination?.total ?? 0);
        setPage(pageNum);
        setError(null);
      } catch {
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [buildParams]
  );

  // Initial load / filter change
  useEffect(() => {
    const currentFilterKey = getFilterKey();

    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      filterKeyRef.current = currentFilterKey;
      setIsLoading(true);
      setError(null);
      setPage(1);
      loadProducts(1, true);
      return;
    }

    if (filterKeyRef.current !== currentFilterKey) {
      filterKeyRef.current = currentFilterKey;
      setIsLoading(true);
      setError(null);
      setPage(1);
      loadProducts(1, true);
    }
  }, [getFilterKey, loadProducts]);

  async function handleLoadMore() {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    await loadProducts(nextPage, false);
  }

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  const hasMore = products.length < total;
  const progressPercent =
    total > 0 ? Math.min(100, Math.round((products.length / total) * 100)) : 100;

  const gridColumnsClass = denseDesktop
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4";

  // ── Skeleton grid ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-md hidden md:block" />
        </div>
        <div className={`grid ${gridColumnsClass}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-[#e6e4df] overflow-hidden flex flex-col"
            >
              <div className="aspect-square bg-[#f9f9f7] border-b border-[#f1f0ec]">
                <Skeleton className="w-full h-full rounded-none" />
              </div>
              <div className="p-3.5 flex flex-col gap-2.5">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <div className="pt-2 border-t border-[#f3f2ee] flex justify-between items-center mt-1">
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#e6e4df] my-4 px-4">
        <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
          <RotateCcw size={20} />
        </div>
        <h3 className="text-base font-bold text-[#061b49] mb-1">
          Unable to load catalog
        </h3>
        <p className="text-xs text-slate-500 mb-5 max-w-xs">{error}</p>
        <button
          type="button"
          onClick={() => loadProducts(1, true)}
          className="h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#061b49] hover:bg-[#2a66f4] transition-colors"
        >
          Retry loading
        </button>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#e6e4df] my-4 px-4">
        <div className="h-14 w-14 rounded-2xl bg-[#f4f3ef] border border-[#e6e4df] flex items-center justify-center mb-4 text-[#061b49]">
          <ShoppingBag size={24} strokeWidth={1.6} />
        </div>
        <h3 className="text-lg font-bold text-[#061b49] mb-1">
          No matching products
        </h3>
        <p className="text-xs md:text-sm text-slate-500 max-w-sm mb-5">
          We couldn&apos;t find any items matching your current filters or search
          query.
        </p>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#2a66f4] hover:bg-[#1d4ed8] transition-colors"
        >
          View all products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Status & Active Filter Bar ──────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center flex-wrap gap-2">
          <p className="text-xs text-slate-500 tabular-nums">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              1–{products.length}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{total}</span>{" "}
            {total === 1 ? "item" : "items"}
          </p>

          {/* Active filter dismissal pills */}
          {activeSearch && (
            <button
              type="button"
              onClick={() => removeFilter("search")}
              className="inline-flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium bg-white border border-[#e6e4df] text-slate-700 hover:border-slate-400 transition-colors"
            >
              <span>&ldquo;{activeSearch}&rdquo;</span>
              <X size={11} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Desktop Grid Density Toggle */}
        <div className="hidden md:flex items-center gap-1 bg-white border border-[#e6e4df] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setDenseDesktop(false)}
            aria-label="Standard 4-column view"
            title="Standard view"
            className={`h-6 w-7 flex items-center justify-center rounded-md transition-colors ${
              !denseDesktop
                ? "bg-[#061b49] text-white"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <LayoutGrid size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDenseDesktop(true)}
            aria-label="Compact 5-column view"
            title="Compact view"
            className={`h-6 w-7 flex items-center justify-center rounded-md transition-colors ${
              denseDesktop
                ? "bg-[#061b49] text-white"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <Grid3x3 size={13} />
          </button>
        </div>
      </div>

      {/* ── Product Grid ────────────────────────────────────── */}
      <div className={`grid ${gridColumnsClass}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ── Editorial Pagination Footer ─────────────────────── */}
      <div className="mt-10 mb-4 flex flex-col items-center">
        <p className="text-xs text-slate-500 tabular-nums mb-2">
          You&apos;ve viewed{" "}
          <span className="font-semibold text-slate-800">
            {products.length}
          </span>{" "}
          of <span className="font-semibold text-slate-800">{total}</span>{" "}
          products
        </p>

        {/* Subtle progress bar */}
        <div className="w-48 h-1 bg-[#e6e4df] rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-[#061b49] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl text-xs font-semibold text-[#061b49] bg-white hover:bg-[#061b49] hover:text-white border border-[#d6d3cd] hover:border-[#061b49] shadow-2xs transition-all disabled:opacity-60"
          >
            {isLoadingMore ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                <span>Loading more items...</span>
              </>
            ) : (
              <>
                <span>
                  Show more ({Math.min(PAGE_SIZE, total - products.length)}{" "}
                  more)
                </span>
                <ArrowDown size={13} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
