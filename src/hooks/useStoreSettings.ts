// ============================================================
// HOOK — useStoreSettings
// Fetches store config once on app load
// Cached in memory — won't refetch on every component mount
// ============================================================

"use client";

import { useState, useEffect } from "react";
import type { StoreSettings } from "@/types/database";

interface UseStoreSettingsReturn {
  settings: StoreSettings | null;
  isLoading: boolean;
  error: string | null;
}

// Module-level cache — persists for the lifetime of the browser session
let cache: StoreSettings | null = null;

export function useStoreSettings(): UseStoreSettingsReturn {
  const [settings, setSettings] = useState<StoreSettings | null>(cache);
  const [isLoading, setIsLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Already cached — no need to fetch
    if (cache) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings(cache);
      setIsLoading(false);
      return;
    }

    async function fetchSettings() {
      try {
        const response = await fetch("/api/store-settings");
        const json = await response.json();

        if (json.error) {
          setError(json.error);
          return;
        }

        cache = json.data;
        setSettings(json.data);
      } catch {
        setError("Failed to load store settings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, isLoading, error };
}
