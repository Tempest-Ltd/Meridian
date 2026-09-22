import { Package, LayoutGrid, ShoppingCart, Users, ArrowUp } from "lucide-react";

const STATS = [
  { label: "Total Products", value: "24", delta: "12%", icon: Package, color: "#f59e0b" },
  { label: "Categories", value: "8", delta: "0%", icon: LayoutGrid, color: "#10b981" },
  { label: "Orders", value: "18", delta: "28%", icon: ShoppingCart, color: "#3b82f6" },
  { label: "Users", value: "12", delta: "20%", icon: Users, color: "#8b5cf6" },
];

export function ProductStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map(({ label, value, delta, icon: Icon, color }) => (
        <div
          key={label}
          className="min-w-0 rounded-xl border border-border bg-surface-elevated p-4"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}18`, color }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="truncate text-[11px] text-muted-foreground">
              {label}
            </p>
          </div>
          <p className="mt-2.5 font-display text-xl">{value}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-0.5 font-medium text-emerald-600">
              <ArrowUp className="h-3 w-3" />
              {delta}
            </span>
            <span className="truncate text-muted-foreground">vs. 7 days</span>
          </div>
        </div>
      ))}
    </div>
  );
}