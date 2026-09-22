import { Calendar } from "lucide-react";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { OrderStatusDonut } from "@/components/admin/dashboard/order-status-donut";
import { RecentOrders } from "@/components/admin/dashboard/recent-orders";
import { TopProducts } from "@/components/admin/dashboard/top-products";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { getDashboardBundle } from "@/lib/queries/admin";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { kpis, revenueSeries, statusBreakdown, recentOrders, topProducts } =
    await getDashboardBundle();

  // Serialize dates for client components
  const ordersForClient = recentOrders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
    user: o.user
      ? { name: o.user.name, email: o.user.email, imageUrl: o.user.imageUrl }
      : null,
    items: o.items.map((i) => ({ id: i.id })),
  }));

  const rangeLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const startLabel = new Date(
    Date.now() - 6 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Welcome back, Admin</p>
          <h1 className="mt-2 font-display text-3xl">
            Here&apos;s what&apos;s happening today.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your sales, manage products, keep your business running.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-2 text-xs">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {startLabel} – {rangeLabel}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={formatPrice(kpis.revenue.value)}
          deltaPct={kpis.revenue.deltaPct}
          direction={kpis.revenue.direction}
          sparkline={kpis.revenue.sparkline}
          accentColor="#10b981"
        />
        <KpiCard
          label="Total Orders"
          value={String(kpis.orders.value)}
          deltaPct={kpis.orders.deltaPct}
          direction={kpis.orders.direction}
          sparkline={kpis.orders.sparkline}
          accentColor="#f59e0b"
        />
        <KpiCard
          label="Total Products"
          value={String(kpis.products.value)}
          deltaPct={kpis.products.deltaPct}
          direction={kpis.products.direction}
          sparkline={kpis.products.sparkline}
          accentColor="#2563eb"
        />
        <KpiCard
          label="Total Users"
          value={String(kpis.users.value)}
          deltaPct={kpis.users.deltaPct}
          direction={kpis.users.direction}
          sparkline={kpis.users.sparkline}
          accentColor="#7c3aed"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <RevenueChart series={revenueSeries} />
        <QuickActions />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <RecentOrders orders={ordersForClient} />
        <OrderStatusDonut slices={statusBreakdown} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <TopProducts products={topProducts} />
        <div />
      </div>
    </div>
  );
}