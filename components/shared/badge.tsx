import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types";

const BADGE_STYLES: Record<
  ProductBadge,
  { label: string; className: string }
> = {
  BEST_SELLER: {
    label: "Best Seller",
    className: "bg-[#c9a227] text-white",
  },
  NEW: {
    label: "New",
    className: "bg-[#d9e0c8] text-[#3d4a2a]",
  },
  SALE: {
    label: "Sale",
    className: "bg-[#f5d0d4] text-[#8a2b3a]",
  },
  POPULAR: {
    label: "Popular",
    className: "bg-[#d9e0c8] text-[#3d4a2a]",
  },
};

interface BadgeProps {
  badge: ProductBadge;
  className?: string;
}

export function Badge({ badge, className }: BadgeProps) {
  const entry = BADGE_STYLES[badge];
  if (!entry) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
        entry.className,
        className
      )}
    >
      {entry.label}
    </span>
  );
}