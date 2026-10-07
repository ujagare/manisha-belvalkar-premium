import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

const featured = testimonials[0];
const supporting = [testimonials[2], testimonials[4]];

export default function PremiumTestimonials() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deeper py-24 text-cream sm:py-28 lg:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 14% 18%, rgba(221,184,41,0.16), transparent 25%), radial-gradient(circle at 88% 82%, rgba(180,20,20,0.35), transparent 34%)",
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-gold/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 top-1/2 h-[23rem] w-[23rem] -translate-y-1/2 rounded-full border border-dashed border-gold/10" aria-hidden="true" />

      <div className="relative mx-auto max-w-[92rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-b border-gold/25 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] text-gold-light">
              <span className="h-px w-9 bg-gold/70" aria-hidden="true" />
              Words from the journey
            </p>
            <h2 className="mt-5 max-w-4xl text-balance font-display text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Guidance that stays with you.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-cream/65 lg:text-right">
            Personal experiences of clarity, balance and meaningful change shared by people who have worked with Manisha.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-0">
          <figure className="relative border-b border-gold/25 pb-12 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16 xl:pr-24">
            <Quote className="h-11 w-11 fill-gold/15 text-gold" aria-hidden="true" />
            <blockquote className="mt-8 max-w-4xl font-serif text-[2.15rem] font-medium italic leading-[1.28] text-cream sm:text-5xl sm:leading-[1.22] xl:text-[3.5rem]">
              “{featured.text}”
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/45 bg-gold/10 font-display text-xl font-semibold text-gold-light">
                {featured.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span>
                <span className="block font-semibold text-gold-light">{featured.name}</span>
                <span className="mt-1 block text-sm text-cream/55">{featured.role}</span>
              </span>
            </figcaption>
          </figure>

          <div className="divide-y divide-gold/25 lg:pl-12 xl:pl-16">
            {supporting.map((item) => (
              <figure key={item.name} className="py-9 first:pt-0 last:pb-0 lg:py-10 lg:first:pt-0">
                <blockquote className="font-serif text-2xl italic leading-relaxed text-cream/90 sm:text-3xl">
                  “{item.text}”
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-sm font-semibold text-gold-light">{item.name}</span>
                  <span className="mt-1 block text-xs text-cream/50">{item.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-gold/25 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-xl italic text-cream/65">Every journey is personal. Every story is shared with care.</p>
          <Link
            href="/testimonials"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-primary-deeper transition hover:bg-gold-light"
          >
            Read all client stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
