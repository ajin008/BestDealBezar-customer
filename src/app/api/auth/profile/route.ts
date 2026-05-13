// ============================================================
// API ROUTE — /api/auth/profile
// POST → upsert profile row for authenticated user
// Uses service role key to bypass RLS
// ============================================================

import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, phone, avatar_url } = body;

    if (!id) {
      return Response.json({ error: "Missing user id" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { error } = await supabase.from("profiles").upsert(
      {
        id,
        name: name ?? null,
        email: email ?? null,
        phone: phone ?? null,
        avatar_url: avatar_url ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[auth/profile] upsert error:", error.message);
      return Response.json({ error: "Failed to sync profile" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[auth/profile] unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
