import type { Metadata } from "next";
import {
  Sparkles,
  Gift,
  Truck,
  ShieldCheck,
  Quote,
  ArrowUpRight,
} from "lucide-react";
import type { Product } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { getProducts } from "@/lib/supabase/products";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import ProductCard, { categoryMeta } from "@/components/products/ProductCard";
import RitualCard from "@/components/products/RitualCard";

export const metadata: Metadata = {
  title: "Shakti Oracle Deck, Rituals & Sacred Products",
  description:
    "Buy the Shakti Oracle deck, guidebook, magic salt, vastu healing frames, abundance rituals and WhatsApp workshops by Dr. Manisha Belvalkar. Ships across India.",
  alternates: { canonical: "/products" },
};

const trustPoints = [
  {
    icon: Sparkles,
    title: "Created with intention",
    text: "Every product is infused with prayer, ritual and healing energy.",
  },
  {
    icon: Gift,
    title: "Gift-worthy packaging",
    text: "Sacred wrapping, love notes and protective care in every parcel.",
  },
  {
    icon: Truck,
    title: "Ships across India",
    text: "Careful, insured dispatch — your treasure arrives safe and blessed.",
  },
  {
    icon: ShieldCheck,
    title: "Authentic & blessed",
    text: "Each piece is personally handled by Manisha before it leaves.",
  },
];

export default async function ProductsPage() {
  // DB-backed catalog (falls back to static catalog until Supabase is configured)
  const products = await getProducts();
  const featured = products.find((p) => p.featured) ?? products[0];

  // 1. Deck & Book (2 cards)
  const deckBookSlugs = ["shakti-oracle-deck", "shakti-deck-guidebook"];
  const deckAndBookProducts = deckBookSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  // 2. Shop (Magic Salt, Vastu healing Frames) (2 cards)
  const shopSlugs = ["sacred-salt-frame", "vastu-healing-frames"];
  const shopProductsList = shopSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  // 3. Rituals and readings
  const ritualSlugs = [
    "abundance-rituals",
    "good-luck-rituals",
    "good-health-rituals",
    "protection-rituals",
    "tarot-reading",
  ];
  const ritualProductsList = ritualSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <>
      <PageHero
        eyebrow="Products"
        image="/images/page-heroes/products-premium-hero.webp"
        imageAlt="Shakti Oracle Cards with their companion guidebook"
        imagePosition="62% center"
        title={
          <>
            <span className="text-crimson-gradient">Products</span>
          </>
        }
        subtitle="Card Deck, Shakti Book, Magic Salt, Vastu Healing Frames, sacred rituals and Tarot Reading."
      />

      {/* Featured product */}
      {featured ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Image */}
                <div className="relative">
                  <div className="gold-border-gradient relative overflow-hidden rounded-3xl">
                    <div
                      className="h-[420px] w-full bg-cover bg-center transition-transform duration-700 hover:scale-105 sm:h-[520px]"
                      style={{ backgroundImage: `url('${featured.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                    <span className="absolute left-6 top-6 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-deeper shadow-lg">
                      ✦ Featured
                    </span>
                  </div>
                  <div className="absolute -bottom-6 right-6 hidden rounded-2xl border border-parchment bg-white px-6 py-4 shadow-xl sm:block">
                    <p className="font-serif text-sm italic text-warmgray">From</p>
                    <p className="font-display text-2xl font-bold text-primary">
                      {formatINR(featured.price)}
                    </p>
                  </div>
                </div>

                {/* Copy */}
                <div>
                  <div className="eyebrow mb-4 flex items-center gap-4 text-gold-dark">
                    <span className="hairline-gold w-10" />
                    {categoryMeta(featured.category).label}
                  </div>
                  <h2 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 font-serif text-xl italic text-gold-dark">
                    {featured.subtitle}
                  </p>
                  <p className="mt-6 leading-relaxed text-warmgray">
                    {featured.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="font-display text-4xl font-bold text-primary">
                      {formatINR(featured.price)}
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button
                      href={`/checkout/product/${featured.slug}`}
                      size="lg"
                      variant="gold"
                    >
                      Buy Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button
                      href={`/products/${featured.slug}`}
                      size="lg"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </div>

                  <div className="mt-10 border-l-2 border-gold pl-5">
                    <Quote className="h-5 w-5 text-gold" />
                    <p className="mt-2 font-serif text-lg italic leading-relaxed text-charcoal">
                      Every creation is a channel — made in meditation, blessed
                      with intention, and meant to hold you on your journey.
                    </p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-gold-dark">
                      Dr. Manisha S. Belvalkar
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Product groups: Deck & Book, Products, Rituals */}
      <section className="bg-ivory/60 py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 space-y-12 sm:space-y-16 lg:space-y-24">

          {/* Section 1: Deck & Book */}
          <div>
            <Reveal className="mb-6 sm:mb-10 text-center">
              <div className="eyebrow mb-2 sm:mb-3 flex items-center justify-center gap-3 sm:gap-4 text-gold-dark">
                <span className="hairline-gold w-8 sm:w-10" />
                Sacred Wisdom
                <span className="hairline-gold w-8 sm:w-10" />
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
                Deck &amp; Book
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-base text-warmgray">
                Sacred 52-card oracle deck and companion guidebook inspired by 51 Shakti Peethas.
              </p>
            </Reveal>
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
              {deckAndBookProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-gold-dark/40" aria-hidden="true">
            <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/40" />
            <span className="font-serif text-base sm:text-lg text-gold">✦</span>
            <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          {/* Section 2: Products */}
          <div>
            <Reveal className="mb-6 sm:mb-10 text-center">
              <div className="eyebrow mb-2 sm:mb-3 flex items-center justify-center gap-3 sm:gap-4 text-gold-dark">
                <span className="hairline-gold w-8 sm:w-10" />
                Sacred Tools &amp; Frames
                <span className="hairline-gold w-8 sm:w-10" />
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
                Products
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-base text-warmgray">
                Authentic Himalayan crystal magic salt and intention-infused Vastu healing frames for your sacred space.
              </p>
            </Reveal>
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
              {shopProductsList.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-gold-dark/40" aria-hidden="true">
            <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/40" />
            <span className="font-serif text-base sm:text-lg text-gold">✦</span>
            <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          {/* Section 3: Rituals */}
          <div>
            <Reveal className="mb-6 sm:mb-10 text-center">
              <div className="eyebrow mb-2 sm:mb-3 flex items-center justify-center gap-3 sm:gap-4 text-gold-dark">
                <span className="hairline-gold w-8 sm:w-10" />
                Energy Work &amp; Guidance
                <span className="hairline-gold w-8 sm:w-10" />
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
                Rituals
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-base text-warmgray">
                Guided abundance, good luck, health and protection rituals, plus personal Tarot Reading.
              </p>
            </Reveal>
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-8">
              {ritualProductsList.map((product) => (
                <RitualCard key={product.slug} product={product} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Trust strip */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.08}>
                <div className="flex h-full flex-col items-start rounded-2xl border border-parchment bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <point.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-charcoal">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warmgray">
                    {point.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

    </>
  );
}
