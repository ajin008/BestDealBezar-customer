// ============================================================
// API ROUTE — /api/payments/verify
// Verifies Razorpay payment signature after user pays
// Updates order and payment status in DB
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !order_id
    ) {
      return Response.json(
        { data: null, error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    // Verify signature — this is the security check
    // Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", env.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[payments/verify] Signature mismatch");
      return Response.json(
        { data: null, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Update payment record
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        razorpay_payment_id,
        razorpay_signature,
        collected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (paymentError) {
      console.error(
        "[payments/verify] Payment update error:",
        paymentError.message
      );
      return Response.json(
        { data: null, error: "Failed to update payment" },
        { status: 500 }
      );
    }

    // Update order status
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    if (orderError) {
      console.error(
        "[payments/verify] Order update error:",
        orderError.message
      );
      return Response.json(
        { data: null, error: "Failed to update order status" },
        { status: 500 }
      );
    }

    return Response.json({
      data: { verified: true, order_id },
      error: null,
    });
  } catch (err) {
    console.error("[payments/verify] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
