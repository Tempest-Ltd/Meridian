"use client";

interface Bucket {
  label: string;
  count: number;
}

export function OrderValueDistribution({ buckets }: { buckets: Bucket[] }) {
  const max = Math.max(...buckets.map((b) => b.count), 1);
  const total = buckets.reduce((s, b) => s + b.count, 0);

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Order Value Distribution</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        How much customers spend per order
      </p>

      {total === 0 ? (
        <div className="mt-8 py-8 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {buckets.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="price font-medium">{b.count}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-[#1b2e24] transition-all"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}