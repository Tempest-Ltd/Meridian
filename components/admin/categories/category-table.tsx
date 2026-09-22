"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface TableCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  _count: { products: number };
  updatedAt: string;
}

interface Props {
  categories: TableCategory[];
  selectedId: string | null;
  onEdit: (category: TableCategory) => void;
  onDelete: (category: TableCategory) => void;
  loading: boolean;
}

export function CategoryTable({
  categories,
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

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-surface-elevated py-16 text-center">
        <p className="font-display text-lg">No categories yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create one to organize your products.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      <div className="hidden grid-cols-[1fr_110px_180px_90px] items-center gap-3 border-b border-border px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
        <span>Category</span>
        <span>Products</span>
        <span>Slug</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-border">
        {categories.map((c) => (
          <div
            key={c.id}
            className={
              "grid grid-cols-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/50 lg:grid-cols-[1fr_110px_180px_90px] " +
              (selectedId === c.id ? "bg-[#f5e9c8]/30" : "")
            }
          >
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  Updated {formatDate(c.updatedAt)}
                </p>
              </div>
            </div>

            <span className="price text-sm">{c._count.products}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {c.slug}
            </span>

            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => onEdit(c)}
                aria-label="Edit"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(c)}
                aria-label="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}