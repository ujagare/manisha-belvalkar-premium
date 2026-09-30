import { Sparkles } from "lucide-react";
import { brand } from "@/lib/data";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function ShaktiQuote() {
  return (
    <section className="relative overflow-hidden bg-[#f8f0e4] px-4 py-24 sm:px-7 sm:py-32 lg:px-10 lg:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-gold/30 bg-[#210b0a] shadow-[0_50px_110px_-55px_rgba(71,15,12,0.85)] sm:rounded-[2.5rem]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(153,42,29,0.52),transparent_42%),linear-gradient(120deg,rgba(255,255,255,0.025),transparent_38%)]" />
          <div className="pointer-events-none absolute -bottom-10 -right-4 font-display text-[clamp(8rem,22vw,20rem)] font-semibold leading-none tracking-[-0.08em] text-white/[0.018]">SHAKTI</div>
          <div className="pointer-events-none absolute inset-3 rounded-[1.35rem] border border-gold/10 sm:inset-5 sm:rounded-[2rem]" />

          <div className="relative grid lg:grid-cols-[0.27fr_0.73fr]">
            <aside className="flex items-center justify-between border-b border-gold/18 px-7 py-7 lg:min-h-[36rem] lg:flex-col lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
              <div className="flex items-center gap-3 text-gold-light/72">
                <span className="h-2 w-2 rotate-45 border border-gold/80" />
                <span className="text-[0.6rem] font-semibold tracking-[0.28em]">A NOTE FROM MANISHA</span>
              </div>
              <div className="hidden h-32 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent lg:block" />
              <div className="flex items-center gap-3 lg:flex-col">
                <Sparkles className="h-5 w-5 text-gold" aria-hidden="true" />
                <span className="hidden font-serif text-sm italic tracking-[0.16em] text-white/38 [writing-mode:vertical-rl] lg:block">Divine feminine wisdom</span>
              </div>
            </aside>

            <blockquote className="relative flex min-h-[34rem] flex-col justify-center px-7 py-16 sm:px-12 sm:py-20 lg:min-h-[36rem] lg:px-16 xl:px-20">
              <span className="pointer-events-none absolute right-8 top-3 font-serif text-[10rem] leading-none text-gold/14 sm:right-12 sm:text-[14rem]" aria-hidden="true">“</span>
              <p className="relative max-w-5xl text-balance font-display text-[clamp(2.6rem,5.1vw,5.8rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                Within every woman lives the energy of the <span className="text-gold-shimmer">Goddess</span>
                <span className="text-white/48"> — waiting to be remembered, honoured and set free.</span>
              </p>

              <footer className="relative mt-10 flex flex-col gap-7 border-t border-gold/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-gold/60" />
                  <cite className="font-serif text-xl not-italic text-gold-light">{brand.name}</cite>
                </div>
                <Button href="/contact" size="lg" variant="gold">Begin Your Shakti Journey</Button>
              </footer>
            </blockquote>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
