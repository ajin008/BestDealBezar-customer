// ============================================================
// API ROUTE — /api/addresses
// GET  → fetch all addresses for logged-in user
// POST → create new address
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import { isValidKozhikodePincode } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();

    // Get user from auth header/cookie
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return Response.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("profile_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[addresses] GET error:", error.message);
      return Response.json(
        { data: null, error: "Failed to fetch addresses" },
        { status: 500 }
      );
    }

    return Response.json({ data, error: null });
  } catch (err) {
    console.error("[addresses] GET unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return Response.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      label,
      recipient_name,
      phone,
      address_line,
      city,
      pincode,
      is_default,
    } = body;

    // Validation
    if (!recipient_name || !phone || !address_line || !pincode) {
      return Response.json(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidKozhikodePincode(pincode)) {
      return Response.json(
        { data: null, error: "We only deliver within Kozhikode district" },
        { status: 400 }
      );
    }

    // If setting as default, unset all others first
    if (is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("profile_id", user.id);
    }

    // Check if this is the first address — make it default automatically
    const { count } = await supabase
      .from("addresses")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id);

    const shouldBeDefault = is_default || count === 0;

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        profile_id: user.id,
        label: label ?? "Home",
        recipient_name,
        phone,
        address_line,
        city: city ?? "Kozhikode",
        pincode,
        is_default: shouldBeDefault,
      })
      .select()
      .single();

    if (error) {
      console.error("[addresses] POST error:", error.message);
      return Response.json(
        { data: null, error: "Failed to save address" },
        { status: 500 }
      );
    }

    return Response.json({ data, error: null }, { status: 201 });
  } catch (err) {
    console.error("[addresses] POST unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
