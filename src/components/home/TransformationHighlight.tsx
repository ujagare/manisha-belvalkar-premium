import { Sparkles } from "lucide-react";
import { transformationProgram } from "@/lib/data";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function TransformationHighlight() {
  const { months } = transformationProgram;
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 lg:py-28">
      <div className="glow-gold absolute -right-40 -top-40 h-[500px] w-[500px]" />
      <div className="glow-crimson absolute -bottom-40 -left-40 h-[400px] w-[400px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal className="text-center">
          <div className="eyebrow mb-5 flex items-center justify-center gap-4 text-gold">
            <span className="hairline-gold w-10" />
            Flagship Program
            <span className="hairline-gold w-10" />
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Six months to{" "}
            <span className="text-gold-shimmer">transform</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            {transformationProgram.description}
          </p>
        </Reveal>

        {/* Month chips */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {months.map((m, i) => (
            <Reveal key={m.month} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition-all duration-500 hover:border-gold/40 hover:bg-white/10">
                <span className="font-display text-sm font-bold text-gold">
                  {String(m.month).padStart(2, "0")}
                </span>
                <span className="mt-2 text-sm font-semibold text-white">
                  {m.title}
                </span>
                <Sparkles className="mt-3 h-4 w-4 text-gold/50" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Button href="/transformation" size="lg" variant="gold">
            Explore the Program
          </Button>
        </Reveal>
      </div>
    </section>
  );
}