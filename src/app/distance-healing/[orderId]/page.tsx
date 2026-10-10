import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/session";
import { DELIVERY_BUCKET, DISTANCE_HEALING_SLUG, distanceHealingReference, ensureDistanceHealingCase } from "@/lib/distance-healing";
import DistanceHealingPortal from "@/components/healing/DistanceHealingPortal";

export const metadata = { title: "Distance Healing Portal", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DistanceHealingPortalPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const user = await requireUser(`/distance-healing/${orderId}`);
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("id,user_id,item_type,item_slug,payment_status").eq("id", orderId).eq("user_id", user.id).maybeSingle();
  if (!order || order.item_type !== "healing" || order.item_slug !== DISTANCE_HEALING_SLUG) notFound();
  if (order.payment_status !== "paid") redirect(`/account/orders/${order.id}`);
  const healingCase = await ensureDistanceHealingCase(order.id, user.id);
  const { data: feedback } = await admin.from("distance_healing_feedback").select("id").eq("case_id", healingCase.id).maybeSingle();
  const [result, music] = await Promise.all([
    healingCase.result_photo_path ? admin.storage.from(DELIVERY_BUCKET).createSignedUrl(healingCase.result_photo_path, 900, { download: true }) : null,
    healingCase.music_path ? admin.storage.from(DELIVERY_BUCKET).createSignedUrl(healingCase.music_path, 900) : null,
  ]);
  return <main className="min-h-[100dvh] bg-ivory px-5 pb-28 pt-28 sm:px-8 lg:pt-36"><div className="mx-auto max-w-3xl"><p className="eyebrow text-gold-deep">Private client portal</p><h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">Your Distance Healing journey</h1><p className="mt-4 max-w-2xl leading-7 text-warmgray">Submit your photograph, follow processing progress, receive your private photograph and healing music, and share feedback.</p><div className="mt-10"><DistanceHealingPortal orderId={order.id} reference={distanceHealingReference(order.id)} initialCase={healingCase} resultUrl={result?.data?.signedUrl ?? null} musicUrl={music?.data?.signedUrl ?? null} hasFeedback={Boolean(feedback)} /></div></div></main>;
}
