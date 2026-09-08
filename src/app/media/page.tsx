import type { Metadata } from "next";
import Image from "next/image";
import { mediaItems } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import GsapReveal from "@/components/ui/GsapReveal";
import GoldDivider from "@/components/ui/GoldDivider";
import Button from "@/components/ui/Button";
import { Newspaper, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Manisha Belvalkar in the press — interviews, features, and more.",
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Media"
        title={
          <>
            Manisha in{" "}
            <span className="text-crimson-gradient">the press</span>
          </>
        }
        subtitle="Interviews, articles, and features exploring her journey and the transformative power of spiritual guidance."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          {mediaItems.length === 0 ? (
            <GsapReveal>
              <p className="text-center text-warmgray">
                Media features coming soon.
              </p>
            </GsapReveal>
          ) : (
            <div className="space-y-10">
              {mediaItems.map((item, i) => (
                <GsapReveal key={item.id} delay={i * 0.12} y={50}>
                  <article className="group relative grid overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)] md:grid-cols-2">
                    <div className="pointer-events-none absolute -right-16 -top-16 z-10 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                    {/* Image */}
                    {item.image ? (
                      <div className="relative h-64 w-full overflow-hidden md:h-[380px]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />
                        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 shadow-md backdrop-blur">
                          <Newspaper className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-bold uppercase tracking-widest text-ink">
                            {item.outlet}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Text */}
                    <div className="flex flex-col justify-center p-8 md:p-12">
                      {!item.image ? (
                        <div className="mb-4 flex items-center gap-3">
                          <span className="rounded-full bg-gold-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep">
                            {item.outlet}
                          </span>
                        </div>
                      ) : null}
                      <h2 className="font-display text-2xl font-bold leading-tight text-charcoal sm:text-3xl">
                        {item.title}
                      </h2>
                      <p className="mt-4 leading-relaxed text-warmgray">
                        {item.excerpt}
                      </p>
                      {item.quote ? (
                        <div className="relative mt-7 rounded-xl bg-ivory p-7">
                          <Quote className="absolute right-5 top-5 h-7 w-7 text-gold/20" />
                          <p className="font-serif text-lg italic leading-relaxed text-charcoal">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                        </div>
                      ) : null}
                      <div className="mt-7">
                        <Button
                          href={item.id === "success-today" ? "https://www.manishabelvalkar.com" : `https://www.manishabelvalkar.com`}
                          variant="outline"
                          size="sm"
                        >
                          Read the full feature
                        </Button>
                      </div>
                    </div>
                  </article>
                </GsapReveal>
              ))}
            </div>
          )}

          <GsapReveal delay={0.2} className="mt-14 text-center">
            <Button href="/contact" size="lg" variant="gold">
              Work with Manisha
            </Button>
          </GsapReveal>
        </div>
      </section>

      <GoldDivider />
    </>
  );
}