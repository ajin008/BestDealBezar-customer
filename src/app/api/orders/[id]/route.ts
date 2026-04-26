// ============================================================
// API ROUTE — /api/orders/[id]
// GET   → fetch single order
// PATCH → cancel order (customer can only cancel pending orders)
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
      if (error.code === "PGRST116" || error.code === "22P02") {
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action !== "cancel") {
      return Response.json(
        { data: null, error: "Invalid action" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Step 1: Fetch order status only first
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !order) {
      console.error(
        "[PATCH] fetch error:",
        fetchError?.message,
        fetchError?.code
      );
      return Response.json(
        { data: null, error: "Order not found" },
        { status: 404 }
      );
    }

    console.log("[PATCH] order found:", order.id, "status:", order.status);

    if (order.status !== "pending") {
      return Response.json(
        { data: null, error: `Cannot cancel a ${order.status} order.` },
        { status: 400 }
      );
    }

    // Step 2: Fetch order items separately
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("id, product_id, quantity")
      .eq("order_id", id);

    if (itemsError) {
      console.error("[PATCH] fetch items error:", itemsError.message);
    }

    console.log("[PATCH] order items:", orderItems?.length ?? 0);

    // Step 3: Update status
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error(
        "[PATCH] update error:",
        updateError?.message,
        updateError?.code,
        updateError?.details,
        updateError?.hint
      );
      return Response.json(
        { data: null, error: "Failed to cancel order" },
        { status: 500 }
      );
    }

    console.log("[PATCH] order cancelled successfully");

    // Step 4: Restore stock
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const { error: stockError } = await supabase.rpc("increment_stock", {
          product_id: item.product_id,
          qty: item.quantity,
        });

        if (stockError) {
          console.error(
            `[PATCH] stock restore failed for ${item.product_id}:`,
            stockError.message
          );
        }
      }
    }

    return Response.json({ data: updatedOrder, error: null });
  } catch (err) {
    console.error("[PATCH] unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
