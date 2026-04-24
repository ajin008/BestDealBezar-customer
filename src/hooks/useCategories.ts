// ============================================================
// HOOK — useCategories
// Fetches all active categories
// Cached in memory — categories rarely change
// ============================================================

"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types/database";

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

let cache: Category[] | null = null;

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>(cache ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategories(cache);
      setIsLoading(false);
      return;
    }

    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const json = await response.json();

        if (json.error) {
          setError(json.error);
          return;
        }

        cache = json.data;
        setCategories(json.data);
      } catch {
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
