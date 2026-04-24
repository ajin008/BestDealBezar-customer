// ============================================================
// API ROUTE — /api/addresses/[id]
// PATCH  → update address
// DELETE → remove address
// ============================================================

import { createServerClient } from "@/lib/supabase/server";
import { isValidKozhikodePincode } from "@/lib/constants";

async function getAuthUser(request: Request) {
  const supabase = createServerClient();
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { user: null, supabase };
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  return { user, supabase };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, supabase } = await getAuthUser(request);

    if (!user) {
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

    if (pincode && !isValidKozhikodePincode(pincode)) {
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

    const { data, error } = await supabase
      .from("addresses")
      .update({
        ...(label && { label }),
        ...(recipient_name && { recipient_name }),
        ...(phone && { phone }),
        ...(address_line && { address_line }),
        ...(city && { city }),
        ...(pincode && { pincode }),
        ...(is_default !== undefined && { is_default }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("profile_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("[addresses/id] PATCH error:", error.message);
      return Response.json(
        { data: null, error: "Failed to update address" },
        { status: 500 }
      );
    }

    return Response.json({ data, error: null });
  } catch (err) {
    console.error("[addresses/id] PATCH unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, supabase } = await getAuthUser(request);

    if (!user) {
      return Response.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("profile_id", user.id);

    if (error) {
      console.error("[addresses/id] DELETE error:", error.message);
      return Response.json(
        { data: null, error: "Failed to delete address" },
        { status: 500 }
      );
    }

    return Response.json({ data: { deleted: true }, error: null });
  } catch (err) {
    console.error("[addresses/id] DELETE unexpected error:", err);
    return Response.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
