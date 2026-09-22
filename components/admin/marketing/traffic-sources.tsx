import { ArrowRight } from "lucide-react";

const SOURCES = [
  { label: "Meta Ads", pct: 42, value: 1463, color: "#3b82f6" },
  { label: "TikTok Ads", pct: 28, value: 974, color: "#8b5cf6" },
  { label: "Google Ads", pct: 15, value: 522, color: "#f59e0b" },
  { label: "Direct", pct: 9, value: 313, color: "#1b2e24" },
  { label: "Others", pct: 6, value: 210, color: "#10b981" },
];

export function TrafficSources() {
  const size = 160;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base">Traffic Sources</h3>
        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-3 flex justify-center">
        <div className="relative h-[160px] w-[160px]">
          <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {SOURCES.map((s) => {
              const dash = (s.pct / 100) * circumference;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-base">3,482</span>
            <span className="text-[10px] text-muted-foreground">
              Total Sessions
            </span>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {SOURCES.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="flex-1 text-muted-foreground">{s.label}</span>
            <span className="shrink-0 font-medium tabular-nums">
              {s.pct}%
            </span>
            <span className="w-14 shrink-0 text-right text-muted-foreground tabular-nums">
              {s.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}