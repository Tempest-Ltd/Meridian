"use client";

import { create } from "zustand";
import type { CartLine } from "@/types";

interface CartState {
  items: CartLine[];
  hydrated: boolean;
  refresh: () => Promise<void>;
  add: (
    productId: string,
    quantity?: number,
    color?: string | null
  ) => Promise<{ ok: boolean; error?: string }>;
  updateQty: (cartItemId: string, quantity: number) => Promise<void>;
  remove: (cartItemId: string) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  hydrated: false,

  refresh: async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      set({ items: data.items ?? [], hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  add: async (productId, quantity = 1, color = null) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, color }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error ?? "ADD_FAILED" };
    }
    await get().refresh();
    return { ok: true };
  },

  updateQty: async (cartItemId, quantity) => {
    set((s) => ({
      items: s.items.map((i) =>
        i.id === cartItemId ? { ...i, quantity } : i
      ),
    }));
    await fetch(`/api/cart/${cartItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    await get().refresh();
  },

  remove: async (cartItemId) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== cartItemId) }));
    await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });
    await get().refresh();
  },

  clear: async () => {
    set({ items: [] });
    await fetch("/api/cart", { method: "DELETE" });
  },

  reset: () => set({ items: [], hydrated: false }),
}));