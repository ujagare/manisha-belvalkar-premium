"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export type SliderSlide = { src: string; label: string };

type ProductImageSliderProps = {
  slides: SliderSlide[];
  href: string;
  title: string;
  badgeLabel?: string;
  containerClassName?: string;
  badgeClassName?: string;
  imageClassName?: string;
  sizes?: string;
};

export default function ProductImageSlider({
  slides,
  href,
  title,
  badgeLabel,
  containerClassName,
  badgeClassName,
  imageClassName,
  sizes,
}: ProductImageSliderProps) {
  const [active, setActive] = useState(0);

  const go = (step: number) =>
    setActive((current) => (current + step + slides.length) % slides.length);

  if (!slides.length) return null;

  return (
    <div
      className={`${containerClassName ?? ""} relative overflow-hidden`}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${title} images`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
      }}
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={index === active ? `${title} — ${slide.label}` : ""}
          fill
          priority={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          sizes={sizes}
          aria-hidden={index !== active}
          className={`${imageClassName ?? ""} object-cover object-center transition-opacity duration-500 ease-out ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {badgeLabel ? (
        <span className={badgeClassName}>
          <Star />
          {badgeLabel}
        </span>
      ) : null}

      <Link
        href={href}
        aria-label={`View ${title} details`}
        className="absolute inset-0 z-10"
      />

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-3 sm:size-10"
      >
        <ChevronLeft className="size-4 sm:size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next image"
        className="absolute right-2 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-3 sm:size-10"
      >
        <ChevronRight className="size-4 sm:size-5" aria-hidden="true" />
      </button>

      <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${slide.label}`}
            aria-current={index === active}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === active ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>

      <span className="absolute bottom-2.5 right-3 z-20 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white sm:text-xs">
        {active + 1}/{slides.length}
      </span>
    </div>
  );
}
