"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToSlide = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[i] as HTMLElement | undefined;
    if (!target) return;
    const left =
      target.offsetLeft - track.clientWidth / 2 + target.clientWidth / 2;
    track.scrollTo({ left, behavior: "smooth" });
  }, []);

  const go = (i: number) => {
    const next = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
    setIndex(next);
    scrollToSlide(next);
  };

  // Sync active dot to actual scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const centerX = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      children.forEach((child, i) => {
        const cc = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(cc - centerX);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setIndex(closest);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

    // Auto-advance every 4 seconds, pauses on interaction
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const next = (index + 1) % HERO_SLIDES.length;
      setIndex(next);
      scrollToSlide(next);
    }, 4500);
    return () => clearInterval(t);
  }, [index, paused, scrollToSlide]);

  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Swipeable track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth pl-[6%] md:pl-0"
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 5000)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {HERO_SLIDES.map((slide, i) => {
          const words = slide.title.split(" ");
          const lastWord = words.pop() ?? "";
          const leadingWords = words.join(" ");

          return (
            <div
              key={slide.id}
              className="relative h-[420px] w-[88%] shrink-0 snap-center overflow-hidden rounded-2xl md:h-[480px] md:w-full md:rounded-none lg:h-[520px]"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 100vw, 88vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0">
                <div className="container flex h-full items-center">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-3">
                      <span className="eyebrow">{slide.eyebrow}</span>
                      <span className="h-px w-10 bg-[#c9a227]/60" />
                    </div>
                    <h1 className="mt-3 font-display text-[2.75rem] leading-[1.05] tracking-[-0.03em] text-[#0a0a0a] md:text-[4rem]">
                      {leadingWords}{" "}
                      <span className="relative whitespace-nowrap">
                        {lastWord}
                        <span className="text-[#c9a227]">.</span>
                      </span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6b6b6b] md:text-base">
                      {slide.description}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <Link
                        href={slide.href}
                        className="group inline-flex items-center gap-2 rounded-md bg-[#1b2e24] px-5 py-2.5 text-sm font-medium text-[#fbfaf7] transition-all hover:bg-[#1b2e24]/90 hover:gap-3"
                      >
                        {slide.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute right-6 top-6 hidden max-w-[140px] rounded-lg bg-white/90 px-3 py-2 backdrop-blur-sm md:block">
                <p className="font-display text-xs italic leading-tight">
                  Better.
                  <br />
                  Brighter Days.
                </p>
                <span className="mt-1 block h-px w-8 bg-[#c9a227]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows — desktop */}
      <button
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-elevated md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-elevated md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots — aligned to container */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10">
        <div className="container">
          <div className="pointer-events-auto flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-[#c9a227]" : "w-1.5 bg-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}