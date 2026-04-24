// ============================================================
// AUTH STORE
// Tracks logged-in user state across the app
// Populated by AuthProvider after Supabase session check
// ============================================================

import { create } from "zustand";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  openAuthModal: () => set({ isAuthModalOpen: true }),

  closeAuthModal: () => set({ isAuthModalOpen: false }),

  logout: () =>
    set({
      user: null,
      isAuthModalOpen: false,
    }),
}));
