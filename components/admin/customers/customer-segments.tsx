const SEGMENTS = [
  { label: "First-time Buyers", value: 1166, pct: 41, color: "#10b981" },
  { label: "Returning Customers", value: 1356, pct: 48, color: "#1b2e24" },
  { label: "VIP Customers", value: 321, pct: 11, color: "#c9a227" },
];

export function CustomerSegments() {
  const size = 160;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4">
      <h3 className="font-display text-base">Customer Segments</h3>

      <div className="mt-3 flex justify-center">
        <div className="relative h-[160px] w-[160px]">
          <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {SEGMENTS.map((s) => {
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
            <span className="font-display text-lg">2,843</span>
            <span className="text-[10px] text-muted-foreground">
              Total Customers
            </span>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {SEGMENTS.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="flex-1 text-muted-foreground">{s.label}</span>
            <span className="shrink-0 font-medium tabular-nums">
              {s.pct}%
            </span>
            <span className="w-12 shrink-0 text-right text-muted-foreground tabular-nums">
              {s.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}