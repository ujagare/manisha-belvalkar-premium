import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarCheck,
  Check,
  Headphones,
  LockKeyhole,
  PackageCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isPaymentsConfigured, isServerConfigured } from "@/lib/env";
import { getCurrentUser, getMyAddresses } from "@/lib/supabase/session";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import { usdExchangeRate } from "@/lib/currency";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import type { OrderItemType } from "@/lib/supabase/database.types";
import { shouldUseManualFlow } from "@/lib/manual-flow";

interface Props {
  params: Promise<{ type: string; slug: string }>;
  searchParams?: Promise<{ slotId?: string; format?: string; notes?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const item = await getCatalogItem(type as OrderItemType, slug);
  const clean = item?.title?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
  return {
    title: clean ? `Checkout — ${clean}` : "Checkout",
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { type, slug } = await params;

  if (!orderTypes.includes(type as OrderItemType)) notFound();
  const item = await getCatalogItem(type as OrderItemType, slug);
  if (!item) notFound();

  const user = await getCurrentUser();
  const query = await searchParams;
  const isDistanceHealing = type === "healing" && slug === "distance-healing";
  if (isPaymentsConfigured() && !user) {
    const preserved = new URLSearchParams();
    if (query?.slotId) preserved.set("slotId", query.slotId);
    if (query?.format) preserved.set("format", query.format);
    if (query?.notes) preserved.set("notes", query.notes);
    const qs = preserved.toString();
    const returnPath = `/checkout/${type}/${slug}${qs ? `?${qs}` : ""}`;
    redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  }
  const addresses = user && type === "product" ? await getMyAddresses() : [];

  const configured = isSupabaseConfigured();
  const isCourse = type === "course";
  const isSession = ["service", "healing", "mentoring"].includes(type);
  const paymentsConfigured = isPaymentsConfigured();
  const manualMode = shouldUseManualFlow(isServerConfigured(), paymentsConfigured);
  const initialSession = !isDistanceHealing && query?.slotId && query?.format
    ? { slotId: query.slotId, format: query.format, notes: query.notes ?? "" }
    : undefined;

  const reassuranceItems = isCourse
    ? [
        { icon: CalendarCheck, title: "Personal onboarding", copy: "Schedule confirmed directly" },
        { icon: BookOpenCheck, title: "Guided learning", copy: "Materials & support" },
        { icon: Headphones, title: "Direct support", copy: "Pune & Mumbai team" },
      ]
    : isDistanceHealing
      ? [
          {
            icon: LockKeyhole,
            title: manualMode ? "Personal review" : "Verified payment",
            copy: manualMode ? "WhatsApp confirmation" : "Razorpay INR / USD",
          },
          { icon: Sparkles, title: "Instant portal", copy: "Upload photo after capture" },
          { icon: Headphones, title: "Private delivery", copy: "Photo & music in account" },
        ]
      : isSession
        ? [
            {
              icon: LockKeyhole,
              title: manualMode ? "Personal review" : "Verified payment",
              copy: manualMode ? "WhatsApp confirmation" : "Razorpay INR / USD",
            },
            { icon: CalendarCheck, title: "Private room", copy: "1:1 Daily.co video" },
            { icon: Headphones, title: "Reminders", copy: ".ics invite & emails" },
          ]
        : [
            {
              icon: LockKeyhole,
              title: manualMode ? "Personal review" : "Verified payment",
              copy: manualMode ? "WhatsApp confirmation" : "Encrypted Razorpay",
            },
            { icon: PackageCheck, title: "Safe packing", copy: "Sealed for transit" },
            { icon: Truck, title: "Live tracking", copy: "Shiprocket AWB" },
          ];

  const stepLabels = [
    isCourse ? "Program" : isDistanceHealing ? "Distance healing" : isSession ? "Session" : "Selection",
    isCourse ? "Learner details" : isDistanceHealing ? "Payment" : isSession ? "Time & payment" : "Delivery & payment",
    isDistanceHealing ? "Photo portal" : "Confirmation",
  ];

  return (
    <div className="min-h-[100dvh] bg-ivory pb-20 pt-20 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <Link
          href={item.href}
          className="inline-flex h-9 items-center gap-2 text-xs text-warmgray transition-colors duration-150 hover:text-charcoal sm:h-10 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to {item.title}
        </Link>

        {/* Signature vermilion-ink progress rail */}
        <ol className="mt-3 flex flex-wrap items-center gap-2 text-xs text-warmgray sm:mt-5 sm:gap-3 sm:text-sm">
          <li className="font-medium text-charcoal">{stepLabels[0]}</li>
          <li aria-hidden="true" className="h-px w-5 bg-primary sm:w-8" />
          <li className="font-medium text-primary">{stepLabels[1]}</li>
          <li aria-hidden="true" className="h-px w-5 bg-charcoal/15 sm:w-8" />
          <li>{stepLabels[2]}</li>
        </ol>

        <div className="mt-5 grid items-start gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-12">
          <section>
            <p className="text-xs text-warmgray sm:text-sm">
              {manualMode ? "Personal confirmation" : "Checkout"}
            </p>
            <h1 className="mt-1.5 max-w-xl font-display text-[1.65rem] font-medium leading-[1.12] tracking-[-0.02em] text-charcoal sm:mt-2 sm:text-4xl">
              {isCourse
                ? "Share your goals to begin onboarding"
                : isDistanceHealing
                  ? "Complete payment to open your healing portal"
                  : isSession
                    ? "Choose your session time and confirm"
                    : "Review your order and delivery details"}
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-6 text-warmgray sm:mt-4 sm:text-base sm:leading-7">
              {isCourse
                ? "Tell us about your background and goals so we can confirm the right format, schedule, and onboarding steps."
                : isDistanceHealing
                  ? manualMode
                    ? "Send a Distance Healing request on WhatsApp; no online payment is taken on this website."
                    : "Pay securely in INR or International USD via Razorpay. Your private photograph portal unlocks immediately upon capture."
                  : isSession
                    ? manualMode
                      ? "Send a session request on WhatsApp; no online payment is taken on this website."
                      : "Select a live available slot and complete payment. Your booking and private Daily.co room confirm immediately upon capture."
                    : manualMode
                      ? "Review your selection, add delivery details, and send the prepared request on WhatsApp. No payment is taken online."
                      : "Review your selection, confirm your delivery PIN code, and pay securely. Live Shiprocket tracking follows dispatch."}
            </p>

            {/* Compact horizontal product summary on mobile (Shopify/Stripe standard), editorial card on desktop */}
            <article className="mt-5 overflow-hidden rounded-xl border border-charcoal/10 bg-[#fdfbf7] shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:mt-8 sm:rounded-2xl">
              <div className="grid grid-cols-[6rem_1fr] sm:grid-cols-[13rem_1fr]">
                <div className="relative min-h-28 bg-charcoal/5 sm:min-h-72">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={`${item.title} product`}
                      fill
                      sizes="(max-width: 640px) 96px, 208px"
                      className="object-cover"
                    loading="lazy" />
                  ) : (
                    <div className="flex h-full min-h-28 items-center justify-center sm:min-h-56">
                      <Sparkles className="h-5 w-5 text-warmgray sm:h-6 sm:w-6" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between p-3.5 sm:p-6">
                  <div>
                    <p className="hidden text-xs text-warmgray sm:block">Selected item</p>
                    <h2 className="font-display text-base font-medium leading-snug text-charcoal sm:mt-1.5 sm:text-2xl">
                      {item.title}
                    </h2>
                    {item.subtitle ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-warmgray sm:mt-1 sm:line-clamp-none sm:text-sm">
                        {item.subtitle}
                      </p>
                    ) : null}
                    <p className="mt-4 hidden line-clamp-3 text-sm leading-6 text-warmgray sm:block">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t border-charcoal/10 pt-2.5 sm:mt-6 sm:pt-4">
                    <span className="text-[11px] text-warmgray sm:text-xs">
                      {item.price ? "Incl. taxes" : "Enrollment"}
                    </span>
                    <span className="font-mono text-base font-medium tabular-nums text-charcoal sm:text-xl">
                      {item.priceLabel}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Compact 3-col assurance row on both mobile & desktop */}
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-charcoal/10 pt-4 sm:mt-8 sm:gap-6 sm:pt-6">
              {reassuranceItems.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="space-y-1 sm:space-y-2">
                  <Icon className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                  <h3 className="text-xs font-medium text-charcoal sm:text-sm">{title}</h3>
                  <p className="text-[11px] leading-4 text-warmgray sm:text-xs sm:leading-5">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 hidden items-start gap-3 rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 text-sm leading-6 text-warmgray sm:mt-8 sm:flex">
              <Check className="mt-1 h-4 w-4 shrink-0 text-warmgray" strokeWidth={1.5} />
              <p>
                {isCourse
                  ? "After submission, our team reviews your goals and contacts you to confirm suitability, fee, and schedule."
                  : isSession
                    ? "Need help choosing a slot? Message our team on WhatsApp before completing payment."
                    : "Questions about packaging or delivery? Contact our team on WhatsApp before ordering."}
              </p>
            </div>

            {!configured ? (
              <div className="mt-5 rounded-xl border border-charcoal/12 bg-white p-4 text-xs text-warmgray sm:mt-6 sm:text-sm">
                Supabase setup is pending. Update <code className="font-mono text-charcoal">.env.local</code> using AUTH_SETUP.md to enable live order recording.
              </div>
            ) : null}
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-xl border border-charcoal/10 bg-white p-4 shadow-[0_8px_24px_rgba(28,25,23,0.06)] sm:rounded-2xl sm:p-6">
              <CheckoutForm
                type={item.type}
                slug={item.slug}
                itemTitle={item.title}
                price={item.price}
                priceLabel={item.priceLabel}
                userEmail={user?.email ?? ""}
                userName={user?.fullName ?? null}
                addresses={addresses}
                manualMode={manualMode}
                strictPayment={isDistanceHealing && paymentsConfigured}
                initialSession={initialSession}
                usdRate={usdExchangeRate()}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
