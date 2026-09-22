"use client";

import { ArrowDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Funnel {
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
}

export function ConversionMetrics({ funnel }: { funnel: Funnel }) {
  const steps = [
    {
      label: "Registered Customers",
      value: String(funnel.customers),
      color: "#2563eb",
    },
    {
      label: "Orders Placed",
      value: String(funnel.orders),
      color: "#7c3aed",
    },
    {
      label: "Revenue Generated",
      value: formatPrice(funnel.revenue),
      color: "#10b981",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Conversion Snapshot</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        High-level flow from customer to revenue
      </p>

      <div className="mt-6 space-y-4">
        {steps.map((s, i) => (
          <div key={s.label}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="price text-sm font-semibold">{s.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${100 - i * 25}%`,
                  backgroundColor: s.color,
                  opacity: 1 - i * 0.15,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-surface p-3">
        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Avg order value:</span>
        <span className="price ml-auto text-sm font-semibold">
          {formatPrice(funnel.avgOrderValue)}
        </span>
      </div>
    </div>
  );
}