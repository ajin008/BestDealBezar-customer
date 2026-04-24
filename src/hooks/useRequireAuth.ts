// ============================================================
// HOOK — useRequireAuth
// Client-side auth guard for protected pages
// Opens auth modal if user is not logged in
// Reads ?next= param after login to redirect back
// ============================================================

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function useRequireAuth() {
  const { user, isLoading, openAuthModal } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      openAuthModal();
    }
  }, [user, isLoading, openAuthModal]);

  // Call this after successful login to navigate to intended page
  function redirectAfterLogin() {
    const next = searchParams.get("next");
    if (next) {
      router.push(next);
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    redirectAfterLogin,
  };
}
