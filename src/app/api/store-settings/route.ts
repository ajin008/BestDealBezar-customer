// ============================================================
// API ROUTE — /api/store-settings
// Returns store configuration (delivery charges, payment methods)
// Called once on app load via useStoreSettings hook
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import type { StoreSettings } from "@/types/database";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .single();

    if (error) {
      console.error("[store-settings] Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch store settings" },
        { status: 500 }
      );
    }

    return Response.json({ data: data as StoreSettings, error: null });
  } catch (err) {
    console.error("[store-settings] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
