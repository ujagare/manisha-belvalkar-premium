import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import type { OrderItemType } from "@/lib/supabase/database.types";

/**
 * POST /api/orders — create a purchase/booking order.
 * Requires an authenticated session (proxy + this check).
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase setup pending — AUTH_SETUP.md dekhein." },
      { status: 503 },
    );
  }

  let body: { type?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
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

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      item_type: type,
      item_slug: slug,
      item_title: item.title,
      amount: item.price,
      currency: "INR",
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order }, { status: 201 });
}
