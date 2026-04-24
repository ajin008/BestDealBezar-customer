// ============================================================
// COMPONENT — AuthProvider
// Checks Supabase session on app load and populates authStore
// Must wrap the entire app in layout.tsx
// ============================================================

"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    async function getSession() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser({
            id: user.id,
            name:
              user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            email: user.email ?? null,
            phone: user.phone ?? user.user_metadata?.phone ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getSession();

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata?.full_name ??
            session.user.user_metadata?.name ??
            null,
          email: session.user.email ?? null,
          phone:
            session.user.phone ?? session.user.user_metadata?.phone ?? null,
          avatar_url: session.user.user_metadata?.avatar_url ?? null,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}
