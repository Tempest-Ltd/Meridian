"use client";

import { useMemo, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

type Range = 7 | 30 | 90;

interface Point {
  date: string;
  revenue: number;
}

interface Props {
  series: { 7: Point[]; 30: Point[]; 90: Point[] };
}

function buildPaths(points: Point[], width: number, height: number, padding: number) {
  const values = points.map((p) => p.revenue);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  const coords = points.map((p, i) => {
    const x = padding + (i / Math.max(points.length - 1, 1)) * usableW;
    const y = padding + usableH - ((p.revenue - min) / range) * usableH;
    return { x, y };
  });

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  const area = `${line} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

  return { line, area, coords, max, min };
}

export function RevenueChart({ series }: Props) {
  const [range, setRange] = useState<Range>(7);
  const points = series[range];

  const { line, area, coords } = useMemo(
    () => buildPaths(points, 800, 260, 20),
    [points]
  );

  const total = points.reduce((s, p) => s + p.revenue, 0);
  const maxVal = Math.max(...points.map((p) => p.revenue), 0);

  // X-axis labels — show at most 7 evenly spaced
  const labelStep = Math.max(1, Math.ceil(points.length / 7));

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">Revenue Overview</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatPrice(total)} total in the last {range} days
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border bg-surface-elevated p-0.5">
          {([7, 30, 90] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "h-7 rounded px-3 text-xs font-medium transition-colors",
                range === r
                  ? "bg-[#1b2e24] text-[#fbfaf7]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r}D
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {/* Y-axis hints */}
        <div className="mb-2 flex justify-between text-[10px] text-muted-foreground">
          <span>{formatPrice(maxVal)}</span>
          <span>{formatPrice(maxVal / 2)}</span>
          <span>$0</span>
        </div>

        <div className="relative h-56 w-full">
          <svg
            viewBox="0 0 800 260"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line
                key={p}
                x1="0"
                x2="800"
                y1={20 + p * 220}
                y2={20 + p * 220}
                stroke="#e7e5e4"
                strokeDasharray="4 6"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Area */}
            <path d={area} fill="url(#revenueArea)" />

            {/* Line */}
            <path
              d={line}
              fill="none"
              stroke="#c9a227"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data dots (only for 7D, or every nth for longer ranges) */}
            {coords.map((c, i) => {
              if (points.length > 10 && i % Math.ceil(points.length / 10) !== 0)
                return null;
              return (
                <circle
                  key={i}
                  cx={c.x}
                  cy={c.y}
                  r="3"
                  fill="#1b2e24"
                  stroke="#fbfaf7"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {points
            .filter((_, i) => i % labelStep === 0)
            .map((p) => (
              <span key={p.date}>
                {new Date(p.date + "T00:00:00Z").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}