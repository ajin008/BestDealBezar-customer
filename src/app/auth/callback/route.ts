// ============================================================
// AUTH CALLBACK
// Handles OAuth redirect from Google
// Exchanges code for Supabase session → sets cookie
// Redirects to intended page or home
// ============================================================

// ============================================================
// AUTH CALLBACK
// Handles OAuth redirect from Google
// Exchanges code for Supabase session → sets cookie
// Redirects to home — AuthProvider handles final redirect
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // ← fix: next/server not next/request
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const response = NextResponse.redirect(`${origin}/`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] Exchange error:", error.message);
  }

  return response;
}
