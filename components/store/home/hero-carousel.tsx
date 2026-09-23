"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "s1",
    eyebrow: "Premium Essentials",
    title: "Upgrade Your Everyday Living.",
    description:
      "Thoughtfully designed products for a better, simpler, more comfortable life. Premium quality. Modern style. Only at Meridian.",
    cta: "Shop Now",
    href: "/shop",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
  },
  {
    id: "s2",
    eyebrow: "New Arrivals",
    title: "Comfort, Redesigned.",
    description:
      "Ergonomic essentials that make long days at the desk feel lighter. Built for the way you actually work.",
    cta: "Explore Now",
    href: "/shop?category=home-living",
    image:
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=1600&q=80",
  },
  {
    id: "s3",
    eyebrow: "Best Sellers",
    title: "Sound That Moves You.",
    description:
      "Headphones engineered for immersive sound, all-day comfort, and world-class noise cancellation.",
    cta: "Shop Audio",
    href: "/shop?category=electronics",
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1600&q=80",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index];

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const prev = () =>
    setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % HERO_SLIDES.length);

  return (
    <section className="relative overflow-hidden bg-[#f5f3ef]">
      <div className="container grid items-center gap-10 py-12 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="eyebrow">{slide.eyebrow}</span>
            <span className="h-px w-10 bg-[#c9a227]/50" />
          </div>

          <h1 className="mt-4 font-display text-[2.75rem] leading-[1.05] tracking-[-0.03em] text-[#0a0a0a] md:text-[4rem]">
            {slide.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="relative">
              {slide.title.split(" ").slice(-1)}
              <span className="text-[#c9a227]">.</span>
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#6b6b6b] md:text-base">
            {slide.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-2 rounded-md bg-[#1b2e24] px-6 py-3 text-sm font-medium text-[#fbfaf7] transition-all hover:bg-[#1b2e24]/90 hover:gap-3"
            >
              {slide.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-[#c9a227]" : "w-1.5 bg-[#0a0a0a]/20"
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[5/6]">
            <Image
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover transition-transform duration-700"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          <div className="pointer-events-none absolute right-6 top-6 hidden rounded-lg bg-white/90 px-4 py-3 backdrop-blur-sm md:block">
            <p className="font-display text-sm italic leading-tight text-[#0a0a0a]">
              Better.
              <br />
              Brighter Days.
            </p>
            <span className="mt-1 block h-px w-10 bg-[#c9a227]" />
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-elevated md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-elevated md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </section>
  );
}