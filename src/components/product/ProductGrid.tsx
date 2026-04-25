// ============================================================
// COMPONENT — ProductGrid
// 2-col mobile, 3-col desktop grid
// Load more pagination
// Reads filters from URL params
// ============================================================

// ============================================================
// COMPONENT — ProductGrid
// 2-col mobile, 3-col desktop grid
// Load more pagination
// Reads filters from URL params
// ============================================================

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingBag, RotateCcw } from "lucide-react";
import ProductCard from "./ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import type { ProductWithImages } from "@/types/database";

const PAGE_SIZE = 12;

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
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if initial load has been done
  const initialLoadRef = useRef(false);
  const filterKeyRef = useRef<string>("");

  // Build API params from URL
  const buildParams = useCallback(
    (pageNum: number) => {
      const params = new URLSearchParams();
      const category = searchParams.get("category");
      const search = searchParams.get("search");
      const featured = searchParams.get("featured");
      const newArrival = searchParams.get("new_arrival");
      const sort = searchParams.get("sort");

      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (featured) params.set("featured", featured);
      if (newArrival) params.set("new_arrival", newArrival);
      if (sort === "price_asc") params.set("sort", "price_asc");
      if (sort === "price_desc") params.set("sort", "price_desc");
      if (sort === "newest") params.set("sort", "newest");

      params.set("page", String(pageNum));
      params.set("limit", String(PAGE_SIZE));
      return params;
    },
    [searchParams]
  );

  // Create a unique key for current filters
  const getFilterKey = useCallback(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("new_arrival");
    const sort = searchParams.get("sort");
    return `${category}|${search}|${featured}|${newArrival}|${sort}`;
  }, [searchParams]);

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

    // Skip if this is the initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      filterKeyRef.current = currentFilterKey;
      setIsLoading(true);
      setError(null);
      setPage(1);
      loadProducts(1, true);
      return;
    }

    // Only reload if filters changed
    if (filterKeyRef.current !== currentFilterKey) {
      filterKeyRef.current = currentFilterKey;
      setIsLoading(true);
      setError(null);
      setPage(1);
      loadProducts(1, true);
    }
  }, [getFilterKey, loadProducts]);

  // Load more
  async function handleLoadMore() {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    await loadProducts(nextPage, false);
  }

  const hasMore = products.length < total;

  // Helper to get aspect ratio style as className
  const getAspectClass = () => {
    return "aspect-square";
  };

  // ── Skeleton grid ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid #e8ecef" }}
          >
            <div className={getAspectClass()}>
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-2.5 flex flex-col gap-2">
              <Skeleton className="h-3 w-1/2 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
              <div className="flex justify-between mt-1">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-7 w-7 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <RotateCcw size={28} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{ backgroundColor: "var(--color-brand)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "var(--color-brand-50)" }}
        >
          <ShoppingBag size={26} style={{ color: "var(--color-brand)" }} />
        </div>
        <h3
          className="text-base font-black mb-1"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            color: "var(--color-navy)",
          }}
        >
          No products found
        </h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Try a different category or search term
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        Showing{" "}
        <span className="font-bold text-gray-600">{products.length}</span> of{" "}
        <span className="font-bold text-gray-600">{total}</span> products
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-6 mb-2">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
            style={{
              border: "2px solid var(--color-brand)",
              color: "var(--color-brand)",
              backgroundColor: "var(--color-brand-50)",
            }}
          >
            {isLoadingMore ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Loading...
              </>
            ) : (
              `Load more (${total - products.length} remaining)`
            )}
          </button>
        </div>
      )}

      {/* All loaded */}
      {!hasMore && products.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-6 mb-2">
          All {total} products loaded
        </p>
      )}
    </div>
  );
}
