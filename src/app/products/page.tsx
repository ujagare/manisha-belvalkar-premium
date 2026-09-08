import type { Metadata } from "next";
import {
  Sparkles,
  Gift,
  Truck,
  ShieldCheck,
  Quote,
  ArrowUpRight,
} from "lucide-react";
import { productCategoryLabels } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { getProducts } from "@/lib/supabase/products";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";
import ProductGrid from "@/components/products/ProductGrid";
import { categoryMeta } from "@/components/products/ProductCard";

export const metadata: Metadata = {
  title: "Products — Sacred Tools & Treasures",
  description:
    "Handcrafted oracle decks, books, salt frames and sacred tools created with intention by Dr. Manisha Belvalkar — for daily guidance, protection and spiritual practice.",
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
  // DB-backed catalog (falls back to the static catalog until Supabase
  // is configured) — dashboard products appear here automatically.
  const products = await getProducts();
  const featured = products.find((p) => p.featured) ?? products[0];

  return (
    <>
      <PageHero
        eyebrow="Sacred Shop"
        title={
          <>
            Sacred Tools &{" "}
            <span className="text-crimson-gradient">Treasures</span>
          </>
        }
        subtitle="Handcrafted oracle decks, books, salt frames and ritual tools — created with intention to guide, protect and transform your everyday sacred practice."
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
                    {featured.salePrice ? (
                      <>
                        <span className="text-xl text-warmgray line-through">
                          {formatINR(featured.salePrice)}
                        </span>
                        <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-deep">
                          Save{" "}
                          {Math.round(
                            ((featured.salePrice - featured.price) /
                              featured.salePrice) *
                              100,
                          )}
                          %
                        </span>
                      </>
                    ) : null}
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

      {/* Product grid with filters */}
      <section className="bg-ivory/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="mb-14 text-center">
            <div className="eyebrow mb-4 flex items-center justify-center gap-4 text-gold-dark">
              <span className="hairline-gold w-10" />
              {Object.keys(productCategoryLabels).length} sacred collections
              <span className="hairline-gold w-10" />
            </div>
            <h2 className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
              Choose your{" "}
              <span className="text-crimson-gradient">sacred tool</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-warmgray">
              Filter by collection — oracle decks for daily guidance, books for
              deep wisdom, and handcrafted ritual pieces to protect and cleanse
              your space.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ProductGrid products={products} />
          </Reveal>
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

      <CTASection />
    </>
  );
}
