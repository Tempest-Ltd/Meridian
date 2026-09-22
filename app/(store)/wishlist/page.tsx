"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/store/product/product-card";
import { useWishlist } from "@/hooks/use-wishlist";

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);
  const hydrated = useWishlist((s) => s.hydrated);

  return (
    <div className="container py-12 md:py-16">
      <div className="flex items-center gap-3">
        <span className="eyebrow">Saved Items</span>
        <span className="h-px w-8 bg-[#c9a227]/40" />
      </div>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Your Wishlist</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Products you&apos;ve saved for later. Move them to your cart when
        you&apos;re ready.
      </p>

      {hydrated && items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-border bg-surface-elevated py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </span>
          <p className="mt-6 font-display text-2xl">
            Your wishlist is empty.
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Tap the heart on any product to save it here for later.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((line) => (
            <ProductCard key={line.id} product={line.product} />
          ))}
        </div>
      )}
    </div>
  );
}