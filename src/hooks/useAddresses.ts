// ============================================================
// HOOK — useAddresses
// Fetches, creates, updates and deletes saved addresses
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Address {
  id: string;
  profile_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressInput {
  label?: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  city?: string;
  pincode: string;
  is_default?: boolean;
}

async function getAuthToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) {
        setAddresses([]);
        return;
      }
      const res = await fetch("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setAddresses(json.data ?? []);
      }
    } catch {
      setError("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAddresses();
  }, [fetchAddresses]);

  async function addAddress(
    input: AddressInput
  ): Promise<{ error: string | null }> {
    try {
      const token = await getAuthToken();
      if (!token) return { error: "Not authenticated" };

      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (json.error) return { error: json.error };
      await fetchAddresses();
      return { error: null };
    } catch {
      return { error: "Failed to save address" };
    }
  }

  async function updateAddress(
    id: string,
    input: Partial<AddressInput>
  ): Promise<{ error: string | null }> {
    try {
      const token = await getAuthToken();
      if (!token) return { error: "Not authenticated" };

      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (json.error) return { error: json.error };
      await fetchAddresses();
      return { error: null };
    } catch {
      return { error: "Failed to update address" };
    }
  }

  async function deleteAddress(id: string): Promise<{ error: string | null }> {
    try {
      const token = await getAuthToken();
      if (!token) return { error: "Not authenticated" };

      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.error) return { error: json.error };
      await fetchAddresses();
      return { error: null };
    } catch {
      return { error: "Failed to delete address" };
    }
  }

  const defaultAddress =
    addresses.find((a) => a.is_default) ?? addresses[0] ?? null;

  return {
    addresses,
    defaultAddress,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    refetch: fetchAddresses,
  };
}
