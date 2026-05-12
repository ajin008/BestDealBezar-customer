import { createServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature using RAZORPAY_WEBHOOK_SECRET
    const expectedSignature = crypto
      .createHmac("sha256", env.razorpay.webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[webhook/razorpay] Signature mismatch");
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;

    console.log(`[webhook/razorpay] Event received: ${eventType}`);

    const supabase = createServerClient();

    if (eventType === "payment.authorized" || eventType === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const razorpay_order_id: string = payment?.order_id;
      const razorpay_payment_id: string = payment?.id;

      if (!razorpay_order_id) {
        return Response.json({ error: "Missing order_id in payload" }, { status: 400 });
      }

      // Check if already paid (idempotency — avoid double-processing)
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("status, order_id")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (existingPayment?.status === "paid") {
        console.log(`[webhook/razorpay] Already paid, skipping: ${razorpay_order_id}`);
        return Response.json({ received: true });
      }

      // Update payment record
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          status: "paid",
          razorpay_payment_id,
          collected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (paymentError) {
        console.error("[webhook/razorpay] Payment update error:", paymentError.message);
        return Response.json({ error: "Failed to update payment" }, { status: 500 });
      }

      // Update order status
      const orderId = existingPayment?.order_id;
      if (orderId) {
        const { error: orderError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (orderError) {
          console.error("[webhook/razorpay] Order update error:", orderError.message);
        }
      }

      console.log(`[webhook/razorpay] Order confirmed via webhook: ${razorpay_order_id}`);
    }

    if (eventType === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      const razorpay_order_id: string = payment?.order_id;

      if (razorpay_order_id) {
        await supabase
          .from("payments")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpay_order_id);

        console.log(`[webhook/razorpay] Payment failed: ${razorpay_order_id}`);
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("[webhook/razorpay] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
