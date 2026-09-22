"use client";

import { Battery, Check, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Price } from "@/components/shared/price";
import { RatingStars } from "@/components/shared/rating-stars";
import { QuantityStepper } from "./quantity-stepper";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const FEATURES = [
  { icon: Sparkles, label: "Active Noise Cancellation", sub: "Block out the world" },
  { icon: Battery, label: "Up to 24 Hours Battery", sub: "Long-lasting power" },
  { icon: Check, label: "Premium Comfort", sub: "For all-day wear" },
];

export function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const add = useCart((s) => s.add);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isWishlisted = useWishlist((s) => s.ids.includes(product.id));

  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [busy, setBusy] = useState(false);

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const requireSignIn = (action: string) => {
    toast.error(`Sign in to ${action}`, {
      action: {
        label: "Sign in",
        onClick: () => router.push("/sign-in"),
      },
    });
  };

  const handleAdd = async () => {
    if (!isSignedIn) return requireSignIn("add items to your cart");
    setBusy(true);
    const res = await add(product.id, qty, color ?? null);
    setBusy(false);
    if (res.ok) toast.success(`${product.name} added to cart`);
    else toast.error("Couldn't add to cart");
  };

  const handleBuyNow = async () => {
    if (!isSignedIn) return requireSignIn("checkout");
    setBusy(true);
    const res = await add(product.id, qty, color ?? null);
    setBusy(false);
    if (res.ok) router.push("/checkout");
    else toast.error("Couldn't proceed to checkout");
  };

  const handleWishlist = async () => {
    if (!isSignedIn) return requireSignIn("save items to your wishlist");
    const { added } = await toggleWishlist(product.id);
    toast.success(added ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="eyebrow">{product.category}</span>
        <span className="h-px w-8 bg-[#c9a227]/40" />
      </div>

      <h1 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
        {product.name}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <RatingStars rating={product.rating} size="md" showCount={false} />
        <span className="text-sm text-muted-foreground">
          {product.rating} ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Price
          price={product.price}
          comparePrice={product.comparePrice}
          size="lg"
        />
        {discount > 0 && (
          <span className="rounded-full bg-[#f5e9c8] px-3 py-1 text-xs font-semibold text-[#8a6d1a]">
            Save {discount}%
          </span>
        )}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        {FEATURES.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-elevated px-3 py-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface">
              <Icon className="h-3.5 w-3.5 text-foreground" />
            </span>
            <div>
              <p className="text-xs font-medium leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="mt-8">
          <p className="text-sm">
            Color: <span className="font-medium">{color}</span>
          </p>
          <div className="mt-3 flex items-center gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                  color === c.name
                    ? "border-[#1b2e24]"
                    : "border-transparent hover:border-border"
                )}
              >
                <span
                  className="h-6 w-6 rounded-full border border-border"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} />

        <button
          onClick={handleAdd}
          disabled={busy}
          className="inline-flex h-12 items-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60"
        >
          <ShoppingBag className="h-4 w-4" />
          {busy ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={busy}
          className="inline-flex h-12 items-center rounded-md border border-border bg-surface-elevated px-6 text-sm font-medium text-foreground transition-colors hover:border-[#1b2e24] disabled:opacity-60"
        >
          Buy Now
        </button>

        <button
          onClick={handleWishlist}
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-md border bg-surface-elevated transition-colors hover:border-[#1b2e24]",
            isWishlisted
              ? "border-rose-200 text-rose-500"
              : "border-border text-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-rose-500")} />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-2.5 w-2.5 text-emerald-700" strokeWidth={3} />
        </span>
        <span className="font-medium text-emerald-700">
          {product.stock > 0 ? "In stock" : "Out of stock"}
        </span>
        <span className="text-muted-foreground">
          · Ships within 1–2 business days
        </span>
      </div>
    </div>
  );
}