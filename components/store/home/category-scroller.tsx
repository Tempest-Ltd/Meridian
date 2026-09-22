"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import type { Category } from "@/types";

interface CategoryScrollerProps {
  categories: Category[];
}

export function CategoryScroller({ categories }: CategoryScrollerProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scroller.current) return;
    scroller.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (categories.length === 0) return null;

  return (
    <section className="container py-16 md:py-20">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Shop by Category"
          title="Explore Our Collections"
        />
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated transition-colors hover:border-[#1b2e24]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated transition-colors hover:border-[#1b2e24]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="group flex w-[170px] shrink-0 snap-start flex-col items-center gap-3 rounded-xl border border-border bg-surface-elevated p-4 transition-all hover:-translate-y-0.5 hover:border-[#1b2e24]/20 hover:shadow-md"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="170px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  {c.name}
                </div>
              )}
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-xs font-medium">{c.name}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}