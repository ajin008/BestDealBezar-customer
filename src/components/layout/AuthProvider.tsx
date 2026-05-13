// ============================================================
// COMPONENT — AuthProvider
// Checks Supabase session on app load and populates authStore
// Must wrap the entire app in layout.tsx
// ============================================================
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name:
            u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,
          email: u.email ?? null,
          phone: u.phone ?? u.user_metadata?.phone ?? null,
          avatar_url: u.user_metadata?.avatar_url ?? null,
        });

        // Ensure profile row exists — call API route (uses service role key, bypasses RLS)
        fetch("/api/auth/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: u.id,
            name: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,
            email: u.email ?? null,
            phone: u.phone ?? u.user_metadata?.phone ?? null,
            avatar_url: u.user_metadata?.avatar_url ?? null,
          }),
        }).catch((err) => console.error("[AuthProvider] profile sync failed:", err));

        // Redirect to stored destination after login
        const redirectTo = localStorage.getItem("auth_redirect");
        if (redirectTo) {
          localStorage.removeItem("auth_redirect");
          router.push(redirectTo);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, router]);

  return <>{children}</>;
}
