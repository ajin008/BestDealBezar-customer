// ============================================================
// API ROUTE — /api/products/[slug]
// Returns a single product by slug with all images
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/types/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return Response.json(
        { data: null, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images (
          id,
          url,
          sort_order
        ),
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      // PGRST116 = no rows found
      if (error.code === "PGRST116") {
        return Response.json(
          { data: null, error: "Product not found" },
          { status: 404 }
        );
      }
      console.error("[products/slug] Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch product" },
        { status: 500 }
      );
    }

    // Sort images by sort_order
    if (data.product_images) {
      data.product_images.sort(
        (a: { sort_order: number }, b: { sort_order: number }) =>
          a.sort_order - b.sort_order
      );
    }

    return Response.json({ data: data as ProductWithImages, error: null });
  } catch (err) {
    console.error("[products/slug] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
