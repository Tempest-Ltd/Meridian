import { Calendar } from "lucide-react";
import { RevenueOverview } from "@/components/admin/analytics/revenue-overview";
import { SalesByCategory } from "@/components/admin/analytics/sales-by-category";
import { OrderValueDistribution } from "@/components/admin/analytics/order-value-distribution";
import { ConversionMetrics } from "@/components/admin/analytics/conversion-rate";
import { TopProducts } from "@/components/admin/dashboard/top-products";
import { getAnalyticsBundle } from "@/lib/queries/admin";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const bundle = await getAnalyticsBundle();
  const kpis = bundle.kpis[30];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1 className="mt-2 font-display text-3xl">
            Performance Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your store&apos;s growth, revenue, and key metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-2 text-xs">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiBox
          label="Total Revenue"
          value={formatPrice(kpis.revenue.value)}
          delta={kpis.revenue.deltaPct}
          direction={kpis.revenue.direction}
        />
        <KpiBox
          label="Total Orders"
          value={String(kpis.orders.value)}
          delta={kpis.orders.deltaPct}
          direction={kpis.orders.direction}
        />
        <KpiBox
          label="New Customers"
          value={String(kpis.customers.value)}
          delta={kpis.customers.deltaPct}
          direction={kpis.customers.direction}
        />
        <KpiBox
          label="Avg Order Value"
          value={formatPrice(kpis.avgOrderValue.value)}
          delta={kpis.avgOrderValue.deltaPct}
          direction={kpis.avgOrderValue.direction}
        />
      </div>

      <RevenueOverview series={bundle.series} />

      <div className="grid gap-5 xl:grid-cols-2">
        <SalesByCategory slices={bundle.salesByCategory} />
        <OrderValueDistribution buckets={bundle.valueDistribution} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ConversionMetrics
          funnel={{
            revenue: kpis.revenue.value,
            orders: kpis.orders.value,
            customers: kpis.customers.value,
            avgOrderValue: kpis.avgOrderValue.value,
          }}
        />
        <TopProducts products={bundle.topProducts} />
      </div>
    </div>
  );
}

function KpiBox({
  label,
  value,
  delta,
  direction,
}: {
  label: string;
  value: string;
  delta: number;
  direction: "up" | "down" | "flat";
}) {
  const color =
    direction === "up"
      ? "text-emerald-600"
      : direction === "down"
      ? "text-rose-600"
      : "text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="price mt-2 font-display text-2xl">{value}</p>
      <p className={`mt-1 text-xs font-medium ${color}`}>
        {direction === "flat" ? "0" : `${direction === "up" ? "↑" : "↓"} ${delta}%`}{" "}
        <span className="text-muted-foreground">vs. previous 30 days</span>
      </p>
    </div>
  );
}