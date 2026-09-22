"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  deltaPct: number;
  direction: "up" | "down" | "flat";
  sparkline: number[];
  accentColor?: string;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-10 w-full"
    >
      <polyline
        points={areaPoints}
        fill={color}
        fillOpacity="0.12"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  deltaPct,
  direction,
  sparkline,
  accentColor = "#1b2e24",
}: Props) {
  const DeltaIcon =
    direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;

  const deltaColor =
    direction === "up"
      ? "text-emerald-600"
      : direction === "down"
      ? "text-rose-600"
      : "text-muted-foreground";

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {label.charAt(0)}
          </span>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>

      <p className="price mt-4 font-display text-3xl">{value}</p>

      <div className="mt-1.5 flex items-center gap-1.5">
        <DeltaIcon className={cn("h-3.5 w-3.5", deltaColor)} />
        <span className={cn("text-xs font-medium", deltaColor)}>
          {direction === "flat" ? "0%" : `${deltaPct}%`}
        </span>
        <span className="text-xs text-muted-foreground">vs. last period</span>
      </div>

      <div className="mt-3 h-10">
        <Sparkline data={sparkline} color={accentColor} />
      </div>
    </div>
  );
}