"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/shared/badge";
import { Price } from "@/components/shared/price";
import { RatingStars } from "@/components/shared/rating-stars";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const add = useCart((s) => s.add);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isWishlisted = useWishlist((s) => s.ids.includes(product.id));

  const requireSignIn = (action: string) => {
    toast.error(`Sign in to ${action}`, {
      action: {
        label: "Sign in",
        onClick: () => router.push("/sign-in"),
      },
    });
  };

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) return requireSignIn("add items to your cart");

    const res = await add(product.id, 1, product.colors?.[0]?.name ?? null);
    if (res.ok) toast.success(`${product.name} added to cart`);
    else toast.error("Couldn't add to cart");
  };

  const onWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) return requireSignIn("save items to your wishlist");

    const { added } = await toggleWishlist(product.id);
    toast.success(added ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f5f3ef]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <div className="absolute left-2.5 top-2.5">
            <Badge badge={product.badge} />
          </div>
        )}

        <button
          type="button"
          onClick={onWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white",
            isWishlisted ? "text-rose-500" : "text-foreground"
          )}
        >
          <Heart
            className={cn("h-3.5 w-3.5", isWishlisted && "fill-rose-500")}
          />
        </button>

        <button
          type="button"
          onClick={onAdd}
          aria-label="Add to cart"
          className="absolute bottom-2.5 right-2.5 flex h-8 w-8 translate-y-1.5 items-center justify-center rounded-full bg-[#c9a227] text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#b8931f]"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-xs font-medium leading-snug transition-colors group-hover:text-[#1b2e24]">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <RatingStars
            rating={product.rating}
            count={product.reviewCount}
            size="sm"
          />
        </div>

        <div className="mt-auto pt-1.5">
          <Price
            price={product.price}
            comparePrice={product.comparePrice}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}