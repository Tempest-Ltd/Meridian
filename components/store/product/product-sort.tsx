"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  compact?: boolean;
}

export function ProductSort({ value, onChange, compact }: ProductSortProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-lg border border-border bg-surface-elevated",
        compact ? "h-10 shrink-0 px-3" : "h-10 px-4"
      )}
    >
      <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-full cursor-pointer bg-transparent text-sm font-medium outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}