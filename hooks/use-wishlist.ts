"use client";

import { create } from "zustand";
import type { WishlistLine } from "@/types";

interface WishlistState {
  items: WishlistLine[];
  ids: string[];
  hydrated: boolean;
  refresh: () => Promise<void>;
  toggle: (productId: string) => Promise<{ added: boolean }>;
  reset: () => void;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  items: [],
  ids: [],
  hydrated: false,

  refresh: async () => {
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const items: WishlistLine[] = data.items ?? [];
      set({
        items,
        ids: items.map((i) => i.productId),
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },

  toggle: async (productId) => {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) return { added: false };
    const data = await res.json();
    await get().refresh();
    return { added: data.added };
  },

  reset: () => set({ items: [], ids: [], hydrated: false }),
}));