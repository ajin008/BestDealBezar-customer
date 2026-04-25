// ============================================================
// HOOK — useOrders
// Fetches orders for the logged-in user by email
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderWithItems } from "@/types/database";

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setOrders([]);
        return;
      }

      // Fetch by email — more reliable than phone
      const res = await fetch(
        `/api/orders?email=${encodeURIComponent(user.email ?? "")}`
      );
      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else {
        setOrders(json.data ?? []);
      }
    } catch {
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setOrder(json.data);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { order, isLoading, error };
}
