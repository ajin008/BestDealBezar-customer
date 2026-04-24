// ============================================================
// API ROUTE — /api/orders/[id]
// GET → fetch single order by ID with items
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import type { OrderWithItems } from "@/types/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { data: null, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_image_url,
          quantity,
          unit_price,
          total_price
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return Response.json(
          { data: null, error: "Order not found" },
          { status: 404 }
        );
      }
      // Invalid UUID format also returns 404
      if (error.code === "22P02") {
        return Response.json(
          { data: null, error: "Order not found" },
          { status: 404 }
        );
      }
      console.error("[orders/id] Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch order" },
        { status: 500 }
      );
    }

    return Response.json({ data: data as OrderWithItems, error: null });
  } catch (err) {
    console.error("[orders/id] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
