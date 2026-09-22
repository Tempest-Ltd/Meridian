"use client";

import { useState } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export interface FilterState {
  category: string;
  priceRanges: string[];
  rating: number;
  inStock: boolean;
  q: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: Category[];
  onClearAll: () => void;
  inDrawer?: boolean;
}

const PRICE_BUCKETS = [
  { id: "under-50", label: "Under $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-200", label: "$100 - $200" },
  { id: "over-200", label: "Over $200" },
];

export function ProductFilters({
  filters,
  onChange,
  categories,
  onClearAll,
  inDrawer = false,
}: ProductFiltersProps) {
  const [search, setSearch] = useState(filters.q);

  const toggleCategory = (slug: string) => {
    onChange({ ...filters, category: filters.category === slug ? "" : slug });
  };

  const togglePriceRange = (id: string) => {
    const next = filters.priceRanges.includes(id)
      ? filters.priceRanges.filter((r) => r !== id)
      : [...filters.priceRanges, id];
    onChange({ ...filters, priceRanges: next });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-elevated",
        inDrawer ? "" : "p-5"
      )}
    >
      {/* Header — only in sidebar mode */}
      {!inDrawer && (
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Filters</h3>
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className={cn(inDrawer ? "space-y-4 p-4" : "space-y-5")}>
        {/* Search */}
        <FilterSection title="Search">
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => onChange({ ...filters, q: search })}
              onKeyDown={(e) => {
                if (e.key === "Enter") onChange({ ...filters, q: search });
              }}
              placeholder="Product name…"
              className="h-full w-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category">
          <ul className="space-y-2.5">
            {categories.map((c) => {
              const active = filters.category === c.slug;
              return (
                <li key={c.id}>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleCategory(c.slug)}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-[#1b2e24]"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        active ? "font-medium" : "text-muted-foreground"
                      )}
                    >
                      {c.name}
                    </span>
                    {c.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {c.count}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <ul className="space-y-2.5">
            {PRICE_BUCKETS.map((b) => {
              const active = filters.priceRanges.includes(b.id);
              return (
                <li key={b.id}>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => togglePriceRange(b.id)}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-[#1b2e24]"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        active ? "font-medium" : "text-muted-foreground"
                      )}
                    >
                      {b.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating">
          <ul className="space-y-2.5">
            {[4, 3, 2].map((r) => {
              const active = filters.rating === r;
              return (
                <li key={r}>
                  <button
                    onClick={() =>
                      onChange({ ...filters, rating: active ? 0 : r })
                    }
                    className={cn(
                      "flex w-full items-center gap-2 text-sm",
                      active ? "font-medium" : "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i <= r
                              ? "fill-[#c9a227] text-[#c9a227]"
                              : "fill-transparent text-[#c9a227]/30"
                          )}
                        />
                      ))}
                    </span>
                    <span>& up</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                onChange({ ...filters, inStock: e.target.checked })
              }
              className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-[#1b2e24]"
            />
            <span
              className={cn(
                "flex-1 text-sm",
                filters.inStock ? "font-medium" : "text-muted-foreground"
              )}
            >
              In stock only
            </span>
          </label>
        </FilterSection>

        {/* Clear button in drawer mode */}
        {inDrawer && (
          <button
            onClick={onClearAll}
            className="w-full rounded-md border border-border bg-surface-elevated py-2.5 text-sm font-medium transition-colors hover:border-[#1b2e24]"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && children}
    </div>
  );
}