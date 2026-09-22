import { ArrowRight } from "lucide-react";

const CHANNELS = [
  { label: "Meta Ads", value: 842, color: "#1b2e24" },
  { label: "TikTok Ads", value: 611, color: "#f59e0b" },
  { label: "Google Ads", value: 402, color: "#3b82f6" },
  { label: "Email", value: 228, color: "#8b5cf6" },
];

export function AdSpendChart() {
  const width = 400;
  const height = 200;
  const padX = 44;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const max = 1000;
  const barW = chartW / CHANNELS.length - 24;

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base">Ad Spend by Channel</h3>
        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-48 w-full">
        {[0, 250, 500, 750, 1000].map((tick) => {
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

        {CHANNELS.map((c, i) => {
          const x = padX + i * (chartW / CHANNELS.length) + 12;
          const barH = (c.value / max) * chartH;
          const y = padY + chartH - barH;
          return (
            <g key={c.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="3"
                fill={c.color}
              />
              <text
                x={x + barW / 2}
                y={y - 5}
                textAnchor="middle"
                className="fill-foreground text-[9px] font-medium"
              >
                ${c.value}
              </text>
              <text
                x={x + barW / 2}
                y={height - 4}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {c.label.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}