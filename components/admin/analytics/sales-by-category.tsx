"use client";

import { formatPrice } from "@/lib/utils";

interface Slice {
  id: string;
  name: string;
  revenue: number;
  units: number;
  pct: number;
}

const PALETTE = [
  "#1b2e24",
  "#c9a227",
  "#2563eb",
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#94a3b8",
];

export function SalesByCategory({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.revenue, 0);
  const nonEmpty = slices.filter((s) => s.revenue > 0);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const arcs = nonEmpty.map((s, i) => {
    const fraction = total > 0 ? s.revenue / total : 0;
    const length = fraction * circumference;
    const arc = {
      color: PALETTE[i % PALETTE.length],
      dashArray: `${length} ${circumference - length}`,
      dashOffset: -offset,
    };
    offset += length;
    return arc;
  });

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Sales by Category</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Revenue split across categories
      </p>

      {nonEmpty.length === 0 ? (
        <div className="mt-8 py-8 text-center">
          <p className="text-sm text-muted-foreground">No sales data yet.</p>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-5">
          <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#f5f3ef" strokeWidth="18" />
              {arcs.map((arc, i) => (
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
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="price font-display text-base">
                {formatPrice(total).replace(/\.\d{2}$/, "")}
              </span>
              <span className="text-[9px] text-muted-foreground">Total</span>
            </div>
          </div>

          <ul className="flex-1 space-y-2">
            {nonEmpty.slice(0, 6).map((s, i) => (
              <li key={s.id} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    {s.name}
                  </span>
                </span>
                <span className="price shrink-0 text-xs font-medium">
                  {s.pct}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}