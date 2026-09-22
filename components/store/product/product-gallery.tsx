"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Maximize2 } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Vertical thumbnails */}
      <div className="hidden shrink-0 flex-col gap-3 md:flex">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square w-16 overflow-hidden rounded-lg border bg-surface transition-all",
              active === i
                ? "border-[#c9a227] ring-1 ring-[#c9a227]"
                : "border-border hover:border-[#1b2e24]/30"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}

        <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{active + 1}</span>
          <span>/ {product.images.length}</span>
        </div>
      </div>

      {/* Main image */}
      <div className="relative flex-1">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
          <Image
            src={product.images[active]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />

          {product.badge && (
            <div className="absolute left-4 top-4">
              <Badge badge={product.badge} />
            </div>
          )}

          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-sm transition-colors hover:bg-surface-elevated"
          >
            <Heart className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Zoom image"
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-sm transition-colors hover:bg-surface-elevated"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile thumbnail strip */}
        <div className="mt-3 flex gap-2 md:hidden">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square flex-1 overflow-hidden rounded-lg border bg-surface",
                active === i
                  ? "border-[#c9a227] ring-1 ring-[#c9a227]"
                  : "border-border"
              )}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}