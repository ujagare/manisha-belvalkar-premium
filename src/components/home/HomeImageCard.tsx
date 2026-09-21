import Image from "next/image";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeImageCardProps {
  href: string;
  image: string;
  alt: string;
  eyebrow?: string;
  title: string;
  description: string;
  cta?: string;
  icon?: LucideIcon;
  className?: string;
  imagePosition?: string;
  dark?: boolean;
}

export default function HomeImageCard({
  href,
  image,
  alt,
  eyebrow,
  title,
  description,
  cta = "Explore",
  icon: Icon,
  className,
  imagePosition = "center",
  dark = false,
}: HomeImageCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[28px] border border-parchment bg-cream shadow-[0_22px_70px_-42px_rgba(107,11,11,0.42)] ring-1 ring-white/70 transition-all duration-500 hover:-translate-y-2 hover:border-gold/55 hover:shadow-[0_34px_90px_-46px_rgba(107,11,11,0.52)]",
        className,
      )}
    >
      <div className="relative h-64 overflow-hidden sm:h-72">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          style={{ objectPosition: imagePosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-black/10" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
          {eyebrow ? (
            <span className="rounded-full border border-gold/45 bg-cream/85 px-3 py-1.5 text-[0.62rem] font-semibold uppercase text-primary-dark shadow-lg backdrop-blur-md">
              {eyebrow}
            </span>
          ) : (
            <span />
          )}
          {Icon ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/35 bg-cream/85 text-primary shadow-lg backdrop-blur-md">
              <Icon className="h-4 w-4" />
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col border-t border-gold/25 p-7",
          dark
            ? "bg-[linear-gradient(180deg,#221c18_0%,#15110f_100%)]"
            : "bg-[linear-gradient(180deg,rgba(255,250,241,0.98)_0%,rgba(247,240,227,0.98)_100%)]",
        )}
      >
        <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
        <h3
          className={cn(
            "font-display text-2xl font-bold leading-tight",
            dark ? "text-white" : "text-charcoal",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 flex-1 text-sm leading-relaxed",
            dark ? "text-white/72" : "text-warmgray",
          )}
        >
          {description}
        </p>
        <span
          className={cn(
            "mt-5 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 group-hover:gap-2",
            dark
              ? "text-gold-light"
              : "bg-primary-soft text-primary shadow-[0_10px_28px_-18px_rgba(180,20,20,0.55)]",
          )}
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    </Link>
  );
}
