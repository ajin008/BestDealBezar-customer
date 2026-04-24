// ============================================================
// API ROUTE — /api/banners
// Returns active banner images from Supabase storage
// ============================================================

import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase.storage.from("banners").list("", {
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.error("[banners] Storage error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch banners" },
        { status: 500 }
      );
    }

    // Build public URLs for each image
    const banners = data
      .filter((file) => !file.name.startsWith("."))
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from("banners")
          .getPublicUrl(file.name);
        return {
          name: file.name,
          url: urlData.publicUrl,
        };
      });

    return Response.json({ data: banners, error: null });
  } catch (err) {
    console.error("[banners] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
