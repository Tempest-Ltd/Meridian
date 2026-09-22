"use client";

import { cn } from "@/lib/utils";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "PAID", label: "Paid" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
] as const;

export type StatusTab = (typeof TABS)[number]["key"];

interface Props {
  active: StatusTab;
  onChange: (tab: StatusTab) => void;
  counts: Record<string, number>;
  total: number;
}

export function OrderStatusTabs({ active, onChange, counts, total }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface-elevated p-1">
      {TABS.map((t) => {
        const count = t.key === "ALL" ? total : counts[t.key] ?? 0;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
              isActive
                ? "bg-[#1b2e24] text-[#fbfaf7]"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                isActive ? "bg-white/20 text-white" : "bg-surface"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}