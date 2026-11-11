import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { getProducts } from "@/lib/supabase/products";
import AddToCartButton from "@/components/cart/AddToCartButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Shakti Oracle Deck, Rituals & Sacred Products",
  description: "Buy the Shakti Oracle deck, guidebook, magic salt, vastu healing frames, abundance rituals and Tarot Reading by Dr. Manisha Belvalkar. Ships across India.",
  alternates: { canonical: "/products" },
};

const images: Record<string, string> = {
  "shakti-oracle-deck": "/images/products-reference/deck.webp",
  "shakti-deck-guidebook": "/images/products-reference/book.webp",
  "sacred-salt-frame": "/images/products-reference/salt.webp",
  "vastu-healing-frames": "/images/products-reference/vastu.webp",
  "abundance-rituals": "/images/products-reference/abundance.webp",
  "good-luck-rituals": "/images/products-reference/luck.webp",
  "good-health-rituals": "/images/products-reference/health.webp",
  "protection-rituals": "/images/products-reference/protection.webp",
  "tarot-reading": "/images/products-reference/tarot.webp",
};

const pick = (products: Product[], slugs: string[]) => slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p));

function Actions({ product, dark = false }: { product: Product; dark?: boolean }) {
  return <div className={styles.actions}>
    <Link className={dark ? styles.goldButton : styles.primaryButton} href={`/checkout/product/${product.slug}`}>Buy now</Link>
    <AddToCartButton product={{ ...product, image: images[product.slug] ?? product.image }} compact className={dark ? styles.darkCartButton : styles.cartButton} />
    <Link className={dark ? styles.darkTextLink : styles.textLink} href={`/products/${product.slug}`}>Details <ArrowRight aria-hidden="true" /></Link>
  </div>;
}

export default async function ProductsPage() {
  const products = await getProducts();
  const wisdom = pick(products, ["shakti-oracle-deck", "shakti-deck-guidebook"]);
  const tools = pick(products, ["sacred-salt-frame", "vastu-healing-frames"]);
  const rituals = pick(products, ["abundance-rituals", "good-luck-rituals", "good-health-rituals", "protection-rituals", "tarot-reading"]);
  const trust = [
    [Sparkles, "Created with intention", "Every product is infused with prayer, ritual and healing energy."],
    [Gift, "Gift-worthy packaging", "Sacred wrapping, love notes and protective care in every parcel."],
    [Truck, "Ships across India", "Careful, insured dispatch — your treasure arrives safe and blessed."],
    [ShieldCheck, "Authentic & blessed", "Each piece is personally handled by Manisha before it leaves."],
  ] as const;

  return <main className={styles.page}>
    <section className={styles.hero} id="top" aria-labelledby="products-title">
      <Image src="/images/products-reference/hero.webp" alt="Shakti Oracle Cards with their companion guidebook" fill priority sizes="100vw" className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.wrap}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Products</span></nav>
        <p className={styles.eyebrow}><Star />The sacred collection</p>
        <h1 id="products-title">Sacred creations for <em>your journey</em></h1>
        <p className={styles.heroCopy}>Card Deck, Shakti Book, Magic Salt, Vastu Healing Frames, sacred rituals and Tarot Reading.</p>
        <div className={styles.heroActions}><Link className={styles.goldButton} href="#wisdom">Explore the collection <ArrowRight /></Link><Link className={styles.darkCartButton} href="/products/shakti-oracle-deck">Shakti Oracle Deck · ₹1,899</Link></div>
        <dl className={styles.stats}><div><dt>52</dt><dd>Oracle cards</dd></div><div><dt>51</dt><dd>Shakti Peethas</dd></div><div><dt>9</dt><dd>Sacred offerings</dd></div></dl>
      </div>
    </section>

    <nav className={styles.categories} aria-label="Product categories"><div className={styles.wrap}><Link href="#wisdom"><i>01</i> Deck & Book</Link><Link href="#tools"><i>02</i> Sacred Tools & Frames</Link><Link href="#rituals"><i>03</i> Rituals & Guidance</Link></div></nav>

    <section className={styles.section} id="wisdom" aria-labelledby="wisdom-title"><div className={styles.wrap}>
      <header className={styles.sectionHead}><p className={styles.index}>01</p><div><p className={styles.eyebrow}>Sacred wisdom</p><h2 id="wisdom-title">Deck & <em>Book</em></h2></div><p>Sacred 52-card oracle deck and companion guidebook inspired by the 51 Shakti Peethas.</p></header>
      <div className={styles.features}>{wisdom.map((product, i) => <article className={`${styles.feature} ${i ? styles.reverse : ""}`} key={product.slug}>
        <Link className={`${styles.featureMedia} ${i === 0 ? styles.stage : ""}`} href={`/products/${product.slug}`}><span className={styles.badge}><Star />{product.badge}</span><Image src={images[product.slug]} alt={product.title} fill sizes="(max-width: 899px) 100vw, 52vw" /></Link>
        <div className={styles.featureBody}><p className={styles.eyebrow}>{i === 0 ? "Featured · Card Deck" : "Shakti Book"}</p><h3>{i === 0 ? <>SHAKTI <em>Oracle Deck</em></> : <>SHAKTI guidebook for <em>daily practice</em></>}</h3><p className={styles.lede}>{product.description}</p><ul className={styles.checks}>{product.details.slice(0, 3).map((d) => <li key={d}><Star />{d}</li>)}</ul><div className={styles.priceRow}><strong>{formatINR(product.price)}</strong><span>incl. all taxes</span></div><Actions product={product} /></div>
      </article>)}</div>
    </div></section>

    <section className={styles.quote} aria-label="A note from Manisha"><Star /><blockquote>Every creation is a channel — made in meditation, blessed with intention, and meant to hold you on your journey.</blockquote><p>Dr. Manisha S. Belvalkar</p></section>

    <section className={styles.section} id="tools" aria-labelledby="tools-title"><div className={styles.wrap}>
      <header className={styles.sectionHead}><p className={styles.index}>02</p><div><p className={styles.eyebrow}>Sacred tools & frames</p><h2 id="tools-title">For your <em>sacred space</em></h2></div><p>Authentic Himalayan crystal magic salt and intention-infused Vastu healing frames for your sacred space.</p></header>
      <div className={styles.toolGrid}>{tools.map((product) => <article className={styles.toolCard} key={product.slug}><Link className={styles.toolMedia} href={`/products/${product.slug}`}><span className={styles.badge}><Star />{product.badge}</span><Image src={images[product.slug]} alt={product.title} fill sizes="(max-width: 699px) 100vw, 50vw" /></Link><div className={styles.toolBody}><p className={styles.eyebrow}>Rituals & tools</p><h3><Link href={`/products/${product.slug}`}>{product.title}</Link></h3><p className={styles.lede}>{product.subtitle}</p><div className={styles.toolFoot}><div><strong>{formatINR(product.price)}</strong><span>incl. all taxes</span></div><Actions product={product} /></div></div></article>)}</div>
    </div></section>

    <section className={styles.trust} aria-label="Why shop with us"><div className={styles.wrap}>{trust.map(([Icon, title, copy]) => <article key={title}><span><Icon /></span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className={styles.rituals} id="rituals" aria-labelledby="rituals-title"><div className={styles.wrap}>
      <header className={`${styles.sectionHead} ${styles.darkHead}`}><p className={styles.index}>03</p><div><p className={styles.eyebrow}>Energy work & guidance</p><h2 id="rituals-title">Rituals & <em>Tarot</em></h2></div><p>Guided abundance, good luck, health and protection rituals, plus personal Tarot Reading.</p></header>
      <div className={styles.ritualList}>{rituals.map((product, i) => <article className={styles.ritual} key={product.slug}><span className={styles.ritualIndex}>{String(i + 1).padStart(2, "0")}</span><Link className={styles.ritualMedia} href={`/products/${product.slug}`}><Image src={images[product.slug]} alt={product.title} fill sizes="(max-width: 1039px) 100vw, 190px" /></Link><div className={styles.ritualBody}><p className={styles.tags}><span>{product.slug === "tarot-reading" ? "Personal guidance" : "Sacred ritual"}</span><span>{product.slug === "tarot-reading" ? "Tarot" : "Energy healing"}</span></p><h3><Link href={`/products/${product.slug}`}>{product.title}</Link></h3><p className={styles.lede}>{product.subtitle}</p><ul className={styles.checks}>{product.details.slice(0, 3).map((d) => <li key={d}><Star />{d}</li>)}</ul></div><div className={styles.ritualBuy}><p>Offering price</p><strong>{formatINR(product.price)}</strong><Actions product={product} dark /></div></article>)}</div>
    </div></section>
  </main>;
}
