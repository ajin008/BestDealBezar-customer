// ============================================================
// API ROUTE — /api/payments/create
// Creates a Razorpay order and stores it in payments table
// Called right before checkout redirect to Razorpay
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return Response.json(
        { data: null, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch order to get total amount
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, total_amount, payment_method, payment_status")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return Response.json(
        { data: null, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.payment_method !== "razorpay") {
      return Response.json(
        { data: null, error: "Order is not a Razorpay order" },
        { status: 400 }
      );
    }

    if (order.payment_status === "paid") {
      return Response.json(
        { data: null, error: "Order already paid" },
        { status: 400 }
      );
    }

    // Create Razorpay order via their API
    const razorpayAuth = Buffer.from(
      `${env.razorpay.keyId}:${env.razorpay.keySecret}`
    ).toString("base64");

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${razorpayAuth}`,
      },
      body: JSON.stringify({
        // Razorpay expects amount in paise (multiply by 100)
        amount: Math.round(order.total_amount * 100),
        currency: "INR",
        receipt: order.order_number,
      }),
    });

    if (!razorpayResponse.ok) {
      const rzError = await razorpayResponse.json();
      console.error("[payments/create] Razorpay error:", rzError);
      return Response.json(
        { data: null, error: "Failed to create payment" },
        { status: 500 }
      );
    }

    const razorpayOrder = await razorpayResponse.json();

    // Store payment record in DB
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        order_id: order.id,
        method: "razorpay",
        status: "pending",
        amount: order.total_amount,
        razorpay_order_id: razorpayOrder.id,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("[payments/create] DB error:", paymentError.message);
      return Response.json(
        { data: null, error: "Failed to store payment record" },
        { status: 500 }
      );
    }

    return Response.json({
      data: {
        payment_id: payment.id,
        razorpay_order_id: razorpayOrder.id,
        amount: order.total_amount,
        currency: "INR",
        order_number: order.order_number,
        // Key ID is public — safe to send to client
        key_id: env.razorpay.keyId,
      },
      error: null,
    });
  } catch (err) {
    console.error("[payments/create] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
