// ============================================================
// API ROUTE — /api/categories
// Returns all active categories sorted by sort_order
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[categories] Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return Response.json({ data: data as Category[], error: null });
  } catch (err) {
    console.error("[categories] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
