// ============================================================
// API ROUTE — /api/products
// Supports filtering, search, and pagination via query params
//
// Query params:
//   ?category=groceries-staples  → filter by category slug
//   ?search=rice                 → search by name
//   ?featured=true               → featured products only
//   ?new_arrival=true            → new arrivals only
//   ?page=1&limit=20             → pagination
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { ProductWithImages } from "@/types/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("new_arrival");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      50,
      parseInt(searchParams.get("limit") ?? String(PRODUCTS_PER_PAGE))
    );
    const offset = (page - 1) * limit;

    const supabase = createServerClient();

    let query = supabase
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
      `,
        { count: "exact" }
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      // Join through categories table using slug
      query = query.eq("categories.slug", category);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (newArrival === "true") {
      query = query.eq("is_new_arrival", true);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[products] Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return Response.json({
      data: data as ProductWithImages[],
      error: null,
      pagination: {
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (err) {
    console.error("[products] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
