import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ArrowUpRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Gift,
  Sparkles,
  Package,
  Wand2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { getProducts, getProductBySlug } from "@/lib/supabase/products";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";
import ProductCard, { categoryMeta } from "@/components/products/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.title} — Sacred Products`,
    description: product.description,
  };
}

const assurance = [
  { icon: Truck, text: "Careful, insured dispatch across India" },
  { icon: ShieldCheck, text: "Authentic, personally blessed pieces" },
  { icon: Gift, text: "Sacred gift-worthy packaging included" },
  { icon: Sparkles, text: "Infused with intention & healing energy" },
];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const meta = categoryMeta(product.category);
  const discount =
    product.salePrice && product.salePrice > product.price
      ? Math.round(((product.salePrice - product.price) / product.salePrice) * 100)
      : 0;

  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(all.filter((p) => p.slug !== product.slug && p.category !== product.category))
    .slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ivory pb-16 pt-32 lg:pb-24 lg:pt-40">
        <div className="glow-gold absolute -right-32 -top-32 h-[420px] w-[420px]" />
        <div className="glow-crimson absolute -bottom-32 -left-32 h-[380px] w-[380px]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              All products
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-14 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal direction="right">
                <div className="gold-border-gradient relative overflow-hidden rounded-3xl">
                  <div
                    className="h-[380px] w-full bg-cover bg-center sm:h-[500px]"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 to-transparent" />
                  {product.badge ? (
                    <span className="absolute left-6 top-6 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                      {product.badge}
                    </span>
                  ) : null}
                  {discount > 0 ? (
                    <span className="absolute right-6 top-6 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-deeper shadow-lg">
                      Save {discount}%
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {assurance.map((item) => (
                    <div
                      key={item.text}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-parchment bg-white px-3 py-4 text-center"
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <span className="text-[11px] font-medium leading-tight text-warmgray">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Info */}
            <div>
              <Reveal>
                <div className="eyebrow mb-4 flex items-center gap-4 text-gold-dark">
                  <span className="hairline-gold w-10" />
                  <span className="inline-flex items-center gap-1.5 uppercase">
                    <meta.icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                </div>
                <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
                  {product.title}
                </h1>
                <p className="mt-3 font-serif text-xl italic text-gold-dark">
                  {product.subtitle}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-7 text-lg leading-relaxed text-warmgray">
                  {product.description}
                </p>
              </Reveal>

              {/* Price */}
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/25 bg-gold-soft/50 px-6 py-5">
                  <span className="font-display text-5xl font-bold text-primary">
                    {formatINR(product.price)}
                  </span>
                  {product.salePrice ? (
                    <>
                      <span className="text-xl text-warmgray line-through">
                        {formatINR(product.salePrice)}
                      </span>
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                        {discount}% OFF
                      </span>
                    </>
                  ) : null}
                  <span className="ml-auto hidden text-sm text-warmgray sm:block">
                    Inclusive of all taxes
                  </span>
                </div>
              </Reveal>

              {/* CTAs */}
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    href={`/checkout/product/${product.slug}`}
                    size="lg"
                    variant="gold"
                  >
                    <Package className="h-4 w-4" />
                    Buy Now — Secure Order
                  </Button>
                  <Button href="/contact" size="lg" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    Ask a question
                  </Button>
                </div>
                <p className="mt-3 text-xs text-warmgray">
                  Sign in required at checkout · WhatsApp confirmation after order
                </p>
              </Reveal>

              {/* Details */}
              <Reveal delay={0.25}>
                <div className="mt-10">
                  <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-charcoal">
                    <Wand2 className="h-5 w-5 text-gold-dark" />
                    What&apos;s inside
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {product.details.map((detail, i) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-[15px] leading-relaxed text-ink">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 ? (
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="eyebrow mb-3 flex items-center gap-4 text-gold-dark">
                  <span className="hairline-gold w-10" />
                  Complete your practice
                </div>
                <h2 className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
                  You may also{" "}
                  <span className="text-crimson-gradient">love</span>
                </h2>
              </div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                View all products
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <GoldDivider />

      <CTASection />
    </>
  );
}
