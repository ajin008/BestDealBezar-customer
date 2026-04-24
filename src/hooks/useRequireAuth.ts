// ============================================================
// HOOK — useRequireAuth
// Client-side auth guard for protected pages
// Opens auth modal if user is not logged in
// ============================================================

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function useRequireAuth() {
  const { user, isLoading, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      openAuthModal();
    }
  }, [user, isLoading, openAuthModal]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
