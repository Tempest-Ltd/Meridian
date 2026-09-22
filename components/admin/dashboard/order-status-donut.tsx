"use client";

import { cn } from "@/lib/utils";

interface Slice {
  status: string;
  count: number;
  pct: number;
}

const COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#7c3aed",
  PROCESSING: "#f97316",
  SHIPPED: "#2563eb",
  DELIVERED: "#10b981",
  CANCELLED: "#94a3b8",
};

const LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function OrderStatusDonut({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.count, 0);
  const nonEmpty = slices.filter((s) => s.count > 0);

  // SVG donut
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const arcs = nonEmpty.map((s) => {
    const fraction = total > 0 ? s.count / total : 0;
    const length = fraction * circumference;
    const arc = {
      color: COLORS[s.status] ?? "#94a3b8",
      dashArray: `${length} ${circumference - length}`,
      dashOffset: -offset,
    };
    offset += length;
    return arc;
  });

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Order Status</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Breakdown of all orders
      </p>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f5f3ef"
              strokeWidth="18"
            />
            {total === 0 ? null : (
              arcs.map((arc, i) => (
                <circle
                  key={i}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="18"
                  strokeDasharray={arc.dashArray}
                  strokeDashoffset={arc.dashOffset}
                  strokeLinecap="butt"
                />
              ))
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="price font-display text-2xl">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>

        <ul className="flex-1 space-y-2">
          {slices.map((s) => (
            <li key={s.status} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[s.status] ?? "#94a3b8" }}
                />
                <span className="text-muted-foreground">
                  {LABELS[s.status] ?? s.status}
                </span>
              </span>
              <span className="price text-xs font-medium">{s.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}