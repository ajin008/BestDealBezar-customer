// ============================================================
// API ROUTE — /api/coupons/validate
// POST → validates a coupon code against cart subtotal
// Returns discount amount if valid, error message if not
// ============================================================

import { createServerClient } from "@/lib/supabase/server";

interface ValidateBody {
  code: string;
  subtotal: number;
}

export async function POST(request: Request) {
  try {
    const body: ValidateBody = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof subtotal !== "number") {
      return Response.json(
        { data: null, error: "Coupon code and subtotal are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return Response.json(
        { data: null, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return Response.json(
        { data: null, error: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return Response.json(
        { data: null, error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (subtotal < coupon.min_order_amount) {
      return Response.json(
        {
          data: null,
          error: `Minimum order amount of ₹${coupon.min_order_amount} required`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    const discountAmount =
      coupon.discount_type === "flat"
        ? coupon.discount_value
        : Math.round((subtotal * coupon.discount_value) / 100);

    return Response.json({
      data: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount,
      },
      error: null,
    });
  } catch (err) {
    console.error("[coupons/validate] Unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
