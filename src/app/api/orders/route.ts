// ============================================================
// API ROUTE — /api/orders
// GET  → fetch orders by phone number (customer's order history)
// POST → create a new order
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import type { Order, OrderWithItems } from "@/types/database";

// GET /api/orders?phone=9876543210
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return Response.json(
        { data: null, error: "Phone number is required" },
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
      .eq("customer_phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[orders] GET Supabase error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return Response.json({ data: data as OrderWithItems[], error: null });
  } catch (err) {
    console.error("[orders] GET unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_city,
      delivery_pincode,
      payment_method,
      items,
      coupon_code,
      notes,
    } = body;

    // Basic validation
    if (
      !customer_name ||
      !customer_phone ||
      !delivery_address ||
      !delivery_city ||
      !delivery_pincode ||
      !payment_method ||
      !items?.length
    ) {
      return Response.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch fresh product prices from DB — never trust client-sent prices
    const productIds = items.map((i: { product_id: string }) => i.product_id);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, selling_price, stock_quantity, is_active")
      .in("id", productIds);

    if (productsError || !products) {
      console.error(
        "[orders] POST fetch products error:",
        productsError?.message
      );
      return Response.json(
        { data: null, error: "Failed to validate products" },
        { status: 500 }
      );
    }

    // Validate each item and calculate totals using DB prices
    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productMap.get(item.product_id);

      if (!product || !product.is_active) {
        return Response.json(
          { data: null, error: `Product not available: ${item.product_id}` },
          { status: 400 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return Response.json(
          { data: null, error: `Insufficient stock for: ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.selling_price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image_url: item.product_image_url ?? null,
        quantity: item.quantity,
        unit_price: product.selling_price,
        total_price: itemTotal,
      });
    }

    // Fetch store settings for delivery charge
    const { data: settings } = await supabase
      .from("store_settings")
      .select("flat_delivery_charge, free_delivery_above")
      .single();

    const deliveryFee =
      settings && subtotal >= settings.free_delivery_above
        ? 0
        : settings?.flat_delivery_charge ?? 60;

    // Apply coupon if provided
    let discountAmount = 0;
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", coupon_code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (coupon) {
        const notExpired =
          !coupon.expires_at || new Date(coupon.expires_at) > new Date();
        const notExhausted =
          !coupon.max_uses || coupon.used_count < coupon.max_uses;
        const meetsMinimum = subtotal >= coupon.min_order_amount;

        if (notExpired && notExhausted && meetsMinimum) {
          discountAmount =
            coupon.discount_type === "flat"
              ? coupon.discount_value
              : Math.round((subtotal * coupon.discount_value) / 100);
        }
      }
    }

    const totalAmount = subtotal + deliveryFee - discountAmount;

    // Generate order number: BDB-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BDB-${dateStr}-${randomSuffix}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_email: customer_email ?? null,
        customer_phone,
        delivery_address,
        delivery_city,
        delivery_pincode,
        status: "pending",
        payment_method,
        payment_status: "pending",
        subtotal,
        discount_amount: discountAmount,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        coupon_code: coupon_code ?? null,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[orders] POST create order error:", orderError?.message);
      return Response.json(
        { data: null, error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Insert order items
    const { error: itemsError } = await supabase.from("order_items").insert(
      validatedItems.map((item) => ({
        ...item,
        order_id: order.id,
      }))
    );

    if (itemsError) {
      console.error("[orders] POST insert items error:", itemsError.message);
      // Order created but items failed — log for manual recovery
      return Response.json(
        { data: null, error: "Failed to save order items" },
        { status: 500 }
      );
    }

    return Response.json(
      { data: order as Order, error: null },
      { status: 201 }
    );
  } catch (err) {
    console.error("[orders] POST unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
