import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireUser } from "@/lib/supabase/session";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import type { OrderItemType } from "@/lib/supabase/database.types";

interface Props {
  params: Promise<{ type: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const item = await getCatalogItem(type as OrderItemType, slug);
  return {
    title: item ? `Checkout — ${item.title}` : "Checkout",
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

  // Server-side auth check (proxy also guards, but never trust only one).
  const user = await requireUser(`/checkout/${type}/${slug}`);

  const configured = isSupabaseConfigured();

  return (
    <section className="relative overflow-hidden bg-ivory pb-20 pt-32 lg:pt-40">
      <div className="glow-gold absolute -right-32 -top-32 h-[400px] w-[400px]" />
      <div className="glow-crimson absolute -bottom-32 -left-32 h-[380px] w-[380px]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <Link
          href={item.href}
          className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {item.title}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Item summary */}
          <div className="lg:col-span-3">
            <div className="flex items-start gap-6">
              {item.image ? (
                <div className="gold-border-gradient relative h-36 w-28 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-28 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <div className="eyebrow mb-2 text-gold-dark">{type}</div>
                <h1 className="font-display text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
                  {item.title}
                </h1>
                {item.subtitle ? (
                  <p className="mt-1 font-serif text-lg italic text-gold-dark">{item.subtitle}</p>
                ) : null}
                <div className="mt-4 flex items-center gap-2 text-sm text-warmgray">
                  <Clock className="h-4 w-4 text-gold" />
                  {item.priceLabel}
                </div>
              </div>
            </div>

            <p className="mt-8 leading-relaxed text-warmgray">{item.description}</p>

            {!configured ? (
              <div className="mt-8 rounded-2xl border border-gold/40 bg-gold-soft p-5 text-sm text-gold-deep">
                <strong>Setup pending:</strong> Supabase keys abhi placeholders hain.
                AUTH_SETUP.md mein steps follow karke .env.local update karein —
                tab order recording chalu hoga.
              </div>
            ) : null}
          </div>

          {/* Checkout card */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
              <div className="relative">
                <h2 className="font-display text-xl font-bold text-charcoal">Confirm booking</h2>
                <p className="mt-2 text-sm leading-relaxed text-warmgray">
                  Create an order for this {type}. Manisha&apos;s team confirms
                  scheduling &amp; payment on WhatsApp.
                </p>
                <div className="mt-7">
                  <CheckoutForm
                    type={item.type}
                    slug={item.slug}
                    itemTitle={item.title}
                    priceLabel={item.priceLabel}
                    userEmail={user.email ?? ""}
                    userName={user.fullName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
