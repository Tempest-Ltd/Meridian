"use client";


export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { CartItem } from "@/components/store/cart/cart-item";
import { CartSummary } from "@/components/store/cart/cart-summary";
import { EmptyCart } from "@/components/store/cart/empty-cart";
import { TrustStrip } from "@/components/store/footer/trust-strip";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const wishlistCount = useWishlist((s) => s.items.length);

  const subtotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const count = items.reduce((s, i) => s + i.quantity, 0);

  if (hydrated && items.length === 0) {
    return (
      <div className="container py-16">
        <EmptyCart />
      </div>
    );
  }

  return (
    <>
      <div className="container py-12 md:py-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Your Cart</span>
              <span className="h-px w-8 bg-[#c9a227]/40" />
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Good choices. Better days.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              You&apos;re one step closer to a more comfortable you. Review
              your items below and proceed to checkout when you&apos;re ready.
            </p>
          </div>

          {/* Wishlist pill — top right of the page */}
          <Link
            href="/wishlist"
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-sm font-medium transition-colors hover:border-[#1b2e24]"
          >
            <Heart className="h-4 w-4 text-rose-500 transition-transform group-hover:scale-110" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="ml-0.5 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold tabular-nums text-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div>
            <div className="rounded-2xl border border-border bg-surface-elevated px-6">
              {items.map((line) => (
                <CartItem key={line.id} line={line} />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>

              <Link
                href="/wishlist"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Heart className="h-3.5 w-3.5" />
                View Wishlist
              </Link>
            </div>
          </div>

          <CartSummary subtotal={subtotal} itemCount={count} />
        </div>
      </div>

      <TrustStrip />
    </>
  );
}