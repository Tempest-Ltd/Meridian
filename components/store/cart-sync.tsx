"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export function CartSync() {
  const { isSignedIn, userId } = useAuth();
  const refreshCart = useCart((s) => s.refresh);
  const resetCart = useCart((s) => s.reset);
  const refreshWishlist = useWishlist((s) => s.refresh);
  const resetWishlist = useWishlist((s) => s.reset);

  useEffect(() => {
    if (isSignedIn) {
      refreshCart();
      refreshWishlist();
    } else {
      resetCart();
      resetWishlist();
    }
  }, [isSignedIn, userId, refreshCart, refreshWishlist, resetCart, resetWishlist]);

  return null;
}