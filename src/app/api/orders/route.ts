import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import type { OrderItemType } from "@/lib/supabase/database.types";
import { isSameOriginRequest } from "@/lib/security";

/**
 * POST /api/orders — create a purchase/booking order for an authenticated
 * user OR a guest (when a valid contact email is supplied).
 */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let body: { type?: string; slug?: string; quantity?: number; address?: Record<string, unknown>; customerDetails?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase setup pending — AUTH_SETUP.md dekhein." },
      { status: 503 },
    );
  }

  // Guest checkout: a valid contact email may substitute for an account.
  const raw = body as unknown as Record<string, unknown>;
  const guestEmail =
    typeof raw.guestEmail === "string" && /.+@.+\..+/.test(raw.guestEmail.trim())
      ? raw.guestEmail.trim().slice(0, 320)
      : null;
  const guestName =
    typeof raw.guestName === "string" ? raw.guestName.trim().slice(0, 100) : null;
  if (!user && !guestEmail) {
    return NextResponse.json(
      { error: "Sign in or enter your email to continue." },
      { status: 401 },
    );
  }

  const type = body.type as OrderItemType;
  const slug = body.slug ?? "";

  if (!orderTypes.includes(type) || !slug) {
    return NextResponse.json({ error: "Unknown item" }, { status: 400 });
  }

  const item = await getCatalogItem(type, slug);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const admin = createAdminClient();
  let addressId: string | null = null;
  if (type === "product") {
    const addressBody = body.address && typeof body.address === "object" ? body.address : null;
    const savedAddressId = typeof addressBody?.savedAddressId === "string" ? addressBody.savedAddressId.trim() : "";
    if (savedAddressId && user) {
      const { data: saved } = await admin.from("addresses").select("id").eq("id", savedAddressId).eq("user_id", user.id).maybeSingle();
      if (!saved) return NextResponse.json({ error: "Selected address could not be verified." }, { status: 404 });
      addressId = saved.id;
    } else if (addressBody) {
      const pendingAddress = {
        recipient_name: typeof addressBody.recipient_name === "string" ? addressBody.recipient_name.trim().slice(0, 100) : "",
        phone: typeof addressBody.phone === "string" ? addressBody.phone.trim().slice(0, 20) : "",
        line1: typeof addressBody.line1 === "string" ? addressBody.line1.trim().slice(0, 200) : "",
        line2: typeof addressBody.line2 === "string" ? addressBody.line2.trim().slice(0, 200) : null,
        city: typeof addressBody.city === "string" ? addressBody.city.trim().slice(0, 80) : "",
        state: typeof addressBody.state === "string" ? addressBody.state.trim().slice(0, 80) : "",
        postal_code: typeof addressBody.postal_code === "string" ? addressBody.postal_code.trim().slice(0, 12) : "",
      };
      const validAddress = pendingAddress.recipient_name && pendingAddress.phone && pendingAddress.line1 && pendingAddress.city && pendingAddress.state && /^[1-9][0-9]{5}$/.test(pendingAddress.postal_code);
      if (!validAddress) return NextResponse.json({ error: "A complete delivery address is required." }, { status: 422 });
      const { data: createdAddress, error: addressError } = await admin.from("addresses").insert({ user_id: user?.id ?? null, ...pendingAddress }).select("id").single();
      if (addressError || !createdAddress) return NextResponse.json({ error: "Could not save the delivery address." }, { status: 500 });
      addressId = createdAddress.id;
    }
    if (!addressId) return NextResponse.json({ error: "A complete delivery address is required." }, { status: 422 });
  }
  const quantity = Number.isInteger(body.quantity) && Number(body.quantity) >= 1 && Number(body.quantity) <= 5 ? Number(body.quantity) : 1;
  const customerDetailsBody = body.customerDetails && typeof body.customerDetails === "object" ? body.customerDetails : null;
  const customerDetails = customerDetailsBody ? {
    phone: typeof customerDetailsBody.phone === "string" ? customerDetailsBody.phone.trim().slice(0, 20) : "",
    preferred_language: typeof customerDetailsBody.preferredLanguage === "string" ? customerDetailsBody.preferredLanguage.trim().slice(0, 40) : "",
    preferred_contact: typeof customerDetailsBody.preferredContact === "string" ? customerDetailsBody.preferredContact.trim().slice(0, 40) : "",
    experience_level: typeof customerDetailsBody.experienceLevel === "string" ? customerDetailsBody.experienceLevel.trim().slice(0, 80) : "",
    learning_goal: typeof customerDetailsBody.learningGoal === "string" ? customerDetailsBody.learningGoal.trim().slice(0, 1000) : "",
  } : null;
  if (type === "course" && (!customerDetails?.phone || customerDetails.learning_goal.length < 20)) {
    return NextResponse.json({ error: "Phone number and learning goals are required for course enrollment." }, { status: 422 });
  }
  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      guest_email: guestEmail,
      guest_name: guestName,
      item_type: type,
      item_slug: slug,
      item_title: item.title,
      amount: item.price == null ? null : item.price * quantity,
      currency: "INR",
      status: "pending",
      address_id: addressId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: itemError } = await admin.from("order_items").insert({
    order_id: order.id,
    item_type: type,
    item_slug: slug,
    title: item.title,
    quantity,
    unit_amount_subunits: item.price == null ? null : Math.round(item.price * 100),
    metadata: type === "course" && customerDetails ? customerDetails : {},
  });
  if (itemError) {
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Could not save the order details." }, { status: 500 });
  }

  return NextResponse.json({ order }, { status: 201 });
}
