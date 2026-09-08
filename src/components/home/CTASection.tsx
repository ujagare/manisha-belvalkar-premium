import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/** Full-width CTA section with gradient background. */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      {/* Decorative background pattern */}
      <div className="glow-gold absolute -right-40 -top-40 h-[500px] w-[500px]" />
      <div className="glow-crimson absolute -bottom-40 -left-40 h-[400px] w-[400px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="left">
            <div className="eyebrow mb-4 flex items-center gap-3 text-primary">
              <Sparkles className="h-4 w-4" />
              Begin your journey
            </div>
            <h2 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-charcoal sm:text-5xl">
              Ready to find{" "}
              <span className="text-crimson-gradient">clarity</span> and
              alignment<span className="text-gold">?</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warmgray sm:text-lg">
              Whether you seek answers, alignment, or transformation, Manisha&apos;s
              decades of dedication ensure a personalized and impactful
              experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" size="lg" variant="primary">
                <Heart className="h-4 w-4" />
                Book a Session
              </Button>
              <Button href="/about" size="lg" variant="outline">
                Know More
              </Button>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="gold-border-gradient relative overflow-hidden rounded-2xl">
              <Image
                src="/images/candle.jpg"
                alt="Sacred space with candle"
                width={600}
                height={700}
                className="h-[500px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}