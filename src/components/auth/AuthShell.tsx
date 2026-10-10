import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarHeart, LockKeyhole, Sparkles } from "lucide-react";
import { brand } from "@/lib/data";

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
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#211513] pt-16">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] opacity-45 lg:block"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 18%, rgba(221,184,41,.16), transparent 24%), radial-gradient(circle at 15% 82%, rgba(180,20,20,.08), transparent 28%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1600px] lg:grid-cols-[.92fr_1.08fr]">
        <div className="relative hidden min-h-[calc(100dvh-4rem)] overflow-hidden lg:block">
          <Image
            src="/images/login-hero-bg.jpg"
            alt="Manisha Belvalkar"
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 0px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-charcoal/35" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, rgba(28,25,23,.08) 18%, rgba(28,25,23,.88) 100%)",
            }}
          />

          <Link
            href="/"
            className="group absolute left-10 top-9 z-10 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-charcoal/15 backdrop-blur-sm transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </span>
            Back to home
          </Link>

          <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-16">
            <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-gold-light">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              A space for your inner journey
            </div>
            <blockquote className="max-w-2xl font-serif text-3xl font-medium leading-[1.22] text-white xl:text-[2.65rem]">
              “{brand.quote}”
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                {brand.name} · {brand.role}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden px-4 py-8 pb-24 sm:px-10 sm:py-14 lg:px-14 lg:pb-14 xl:px-20">
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-gold/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-8 top-36 h-40 w-40 rounded-full border border-gold/10" aria-hidden="true" />

          <div className="w-full max-w-[34rem]">
            <Link
              href="/"
              className="mb-7 inline-flex items-center gap-3 text-white lg:hidden"
              aria-label="Manisha Belvalkar home"
            >
              <Image
                src="/images/Logo.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/40"
              />
              <span className="font-display text-lg font-bold tracking-tight">
                Manisha <span className="font-serif italic text-gold">Belvalkar</span>
              </span>
            </Link>

            <div className="rounded-[2.25rem] bg-white/8 p-1.5 ring-1 ring-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.26)]">
              <div className="relative overflow-hidden rounded-[1.9rem] bg-[#fffaf2] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,1)] sm:px-10 sm:py-10">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[5rem] bg-gold-soft/70" aria-hidden="true" />
                <div className="relative mb-8">
                  <div className="mb-5 inline-flex rounded-full bg-primary-soft px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
                    Private member access
                  </div>
                  <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.045em] text-charcoal sm:text-[3.25rem]">
                    {title}
                  </h1>
                  <p className="mt-4 max-w-md text-[0.92rem] leading-6 text-warmgray">{subtitle}</p>
                </div>

                {children}

                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-parchment/80 pt-6">
                  <div className="flex items-center gap-2 text-[0.7rem] font-medium leading-4 text-warmgray">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-deep">
                      <LockKeyhole className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    Private &amp; secure
                  </div>
                  <div className="flex items-center gap-2 text-[0.7rem] font-medium leading-4 text-warmgray">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <CalendarHeart className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    Manage your journey
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[0.66rem] uppercase tracking-[0.18em] text-white/45">
              Guidance for the soul · Since 1995
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
