import { Eye, ArrowUp } from "lucide-react";

export function TrafficVisitors() {
  const width = 200;
  const height = 60;
  const data = [20, 24, 22, 30, 28, 36, 44, 48, 42, 52, 58, 62];
  const max = Math.max(...data);
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - (v / max) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-6">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-display text-base">Traffic & Visitors</h3>
      </div>

      <div className="mt-4">
        <p className="font-display text-3xl">3,482</p>
        <p className="mt-1 text-xs text-muted-foreground">Total Visitors</p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
            <ArrowUp className="h-3 w-3" /> 22%
          </span>
          <span className="text-muted-foreground">vs. previous 7 days</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-14 w-full">
        <path
          d={`${linePath} L${width},${height} L0,${height} Z`}
          fill="#10b981"
          opacity="0.1"
        />
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-xs">
        {[
          { v: "2,391", l: "Unique Visitors", d: "+18%" },
          { v: "1m 42s", l: "Avg. Session Duration", d: "+12%" },
          { v: "3.8", l: "Pages per Session", d: "+9%" },
        ].map((s) => (
          <div key={s.l}>
            <p className="font-display text-sm">{s.v}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
              {s.l}
            </p>
            <p className="mt-1 text-[10px] font-medium text-emerald-600">
              ↑ {s.d}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}