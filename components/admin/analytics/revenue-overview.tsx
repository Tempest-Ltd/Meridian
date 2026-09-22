"use client";

import { useMemo, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

type Metric = "revenue" | "orders" | "customers";
type Range = 7 | 30 | 90;

interface Point {
  date: string;
  value: number;
}

interface Props {
  series: {
    revenue: { 7: Point[]; 30: Point[]; 90: Point[] };
    orders: { 7: Point[]; 30: Point[]; 90: Point[] };
    customers: { 7: Point[]; 30: Point[]; 90: Point[] };
  };
}

const METRIC_COLORS: Record<Metric, string> = {
  revenue: "#c9a227",
  orders: "#2563eb",
  customers: "#7c3aed",
};

function buildPaths(points: Point[], width: number, height: number, padding: number) {
  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  const coords = points.map((p, i) => {
    const x = padding + (i / Math.max(points.length - 1, 1)) * usableW;
    const y = padding + usableH - ((p.value - min) / range) * usableH;
    return { x, y };
  });

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;
  return { line, area, max };
}

export function RevenueOverview({ series }: Props) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [range, setRange] = useState<Range>(30);
  const points = series[metric][range];
  const color = METRIC_COLORS[metric];

  const { line, area, max } = useMemo(
    () => buildPaths(points, 800, 280, 20),
    [points]
  );

  const total = points.reduce((s, p) => s + p.value, 0);
  const labelStep = Math.max(1, Math.ceil(points.length / 7));

  const formatValue = (v: number) => {
    if (metric === "revenue") return formatPrice(v);
    return String(Math.round(v));
  };

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">Performance Overview</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatValue(total)} total in the last {range} days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-surface p-0.5">
            {(["revenue", "orders", "customers"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={cn(
                  "h-7 rounded px-3 text-xs font-medium capitalize transition-colors",
                  metric === m
                    ? "bg-[#1b2e24] text-[#fbfaf7]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-md border border-border bg-surface-elevated p-0.5">
            {([7, 30, 90] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "h-7 rounded px-2.5 text-xs font-medium transition-colors",
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
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[10px] text-muted-foreground">
          <span>{formatValue(max)}</span>
          <span>{formatValue(max / 2)}</span>
          <span>0</span>
        </div>

        <div className="relative h-64 w-full">
          <svg viewBox="0 0 800 280" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id={`area-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line
                key={p}
                x1="0"
                x2="800"
                y1={20 + p * 240}
                y2={20 + p * 240}
                stroke="#e7e5e4"
                strokeDasharray="4 6"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path d={area} fill={`url(#area-${metric})`} />
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

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