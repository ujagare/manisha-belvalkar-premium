import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, LayoutGrid, Sparkles, BookOpen, Gem } from "lucide-react";
import type { ProductCategory } from "@/lib/data";
import { productCategoryLabels } from "@/lib/data";
import { getProducts } from "@/lib/supabase/products";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ProductGrid from "@/components/products/ProductGrid";

const CATEGORIES: ProductCategory[] = ["oracle", "book", "ritual"];

const categorySubtitle: Record<ProductCategory, string> = {
  oracle: "Divinely illustrated oracle decks for daily guidance and connection with the divine feminine.",
  book: "Companion guides and WhatsApp workshops for deepening your practice step by step.",
  ritual: "Handcrafted sacred tools, magic salt and abundance ritual kits for your altar and space.",
};

const categoryCopy: Record<ProductCategory, string> = {
  oracle: "Each oracle deck is born of meditation and carries the wisdom of the 51 Shakti Peethas.",
  book: "Guides and workshops that walk you through the teachings — own your practice.",
  ritual: "Infused with intention and personally handled by Manisha before they reach you.",
};

interface Props {
  params: Promise<{ category: string }>;
}

function isCategory(value: string): value is ProductCategory {
  return CATEGORIES.includes(value as ProductCategory);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: "Shop" };
  const label = productCategoryLabels[category];
  return {
    title: `${label} — Sacred Shop`,
    description: `${categoryCopy[category]} Shop ${label} by Dr. Manisha S. Belvalkar.`,
    alternates: { canonical: `/collections/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const all = await getProducts();
  const items = all.filter((p) => p.category === category).filter((p) => p.slug !== "shakti-combo-pack");
  if (!items.length) notFound();

  const label = productCategoryLabels[category];

  const Icon = (() => {
    switch (category) {
      case "oracle":
        return Sparkles;
      case "book":
        return BookOpen;
      default:
        return Gem;
    }
  })();

  return (
    <>
      <PageHero
        eyebrow="Sacred Shop · Collection"
        image="/images/page-heroes/products-hero.png"
        imageAlt={`${label} collection`}
        title={<span className="text-crimson-gradient">{label}</span>}
        subtitle={categorySubtitle[category]}
      />

      {/* Breadcrumb + cross-links */}
      <section className="bg-ivory/60 pb-2 pt-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-warmgray">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="hover:text-primary">Shop</Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-charcoal">{label}</span>
          </nav>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark">
            <LayoutGrid className="h-4 w-4" /> All shop
          </Link>
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center gap-2 px-6 lg:px-10">
          {CATEGORIES.filter((c) => c !== category).map((c) => (
            <Link
              key={c}
              href={`/collections/${c}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-parchment bg-white px-4 py-2 text-sm font-medium text-warmgray transition-colors hover:border-gold hover:text-charcoal"
            >
              {c === "oracle" ? <Sparkles className="h-3.5 w-3.5" /> : c === "book" ? <BookOpen className="h-3.5 w-3.5" /> : <Gem className="h-3.5 w-3.5" />}
              {productCategoryLabels[c]}
            </Link>
          ))}
        </div>
      </section>

      {/* Collection copy + grid */}
      <section className="bg-ivory/60 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="mb-10 flex items-center justify-center gap-2 text-gold-dark">
            <Icon className="h-5 w-5" />
            <span className="eyebrow">{items.length} {items.length === 1 ? "item" : "items"}</span>
          </Reveal>
          <Reveal className="mb-12 text-center">
            <p className="mx-auto max-w-2xl text-warmgray">{categoryCopy[category]}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ProductGrid products={items} />
          </Reveal>
          <div className="mt-14 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:brightness-110">
              Back to the full shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
