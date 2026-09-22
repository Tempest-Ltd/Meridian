"use client";

interface Props {
  total: number;
  returning: number;
  newThisMonth: number;
}

const PALETTE = {
  returning: "#1b2e24",
  new: "#c9a227",
  inactive: "#e7e5e4",
};

export function CustomerSegments({ total, returning, newThisMonth }: Props) {
  const inactive = Math.max(0, total - returning);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const slices = [
    { key: "returning", value: returning, color: PALETTE.returning },
    { key: "new", value: newThisMonth, color: PALETTE.new },
    { key: "inactive", value: inactive, color: PALETTE.inactive },
  ].filter((s) => s.value > 0);

  let offset = 0;
  const arcs = slices.map((s) => {
    const fraction = total > 0 ? s.value / total : 0;
    const length = fraction * circumference;
    const arc = {
      color: s.color,
      dashArray: `${length} ${circumference - length}`,
      dashOffset: -offset,
    };
    offset += length;
    return arc;
  });

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Customer Segments</h3>

      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f5f3ef"
              strokeWidth="18"
            />
            {arcs.map((a, i) => (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={a.color}
                strokeWidth="18"
                strokeDasharray={a.dashArray}
                strokeDashoffset={a.dashOffset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="price font-display text-2xl">{total}</span>
            <span className="text-[10px] text-muted-foreground">
              Total Customers
            </span>
          </div>
        </div>

        <ul className="mt-5 w-full space-y-2">
          <SegmentRow
            color={PALETTE.returning}
            label="Returning"
            value={returning}
            total={total}
          />
          <SegmentRow
            color={PALETTE.new}
            label="New this month"
            value={newThisMonth}
            total={total}
          />
          <SegmentRow
            color={PALETTE.inactive}
            label="No orders"
            value={inactive}
            total={total}
          />
        </ul>
      </div>
    </div>
  );
}

function SegmentRow({
  color,
  label,
  value,
  total,
}: {
  color: string;
  label: string;
  value: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <li className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-muted-foreground">{label}</span>
      </span>
      <span className="flex items-center gap-3">
        <span className="text-muted-foreground">{pct}%</span>
        <span className="price font-medium">{value}</span>
      </span>
    </li>
  );
}