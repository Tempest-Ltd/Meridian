"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { MobileDrawer } from "@/components/shared/mobile-drawer";
import { ProductGrid } from "./product-grid";
import { ProductFilters, type FilterState } from "./product-filters";
import { ProductSort, type SortOption } from "./product-sort";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types";

interface ShopClientProps {
  products: Product[];
  categories: Category[];
  initialFilters?: Partial<FilterState>;
}

const DEFAULT_FILTERS: FilterState = {
  category: "",
  priceRanges: [],
  rating: 0,
  inStock: false,
  q: "",
};

const PRICE_BUCKETS = [
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
  { id: "over-200", label: "Over $200", min: 200, max: Infinity },
];

export function ShopClient({
  products,
  categories,
  initialFilters = {},
}: ShopClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Count of active filters (for the badge on mobile button)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceRanges.length > 0) count += filters.priceRanges.length;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.q) count++;
    return count;
  }, [filters]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Category
      if (filters.category && p.categorySlug !== filters.category) return false;

      // Price ranges
      if (filters.priceRanges.length > 0) {
        const matches = filters.priceRanges.some((rangeId) => {
          const bucket = PRICE_BUCKETS.find((b) => b.id === rangeId);
          if (!bucket) return false;
          return p.price >= bucket.min && p.price < bucket.max;
        });
        if (!matches) return false;
      }

      // Rating
      if (filters.rating > 0 && p.rating < filters.rating) return false;

      // In stock
      if (filters.inStock && p.stock <= 0) return false;

      // Search
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort
    result = [...result];
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [products, filters, sort]);

  const clearAll = () => setFilters(DEFAULT_FILTERS);

  return (
    <>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow">Shop</span>
            <span className="h-px w-8 bg-[#c9a227]/40" />
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">
            Shop All Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1 ? "product" : "products"}
            {filters.category &&
              ` in ${categories.find((c) => c.slug === filters.category)?.name ?? ""}`}
          </p>
        </div>

        {/* Desktop sort — visible only on lg+ */}
        <div className="hidden lg:block">
          <ProductSort value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              categories={categories}
              onClearAll={clearAll}
            />
          </div>
        </aside>

        {/* Products column */}
        <div className="min-w-0">
          {/* Mobile control bar — filter + sort */}
          <div className="mb-4 flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex h-10 flex-1 items-center justify-between gap-2 rounded-lg border border-border bg-surface-elevated px-4 text-sm font-medium transition-colors hover:border-[#1b2e24]"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1b2e24] px-1.5 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </button>

            <ProductSort value={sort} onChange={setSort} compact />
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {filters.category && (
                <FilterChip
                  label={
                    categories.find((c) => c.slug === filters.category)?.name ??
                    filters.category
                  }
                  onRemove={() => setFilters({ ...filters, category: "" })}
                />
              )}
              {filters.priceRanges.map((rangeId) => {
                const bucket = PRICE_BUCKETS.find((b) => b.id === rangeId);
                if (!bucket) return null;
                return (
                  <FilterChip
                    key={rangeId}
                    label={bucket.label}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        priceRanges: filters.priceRanges.filter(
                          (r) => r !== rangeId
                        ),
                      })
                    }
                  />
                );
              })}
              {filters.rating > 0 && (
                <FilterChip
                  label={`${filters.rating}★ & up`}
                  onRemove={() => setFilters({ ...filters, rating: 0 })}
                />
              )}
              {filters.inStock && (
                <FilterChip
                  label="In stock"
                  onRemove={() => setFilters({ ...filters, inStock: false })}
                />
              )}
              {filters.q && (
                <FilterChip
                  label={`"${filters.q}"`}
                  onRemove={() => setFilters({ ...filters, q: "" })}
                />
              )}
              <button
                onClick={clearAll}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          <ProductGrid products={filtered} />
        </div>
      </div>

      {/* Mobile filters drawer */}
      <MobileDrawer
        title="Filters"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <div className="p-4">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            categories={categories}
            onClearAll={clearAll}
            inDrawer
          />
        </div>
      </MobileDrawer>
    </>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface-elevated pl-3 pr-1.5 text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}