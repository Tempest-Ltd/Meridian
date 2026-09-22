"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DATA = [
  { label: "Apr 20", value: 160 },
  { label: "Apr 21", value: 180 },
  { label: "Apr 22", value: 200 },
  { label: "Apr 23", value: 220 },
  { label: "Apr 24", value: 240 },
  { label: "Apr 25", value: 280 },
  { label: "Apr 26", value: 300 },
];

export function SalesTrend() {
  const [range, setRange] = useState("Daily");
  const width = 700;
  const height = 180;
  const padX = 44;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const max = Math.max(...DATA.map((d) => d.value)) * 1.2;
  const barW = chartW / DATA.length - 16;

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Sales Trend</h2>
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs">
          <span>{range}</span>
          <span className="text-muted-foreground">▾</span>
        </button>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-44 w-full">
        {[0, 150, 300, 450, 600].map((tick) => {
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

        {DATA.map((d, i) => {
          const x = padX + i * (chartW / DATA.length) + 8;
          const barH = (d.value / max) * chartH;
          const y = padY + chartH - barH;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="3"
                fill="#1b2e24"
              />
              <text
                x={x + barW / 2}
                y={height - 4}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}