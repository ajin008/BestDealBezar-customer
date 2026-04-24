// ============================================================
// SUPABASE SERVER CLIENT
// Use this ONLY in API routes (src/app/api/*)
// Uses service role key — bypasses RLS safely
// Never import this in Client Components
// ============================================================

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function createServerClient() {
  return createSupabaseClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
