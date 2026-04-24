// ============================================================
// HOOK — useProducts
// Fetches products with optional filters
// Re-fetches when filters change
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProductWithImages } from "@/types/database";
import type { ProductFilters } from "@/types";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseProductsReturn {
  products: ProductWithImages[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(filters: ProductFilters = {}): UseProductsReturn {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.category) params.set("category", filters.category);
        if (filters.search) params.set("search", filters.search);
        if (filters.featured) params.set("featured", "true");
        if (filters.new_arrival) params.set("new_arrival", "true");
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const response = await fetch(`/api/products?${params.toString()}`);
        const json = await response.json();

        if (json.error) {
          setError(json.error);
          return;
        }

        setProducts(json.data ?? []);
        setPagination(json.pagination ?? null);
      } catch {
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.category,
    filters.search,
    filters.featured,
    filters.new_arrival,
    filters.page,
    filters.limit,
    trigger,
  ]);

  return { products, pagination, isLoading, error, refetch };
}
