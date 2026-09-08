import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/lib/data";

/**
 * Premium split-screen auth shell.
 * Left: brand panel (portrait + quote). Right: the form card.
 */
export default function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: ReactNode;
  subtitle: string;
}) {
  return (
    <section className="relative min-h-screen bg-cream">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="/images/login-hero-bg.jpg"
            alt="Manisha Belvalkar"
            width={1600}
            height={1052}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(221,184,41,0.18),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(180,20,20,0.22),transparent_60%)]" />
          {/* Subtle gold hairline grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(221,184,41,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(221,184,41,0.4) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
            aria-hidden="true"
          />
          {/* Floating gold glow blob */}
          <div className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-gold/20 blur-[100px]" />

          <div className="relative z-10 flex h-full flex-col justify-end p-14">
            <div className="eyebrow mb-5 flex items-center gap-4 text-gold">
              <span className="hairline-gold w-10" />
              The Inner Circle
            </div>
            <span className="mb-3 font-serif text-6xl leading-none text-gold/50">&ldquo;</span>
            <blockquote className="max-w-md font-serif text-2xl italic leading-relaxed text-white">
              {brand.quote}
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <span className="h-px w-12 bg-gold/60" />
              <p className="text-sm uppercase tracking-widest text-white/70">
                — {brand.name}, {brand.role}
              </p>
            </div>
            <Link
              href="/"
              className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur transition-all duration-300 hover:border-gold hover:bg-gold hover:text-primary-deeper"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
              Back to the sanctuary
            </Link>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-6 py-16 sm:px-10 lg:py-24">
          <div className="w-full max-w-md">
            {/* Mobile brand mark */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <Image
                src="/images/Logo.png"
                alt="Manisha Belvalkar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-black/10"
              />
              <span className="font-display text-lg font-bold tracking-tight text-charcoal">
                Manisha <span className="font-serif italic text-gold">Belvalkar</span>
              </span>
            </div>

            <div className="eyebrow mb-4 text-gold-dark">Members only</div>
            <h1 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 leading-relaxed text-warmgray">{subtitle}</p>

            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
