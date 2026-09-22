"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, X, ListFilter, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, ShopFilterState } from "@/types";
import { PRICE_OPTIONS, RATING_OPTIONS } from "./product-filters";

const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Top Rated",
];

interface ProductTopBarProps {
  categories: Category[];
  filters: ShopFilterState;
  onChange: (patch: Partial<ShopFilterState>) => void;
  onClearAll: () => void;
  resultCount: number;
  totalCount: number;
}

export function ProductTopBar({
  categories,
  filters,
  onChange,
  onClearAll,
  resultCount,
  totalCount,
}: ProductTopBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!barRef.current) return;
      if (!barRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const currentCategory = categories.find((c) => c.slug === filters.category);
  const categoryLabel = currentCategory?.name ?? "All Categories";

  const priceLabel = (() => {
    if (filters.minPrice === undefined && filters.maxPrice === undefined)
      return "$0 - $500";
    const o = PRICE_OPTIONS.find(
      (p) => p.min === filters.minPrice && p.max === filters.maxPrice
    );
    return o?.label ?? `$${filters.minPrice ?? 0} - $${filters.maxPrice ?? "∞"}`;
  })();

  const ratingLabel = filters.rating
    ? `${filters.rating}★ & above`
    : "All Ratings";
  const stockLabel = filters.inStock ? "In Stock" : "Availability";

  const anyActive =
    !!filters.q ||
    !!filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    !!filters.rating ||
    !!filters.inStock;

  return (
    <div
      ref={barRef}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-elevated p-2"
    >
      <div className="flex h-9 min-w-[140px] flex-1 items-center gap-2 rounded-lg border border-border bg-surface-elevated px-2.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          value={filters.q ?? ""}
          onChange={(e) => onChange({ q: e.target.value || undefined })}
          placeholder="Search products..."
          className="h-full flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        {filters.q && (
          <button
            onClick={() => onChange({ q: undefined })}
            aria-label="Clear search"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <Dropdown
        label={categoryLabel}
        active={!!filters.category}
        open={openMenu === "category"}
        onToggle={() =>
          setOpenMenu(openMenu === "category" ? null : "category")
        }
      >
        <MenuItem
          label="All Categories"
          selected={!filters.category}
          onClick={() => {
            onChange({ category: undefined });
            setOpenMenu(null);
          }}
        />
        {categories.map((c) => (
          <MenuItem
            key={c.id}
            label={c.name}
            selected={filters.category === c.slug}
            onClick={() => {
              onChange({ category: c.slug });
              setOpenMenu(null);
            }}
          />
        ))}
      </Dropdown>

      <Dropdown
        label={priceLabel}
        active={
          filters.minPrice !== undefined || filters.maxPrice !== undefined
        }
        open={openMenu === "price"}
        onToggle={() => setOpenMenu(openMenu === "price" ? null : "price")}
      >
        {PRICE_OPTIONS.map((o) => {
          const selected =
            filters.minPrice === o.min && filters.maxPrice === o.max;
          return (
            <MenuItem
              key={o.label}
              label={o.label}
              selected={selected}
              onClick={() => {
                onChange(
                  selected
                    ? { minPrice: undefined, maxPrice: undefined }
                    : { minPrice: o.min, maxPrice: o.max }
                );
                setOpenMenu(null);
              }}
            />
          );
        })}
      </Dropdown>

      <Dropdown
        label={ratingLabel}
        active={!!filters.rating}
        open={openMenu === "rating"}
        onToggle={() => setOpenMenu(openMenu === "rating" ? null : "rating")}
      >
        <MenuItem
          label="All Ratings"
          selected={!filters.rating}
          onClick={() => {
            onChange({ rating: undefined });
            setOpenMenu(null);
          }}
        />
        {RATING_OPTIONS.map((o) => (
          <MenuItem
            key={o.value}
            label={o.label}
            selected={filters.rating === o.value}
            onClick={() => {
              onChange({ rating: o.value });
              setOpenMenu(null);
            }}
          />
        ))}
      </Dropdown>

      <Dropdown
        label={stockLabel}
        active={!!filters.inStock}
        open={openMenu === "stock"}
        onToggle={() => setOpenMenu(openMenu === "stock" ? null : "stock")}
      >
        <MenuItem
          label="All Products"
          selected={!filters.inStock}
          onClick={() => {
            onChange({ inStock: undefined });
            setOpenMenu(null);
          }}
        />
        <MenuItem
          label="In Stock"
          selected={!!filters.inStock}
          onClick={() => {
            onChange({ inStock: true });
            setOpenMenu(null);
          }}
        />
      </Dropdown>

      {anyActive && (
        <button
          type="button"
          onClick={onClearAll}
          className="flex h-9 items-center gap-1.5 px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3 w-3" />
          <span>Clear all</span>
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-[11px] text-muted-foreground lg:block">
          Showing {resultCount} of {totalCount}
        </span>
        <Dropdown
          label={filters.sort ?? "Featured"}
          icon={<ListFilter className="h-3.5 w-3.5 text-muted-foreground" />}
          active={(filters.sort ?? "Featured") !== "Featured"}
          open={openMenu === "sort"}
          onToggle={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
          align="right"
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem
              key={o}
              label={o}
              selected={(filters.sort ?? "Featured") === o}
              onClick={() => {
                onChange({ sort: o === "Featured" ? undefined : o });
                setOpenMenu(null);
              }}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

function Dropdown({
  label,
  icon,
  active,
  open,
  onToggle,
  children,
  align = "left",
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-lg border bg-surface-elevated px-2.5 text-xs transition-colors",
          active
            ? "border-[#1b2e24]"
            : "border-border hover:border-[#1b2e24]/30"
        )}
      >
        {icon}
        <span className="max-w-[130px] truncate">{label}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full z-30 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-lg",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <ul className="max-h-72 overflow-y-auto py-1">{children}</ul>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors",
          selected
            ? "bg-surface font-medium"
            : "text-muted-foreground hover:bg-surface hover:text-foreground"
        )}
      >
        {label}
        {selected && <Check className="h-3.5 w-3.5 text-[#c9a227]" />}
      </button>
    </li>
  );
}