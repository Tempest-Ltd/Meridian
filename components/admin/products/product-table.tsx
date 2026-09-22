"use client";

import Image from "next/image";
import { Pencil, Trash2, Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { StatusPill } from "@/components/shared/status-pill";

export interface TableProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  stock: number;
  rating: number;
  badge: string | null;
  category: { name: string } | null;
}

interface Props {
  products: TableProduct[];
  selectedId: string | null;
  onEdit: (product: TableProduct) => void;
  onDelete: (product: TableProduct) => void;
  loading: boolean;
}

export function ProductTable({
  products,
  selectedId,
  onEdit,
  onDelete,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface-elevated py-16">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-surface-elevated py-16 text-center">
        <p className="font-display text-lg">No products yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Use the form on the right to create your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      {/* Header — hidden on small */}
      <div className="hidden grid-cols-[minmax(0,1fr)_100px_90px_80px_100px_70px_70px] items-center gap-2 border-b border-border px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
        <span>Product</span>
        <span>Price</span>
        <span>Stock</span>
        <span className="text-center">Status</span>
        <span>Category</span>
        <span className="text-center">Rating</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-border">
        {products.map((p) => {
          const lowStock = p.stock > 0 && p.stock <= 5;
          const outOfStock = p.stock === 0;
          const status = outOfStock
            ? { variant: "danger" as const, label: "Out" }
            : lowStock
            ? { variant: "warning" as const, label: "Low" }
            : { variant: "success" as const, label: "In Stock" };

          return (
            <div
              key={p.id}
              className={cn(
                "grid grid-cols-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/50 lg:grid-cols-[minmax(0,1fr)_100px_90px_80px_100px_70px_70px] lg:gap-2",
                selectedId === p.id && "bg-[#f5e9c8]/30"
              )}
            >
              {/* Product (with image + name) */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">
                    {p.slug}
                  </p>
                </div>
              </div>

              <span className="price text-sm font-medium">
                {formatPrice(p.price)}
              </span>

              <span
                className={cn(
                  "price text-sm",
                  lowStock && "text-amber-700",
                  outOfStock && "text-rose-700"
                )}
              >
                {p.stock}
              </span>

              <div className="flex justify-start lg:justify-center">
                <StatusPill variant={status.variant} dot>
                  {status.label}
                </StatusPill>
              </div>

              <span className="truncate text-xs text-muted-foreground">
                {p.category?.name ?? "—"}
              </span>

              <span className="flex items-center justify-start gap-1 text-xs lg:justify-center">
                <Star className="h-3 w-3 fill-[#c9a227] text-[#c9a227]" />
                {p.rating.toFixed(1)}
              </span>

              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onEdit(p)}
                  aria-label="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(p)}
                  aria-label="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}