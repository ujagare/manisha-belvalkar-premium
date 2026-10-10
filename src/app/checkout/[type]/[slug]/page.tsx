import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpenCheck, CalendarCheck, Check, Headphones, LockKeyhole, PackageCheck, Sparkles, Truck } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isPaymentsConfigured, isServerConfigured } from "@/lib/env";
import { getCurrentUser, getMyAddresses } from "@/lib/supabase/session";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import type { OrderItemType } from "@/lib/supabase/database.types";

interface Props {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const item = await getCatalogItem(type as OrderItemType, slug);
  // Sanitize: catalog titles can contain stray emoji/control chars from the
  // admin dashboard; keep the browser tab title clean for SEO.
  const clean = item?.title?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
  return {
    title: clean ? `Checkout — ${clean}` : "Checkout",
    robots: { index: false, follow: false },
  };
}

/**
 * Login-gated checkout. The proxy (middleware) already redirects
 * unauthenticated visitors to /login?next=… — this re-checks server-side
 * so the page is safe even when reached directly.
 */
export default async function CheckoutPage({ params }: Props) {
  const { type, slug } = await params;

  if (!orderTypes.includes(type as OrderItemType)) notFound();
  const item = await getCatalogItem(type as OrderItemType, slug);
  if (!item) notFound();

  // Guest checkout: an account is optional (contact email collected in the
  // form below). Re-check the session so signed-in users are prefilled.
  const user = await getCurrentUser();
  const isDistanceHealing = type === "healing" && slug === "distance-healing";
  if ((type === "course" || isDistanceHealing) && isServerConfigured() && !user) {
    redirect(`/login?next=${encodeURIComponent(`/checkout/${type}/${slug}`)}`);
  }
  const addresses = user && type === "product" ? await getMyAddresses() : [];

  const configured = isSupabaseConfigured();
  const isCourse = type === "course";
  const manualMode = !isServerConfigured() || (type === "product" && !user);
  const paymentUnavailable = isDistanceHealing && (!isPaymentsConfigured() || !item.price);
  const reassuranceItems = isCourse
    ? [
        { icon: CalendarCheck, title: "Personal onboarding", copy: "Schedule confirmed with you" },
        { icon: BookOpenCheck, title: "Guided learning", copy: "Program materials and support" },
        { icon: Headphones, title: "Human support", copy: "Direct updates from our team" },
      ]
    : [
        { icon: LockKeyhole, title: manualMode ? "Personal confirmation" : "Secure payment", copy: manualMode ? "Completed with the team on WhatsApp" : "Encrypted Razorpay checkout" },
        { icon: PackageCheck, title: "Careful packing", copy: "Prepared for safe dispatch" },
        { icon: Truck, title: "Order updates", copy: "Shared by email and phone" },
      ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3e9] pb-20 pt-28 lg:pb-28 lg:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_78%_10%,rgba(221,184,41,0.16),transparent_33%),radial-gradient(circle_at_10%_20%,rgba(180,20,20,0.08),transparent_28%)]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <Link
          href={item.href}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-warmgray transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {item.title}
        </Link>

        <div className="mt-7 flex items-center gap-3 text-xs font-medium text-warmgray">
          <span className="text-primary">{isCourse ? "Program" : "Bag"}</span><span className="h-px w-8 bg-gold/60" /><span className="font-semibold text-charcoal">{isCourse ? "Learner details" : "Details & payment"}</span><span className="h-px w-8 bg-parchment" /><span>Confirmation</span>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-16">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-deep">{manualMode ? "Personal confirmation" : "Secure checkout"}</p>
            <h1 className="mt-3 max-w-xl text-balance font-display text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-charcoal sm:text-5xl">{isCourse ? "Begin with a thoughtful introduction." : "Complete your order with confidence."}</h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-warmgray">{isCourse ? "Tell us a little about your goals so we can confirm the right format, schedule, and next steps for your learning journey." : manualMode ? "Review your selection, add delivery details, and send the prepared request on WhatsApp. No payment is taken on this website." : "Review your selection, add delivery details, and pay securely. Our team will confirm your order and delivery details after payment."}</p>

            <article className="mt-10 overflow-hidden rounded-[1.75rem] bg-[#201b18] text-white shadow-[0_28px_70px_-40px_rgba(62,38,25,0.65)]">
              <div className="grid sm:grid-cols-[13rem_1fr]">
                <div className="relative min-h-64 bg-[#342823] sm:min-h-[22rem]">
              {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover"
                  />
              ) : (
                  <div className="flex h-full min-h-64 items-center justify-center"><Sparkles className="h-10 w-10 text-gold" /></div>
              )}
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-8">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">Your selection</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{item.title}</h2>
                {item.subtitle ? (
                      <p className="mt-2 font-serif text-lg italic text-gold-light/85">{item.subtitle}</p>
                ) : null}
                    <p className="mt-5 line-clamp-4 text-sm leading-6 text-white/65">{item.description}</p>
                  </div>
                  <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5">
                    <span className="text-xs text-white/50">{item.price ? "Program fee, including taxes" : "Enrollment"}</span>
                    <span className="font-display text-2xl font-semibold text-gold-light">{item.priceLabel}</span>
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {reassuranceItems.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="border-l border-gold/40 pl-4"><Icon className="h-5 w-5 text-primary" /><h3 className="mt-3 text-sm font-semibold text-charcoal">{title}</h3><p className="mt-1 text-xs leading-5 text-warmgray">{copy}</p></div>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-3 rounded-2xl bg-white/65 p-5 text-sm leading-6 text-warmgray ring-1 ring-parchment/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" /><p>{isCourse ? "After you submit, our team reviews your goals and contacts you to confirm suitability, program fee, schedule, and onboarding." : "Need help before ordering? Contact us on WhatsApp. Our team can assist with product and delivery questions."}</p></div>

            {!configured ? (
              <div className="mt-8 rounded-2xl border border-gold/40 bg-gold-soft p-5 text-sm text-gold-deep">
                <strong>Setup pending:</strong> Supabase keys abhi placeholders hain.
                AUTH_SETUP.md mein steps follow karke .env.local update karein —
                tab order recording chalu hoga.
              </div>
            ) : null}
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_70px_-38px_rgba(62,38,25,0.45)] ring-1 ring-parchment sm:p-8">
                  {paymentUnavailable ? (
                    <div className="rounded-2xl border border-gold/40 bg-gold-soft/70 p-5 text-sm leading-6 text-gold-deep">
                      <strong>Payment setup required.</strong> Distance Healing accepts photographs only after a verified online payment. Configure Razorpay and set the active offering price in Supabase before opening bookings.
                    </div>
                  ) : <CheckoutForm
                    type={item.type}
                    slug={item.slug}
                    itemTitle={item.title}
                    price={item.price}
                    priceLabel={item.priceLabel}
                    userEmail={user?.email ?? ''}
                    userName={user?.fullName ?? null}
                    addresses={addresses}
                    manualMode={manualMode}
                    strictPayment={isDistanceHealing}
                  />}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
