import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BookOpenText, Heart, Home as HomeIcon, Sparkles } from "lucide-react";

import GsapReveal from "@/components/ui/GsapReveal";
import { awards, brand } from "@/lib/data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Dr. Manisha Belvalkar — Spiritual Mentor with 30+ Years Experience",
  description: "Meet Dr. Manisha Belvalkar, a holistic well-being coach with over 30 years of experience in Tarot consultation, Soul Purpose Reading, Goddess Attunement and Chakra Therapy in Mumbai & Pune.",
  alternates: { canonical: "/about" },
};

const expertise = [
  { icon: BookOpenText, title: "Tarot consultation", text: "A focused reading that brings context, clarity and direction to the questions shaping your life." },
  { icon: Sparkles, title: "Soul purpose reading", text: "A deeper look at your natural gifts, recurring patterns and the path that feels most aligned." },
  { icon: HomeIcon, title: "Goddess attunement", text: "A sacred practice for connecting with divine feminine energy, inner strength and spiritual support." },
  { icon: Heart, title: "Chakra therapy", text: "Gentle energy work created to restore balance, vitality and a stronger sense of inner steadiness." },
];

const milestones = [
  ["1990s", "The practice begins", "Manisha starts exploring Tarot, energy work and ancient wisdom traditions."],
  ["2000s", "Study becomes mastery", "Years of research shape a personal approach to Tarot, attunement and chakra work."],
  ["2010s", "Recognition follows", "A PhD in Tarot Reading and features in leading publications bring wider recognition."],
  ["Today", "The work continues", "Private sessions, mentoring, courses and Shakti carry the practice to a global community."],
] as const;

const stats = [["30+", "Years of practice"], ["PhD", "in Tarot Reading"], ["04", "Core disciplines"]] as const;

function Ornament() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-3 text-[#ddb829]">
      <span className="h-px w-10 bg-current" />
      <Sparkles className="size-4 stroke-[1.4]" />
      <span className="h-px w-10 bg-current" />
    </span>
  );
}

function Mandala() {
  const point = (angle: number, radius: number) =>
    `${(Math.cos(angle) * radius).toFixed(2)} ${(Math.sin(angle) * radius).toFixed(2)}`;
  const ring = (count: number, inner: number, outer: number, width = 1) =>
    Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      const spread = (Math.PI / count) * width;
      return `M${point(angle - spread, inner)} Q${point(angle, outer + (outer - inner) * 0.4)} ${point(angle + spread, inner)}`;
    });

  return (
    <svg className={styles.mandala} viewBox="-100 -100 200 200" fill="none" stroke="currentColor" aria-hidden="true">
      {[96, 88, 60, 34, 18].map((radius) => <circle key={radius} r={radius} strokeWidth="0.35" />)}
      {ring(16, 60, 88).map((path, index) => <path key={`outer-${index}`} d={path} strokeWidth="0.35" />)}
      {ring(32, 88, 96).map((path, index) => <path key={`edge-${index}`} d={path} strokeWidth="0.35" />)}
      {ring(12, 34, 58, 1.2).map((path, index) => <path key={`middle-${index}`} d={path} strokeWidth="0.35" />)}
      {ring(8, 18, 32).map((path, index) => <path key={`inner-${index}`} d={path} strokeWidth="0.35" />)}
      {Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 48) * Math.PI * 2;
        return <circle key={index} cx={Math.cos(angle) * 92} cy={Math.sin(angle) * 92} r="0.8" fill="currentColor" stroke="none" />;
      })}
    </svg>
  );
}

export default function AboutPage() {
  const award = awards[0];

  return (
    <div className={`${styles.page} overflow-hidden bg-[#fdf8f0] pt-16 text-[#30231e]`}>
      <header className="relative isolate overflow-hidden bg-[#6b0b0b] px-4 pb-12 pt-8 text-white sm:min-h-[calc(100dvh-4rem)] sm:px-8 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-20">
        <div aria-hidden="true" className="absolute inset-3 border border-[#ddb829]/20 sm:inset-8" />
        <div aria-hidden="true" className="absolute -left-28 top-20 size-96 rounded-full bg-[#b41414]/35 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-8 sm:min-h-[calc(100dvh-11rem)] sm:gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-24">
          <div className="pt-2 lg:pt-0">
            <GsapReveal y={22}><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f0d060]">About Manisha</p></GsapReveal>
            <GsapReveal y={28} delay={0.08}>
              <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2.2rem] leading-[1.03] tracking-[-0.035em] sm:mt-6 sm:text-6xl lg:text-[4.75rem]">Wisdom shaped by a <span className="italic text-[#f0d060]">lifetime of practice.</span></h1>
            </GsapReveal>
            <GsapReveal y={22} delay={0.14}>
              <div className="mt-5 sm:mt-8"><Ornament /></div>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#efe5d2] sm:mt-7 sm:text-lg sm:leading-8">For over 30 years, Manisha has helped people meet uncertainty with clarity, self-trust and grounded spiritual guidance.</p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
                <Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ddb829] px-6 py-3 text-sm font-bold text-[#3b2118] transition hover:-translate-y-1 hover:bg-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:px-7">Work with Manisha <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                <Link href="#disciplines" className="inline-flex min-h-11 items-center rounded-full border border-[#f0d060]/55 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:px-7">Explore her practice</Link>
              </div>
            </GsapReveal>
            <dl className="mt-8 grid max-w-2xl grid-cols-3 border-y border-[#ddb829]/25 py-4 sm:mt-12 sm:py-6">
              {stats.map(([value, label], index) => (
                <div key={label} className={index ? "border-l border-[#ddb829]/25 px-3 sm:px-6" : "pr-3 sm:pr-6"}>
                  <dt className="font-serif text-2xl text-[#f0d060] sm:text-4xl">{value}</dt>
                  <dd className="mt-1 text-[0.62rem] uppercase leading-4 tracking-[0.1em] text-white/65 sm:text-xs sm:leading-5">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <GsapReveal y={30} delay={0.1}>
            <div className={styles.heroArt}>
              <Mandala />
              <div className={styles.jharokha}>
                <div className={styles.jharokhaInner}>
                  <Image src="/images/manisha-about-hero.webp" alt="Dr. Manisha Belvalkar seated with her Tarot cards" fill priority sizes="(max-width: 1024px) 90vw, 470px" className={`${styles.jharokhaImage} object-[50%_35%]`} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3a0909] via-[#3a0909]/20 to-transparent px-5 pb-5 pt-16 sm:px-7 sm:pb-7 sm:pt-24">
                  <p className="font-serif text-lg sm:text-xl">Dr. Manisha Belvalkar</p>
                  <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-[#f0d060] sm:mt-1 sm:text-xs">PhD in Tarot Reading</p>
                </div>
                </div>
              </div>
              <div className={styles.plinth} aria-hidden="true" />
              <div className="absolute bottom-10 right-1 grid size-20 place-items-center rounded-full border border-[#ddb829] bg-[#8b0f0f] text-center shadow-xl sm:-right-8 sm:bottom-20 sm:size-24"><div><b className="block font-serif text-2xl text-[#f0d060] sm:text-3xl">30+</b><span className="text-[0.6rem] uppercase tracking-[0.18em] sm:text-[0.65rem]">Years</span></div></div>
            </div>
          </GsapReveal>
        </div>
      </header>

      <section className="border-b border-[#6b0b0b]/10 bg-[#efe5d2] px-4 py-10 sm:px-8 sm:py-14 lg:py-20">
        <GsapReveal y={18}>
          <blockquote className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center font-serif text-2xl leading-tight text-[#6b0b0b] sm:gap-6 sm:text-4xl lg:flex-row lg:justify-center lg:text-5xl"><Ornament /><span>Clarity begins when you learn to hear <em className="text-[#a8871a]">your own wisdom.</em></span><Ornament /></blockquote>
        </GsapReveal>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 sm:gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <GsapReveal y={28}>
            <div className="mx-auto w-full max-w-[320px] sm:max-w-[420px] lg:mx-0">
              <div className={styles.jharokha}><div className={styles.jharokhaInner}><Image src="/images/manisha-about-practice.webp" alt="Manisha Belvalkar during a Tarot reading" fill sizes="(max-width: 1024px) 100vw, 420px" className={`${styles.jharokhaImage} object-[50%_28%]`} /></div></div>
            </div>
          </GsapReveal>
          <div>
            <GsapReveal y={24}><Ornament /></GsapReveal>
            <GsapReveal y={28} delay={0.06}><h2 className="mt-5 max-w-3xl text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] sm:mt-7 sm:text-5xl lg:text-6xl">A practice built on <em className="text-[#a81414]">attention, study and care.</em></h2></GsapReveal>
            <GsapReveal y={22} delay={0.12}>
              <div className="mt-5 max-w-[42rem] space-y-4 text-sm leading-7 text-[#67564d] sm:mt-8 sm:space-y-5 sm:text-lg sm:leading-8">
                <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[#a81414]">Manisha&apos;s work began with a deep curiosity about the unseen patterns that influence everyday life. That curiosity grew into decades of disciplined study across Tarot, soul purpose, divine feminine practices and chakra therapy.</p>
                <p>Her PhD in Tarot Reading reflects that commitment to depth. In each session, she pairs intuitive insight with practical conversation so that guidance feels useful beyond the reading itself.</p>
                <p className="border-l-2 border-[#ddb829] pl-6 font-serif text-xl italic text-[#6b0b0b]">The intention is simple: to help each person understand where they are, recognise what is asking to change and move forward with greater confidence.</p>
              </div>
            </GsapReveal>
          </div>
        </div>
      </section>

      <section id="disciplines" className="bg-[#fdf8f0] px-4 py-12 sm:px-8 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <GsapReveal y={22}><div className="mx-auto max-w-3xl text-center"><h2 className="text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-6xl">Four disciplines. <em className="text-[#a81414]">One thoughtful approach.</em></h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#67564d] sm:mt-6 sm:text-lg sm:leading-8">Every practice offers a different way to understand the present and make the next decision with care.</p></div></GsapReveal>
          <div className="mt-8 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item, index) => (
              <GsapReveal key={item.title} y={22} delay={index * 0.05}>
                <article className="group relative h-full border border-[#efe5d2] bg-white px-5 py-7 text-center shadow-[0_30px_50px_-42px_rgba(107,11,11,0.55)] transition duration-300 before:pointer-events-none before:absolute before:inset-2 before:border before:border-[#ddb829]/45 hover:-translate-y-1.5 hover:border-[#ddb829] sm:px-7 sm:py-11">
                  <div className="relative mx-auto grid size-13 place-items-center rounded-full bg-[#6b0b0b] text-[#ddb829] ring-1 ring-[#ddb829] ring-offset-4 ring-offset-white sm:size-16"><item.icon className="size-6 sm:size-7" strokeWidth={1.25} /></div>
                  <h3 className="mt-5 font-serif text-xl leading-tight sm:mt-7 sm:text-2xl">{item.title}</h3><p className="mt-2.5 text-sm leading-6 text-[#67564d] sm:mt-4 sm:leading-7">{item.text}</p>
                </article>
              </GsapReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1c1917] px-4 py-12 text-white sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <GsapReveal y={22}><p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#ddb829]">The journey</p><h2 className="mt-3 max-w-3xl text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] sm:mt-5 sm:text-5xl lg:text-6xl">Three decades of <em className="text-[#f0d060]">learning and service.</em></h2></GsapReveal>
          <ol className="mt-8 grid gap-7 sm:mt-14 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {milestones.map(([year, title, text], index) => (
              <GsapReveal key={year} y={22} delay={index * 0.05}>
                <li className="relative border-t border-[#ddb829]/45 pt-6 sm:pt-8 lg:px-6 lg:first:pl-0"><span className="absolute -top-2.5 left-0 grid size-5 place-items-center rounded-full border border-[#ddb829] bg-[#1c1917] after:size-2 after:rounded-full after:bg-[#ddb829] lg:left-6 lg:first:left-0" /><time className="font-serif text-3xl italic text-[#f0d060] sm:text-4xl">{year}</time><h3 className="mt-3 font-serif text-xl sm:mt-5 sm:text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-[#d6cfc2] sm:mt-3 sm:leading-7">{text}</p></li>
              </GsapReveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fdf8f0] px-4 py-12 sm:px-8 sm:py-20 lg:py-32">
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-8 sm:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <GsapReveal y={22}><div><p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a8871a]">Beyond the sessions</p><h2 className="mt-3 font-serif text-[2rem] leading-[1.02] tracking-[-0.03em] sm:mt-5 sm:text-6xl lg:text-7xl">A life <em className="text-[#a81414]">in practice.</em></h2><blockquote className="mt-6 border-l-2 border-[#ddb829] pl-4 font-serif text-xl italic leading-[1.45] text-[#8b0f0f] sm:mt-10 sm:pl-7 sm:text-3xl lg:text-4xl">“The experience of the divine happens every day, in each moment. It is not something that you achieve.”</blockquote><p className="mt-4 max-w-xl text-sm leading-7 text-[#57534e] sm:mt-7 sm:text-base sm:leading-8">A glimpse of Manisha as a practitioner, teacher and woman whose work has grown through decades of study, recognition and lived spiritual practice.</p><div className="mt-6 flex items-center gap-4 sm:mt-10 sm:gap-5"><Sparkles className="size-7 text-[#a8871a] sm:size-8" strokeWidth={1.2} /><div><b className="font-serif text-xl sm:text-2xl">Presence before prescription.</b><p className="mt-0.5 text-sm text-[#57534e] sm:mt-1">Warm, grounded and deeply attentive.</p></div></div></div></GsapReveal>
          <GsapReveal y={28} delay={0.08}><div className="mx-auto w-full max-w-[300px] sm:max-w-[400px]"><div className={styles.jharokha}><div className={styles.jharokhaInner}><Image src="/images/manisha-wix.webp" alt="Manisha Belvalkar in a personal portrait" fill sizes="(max-width: 1024px) 100vw, 400px" className={`${styles.jharokhaImage} object-[50%_20%]`} /></div></div></div></GsapReveal>
        </div>
      </section>

      <section className="bg-[#6b0b0b] px-4 py-12 text-white sm:px-8 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <GsapReveal y={22}><div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#ddb829]">A recognised voice</p><h2 className="mt-3 text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] sm:mt-5 sm:text-5xl lg:text-6xl">A journey <em className="text-[#f0d060]">honoured</em> through recognition.</h2></div></GsapReveal>
          <div className="mt-8 grid items-center gap-6 border-y border-[#a8871a]/30 py-7 sm:mt-14 sm:gap-12 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-14">
            <GsapReveal y={26}><div className="relative aspect-[3/2] overflow-hidden border-[4px] border-[#ddb829] bg-white shadow-[0_28px_70px_-42px_rgba(107,11,11,0.6)] sm:border-[6px]"><Image src="/images/manisha-health-magazine.webp" alt="Manisha Belvalkar receiving the International Excellence Award from actor Sonu Sood" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" /></div></GsapReveal>
            <GsapReveal y={22} delay={0.08}><div><Award className="size-8 text-[#ddb829] sm:size-9" strokeWidth={1.3} /><h3 className="mt-4 font-serif text-2xl leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">{award?.title ?? "International Excellence Award"}</h3><p className="mt-3 text-base leading-7 text-[#efe5d2] sm:mt-6 sm:text-lg sm:leading-8">{award?.description ?? "An honour recognising her mastery and years of dedicated service."}</p><div className="mt-6 flex flex-wrap gap-3 sm:mt-9 sm:gap-4"><Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ddb829] px-6 py-3 text-sm font-semibold text-[#292524] transition hover:-translate-y-1 hover:bg-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:px-7">Begin a conversation <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link><Link href={brand.whatsappHref} className="inline-flex min-h-11 items-center rounded-full border border-[#f0d060]/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:px-7">Message on WhatsApp</Link></div></div></GsapReveal>
          </div>
          <div className="mt-10 sm:mt-16">
            <GsapReveal y={18}><h3 className="font-serif text-2xl sm:text-3xl">In the press</h3></GsapReveal>
            <div className="mt-5 grid gap-6 sm:mt-8 sm:gap-7 md:grid-cols-2">
              {[
                ["/images/manisha-portrait-healer.webp", "Magazine feature titled A Spiritual Success", "“A Spiritual Success”", "Wonder Women feature"],
                ["/images/manisha-success-story.webp", "Manisha Belvalkar featured as founder of Shakti Portal", "Founder, Shakti Portal", "Featured profile"],
              ].map(([src, alt, title, caption], index) => (
                <GsapReveal key={src} y={22} delay={index * 0.06}><figure className="group"><div className="relative aspect-[4/3] overflow-hidden border-[4px] border-[#ddb829] bg-white sm:border-[5px]"><Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]" /></div><figcaption className="flex items-end justify-between gap-4 border-b border-[#ddb829]/30 py-3.5 sm:py-5"><b className="font-serif text-lg sm:text-xl">{title}</b><span className="text-[0.68rem] uppercase tracking-[0.15em] text-[#ddb829] sm:text-xs">{caption}</span></figcaption></figure></GsapReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
