// ============================================================
// API ROUTE — /api/products
// Supports filtering, search, sort and pagination via query params
//
// Query params:
//   ?category=groceries-staples  → filter by category slug
//   ?search=rice                 → search by name
//   ?featured=true               → featured products only
//   ?new_arrival=true            → new arrivals only
//   ?sort=price_asc|price_desc|newest → sort order
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
    const sort = searchParams.get("sort");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      50,
      parseInt(searchParams.get("limit") ?? String(PRODUCTS_PER_PAGE))
    );
    const offset = (page - 1) * limit;

    const supabase = createServerClient();

    // ── Step 1: resolve category slug → category_id ──────────
    // We can't filter joined tables directly in Supabase
    // So fetch category_id first, then filter products by it
    let categoryId: string | null = null;

    if (category) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .eq("is_active", true)
        .single();

      if (!categoryData) {
        // Category not found — return empty
        return Response.json({
          data: [],
          error: null,
          pagination: { total: 0, page, limit, totalPages: 0 },
        });
      }

      categoryId = categoryData.id;
    }

    // ── Step 2: build product query ───────────────────────────
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
      .range(offset, offset + limit - 1);

    // ── Step 3: apply filters ─────────────────────────────────
    if (categoryId) {
      query = query.eq("category_id", categoryId);
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

    // ── Step 4: apply sort ────────────────────────────────────
    if (sort === "price_asc") {
      query = query.order("selling_price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("selling_price", { ascending: false });
    } else {
      // Default — newest first
      query = query.order("created_at", { ascending: false });
    }

    // ── Step 5: execute ───────────────────────────────────────
    const { data, error, count } = await query;

    if (error) {
      console.error("[products] Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Sort product_images by sort_order
    const products = (data as ProductWithImages[]).map((p) => ({
      ...p,
      product_images:
        p.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [],
    }));

    return Response.json({
      data: products,
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
