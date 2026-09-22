"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const SERIES = [
  { label: "Meta Ads", color: "#3b82f6", data: [180, 240, 340, 300, 420, 520, 560] },
  { label: "TikTok Ads", color: "#8b5cf6", data: [100, 140, 180, 220, 280, 320, 340] },
  { label: "Google Ads", color: "#f59e0b", data: [80, 120, 140, 160, 180, 220, 240] },
  { label: "Email", color: "#10b981", data: [40, 60, 80, 90, 100, 120, 140] },
];

const TABS = ["Spend", "Revenue", "ROAS", "Conversions"] as const;

export function PerformanceTrend() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Spend");

  const width = 700;
  const height = 260;
  const padX = 44;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const allValues = SERIES.flatMap((s) => s.data);
  const max = Math.max(...allValues);
  const stepX = chartW / (SERIES[0].data.length - 1);
  const yTicks = [0, 200, 400, 600, 800];
  const labels = ["Apr 20", "Apr 21", "Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26"];

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-lg">Performance Trend</h2>
        <div className="flex items-center gap-1 rounded-lg bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                tab === t
                  ? "bg-[#1b2e24] text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
        {SERIES.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-muted-foreground">{s.label}</span>
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-64 w-full">
        {yTicks.map((tick) => {
          const y = padY + chartH - (tick / max) * chartH;
          return (
            <g key={tick}>
              <line
                x1={padX}
                y1={y}
                x2={padX + chartW}
                y2={y}
                stroke="#f5f3ef"
              />
              <text
                x={padX - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[9px]"
              >
                ${tick}
              </text>
            </g>
          );
        })}

        {SERIES.map((s) => {
          const points = s.data.map((v, i) => {
            const x = padX + i * stepX;
            const y = padY + chartH - (v / max) * chartH;
            return [x, y] as const;
          });

          const linePath = points
            .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
            .join(" ");

          const areaPath = `${linePath} L${padX + chartW},${padY + chartH} L${padX},${padY + chartH} Z`;

          return (
            <g key={s.label}>
              <path d={areaPath} fill={s.color} opacity="0.06" />
              <path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

        {labels.map((l, i) => (
          <text
            key={l}
            x={padX + i * stepX}
            y={height - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}