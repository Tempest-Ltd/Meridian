"use client";


export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Download, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  OrderTable,
  type TableOrder,
} from "@/components/admin/orders/order-table";
import {
  OrderStatusTabs,
  type StatusTab,
} from "@/components/admin/orders/order-status-tabs";
import { OrderDetailDrawer } from "@/components/admin/orders/order-detail-drawer";
import { formatPrice } from "@/lib/utils";

interface OrderStats {
  total: number;
  revenue: number;
  customers: number;
  statusCounts: Record<string, number>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    revenue: 0,
    customers: 0,
    statusCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<StatusTab>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders ?? []);
      setStats(data.stats ?? stats);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab !== "ALL" && o.status !== tab) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        (o.user?.email ?? "").toLowerCase().includes(q) ||
        (o.user?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [orders, tab, search]);

  const exportCSV = () => {
    const rows = [
      ["Order", "Date", "Customer", "Email", "Items", "Total", "Status"],
      ...filtered.map((o) => [
        o.orderNumber,
        new Date(o.createdAt).toISOString().slice(0, 10),
        o.user?.name ?? "Guest",
        o.user?.email ?? "",
        String(o.items.length),
        o.total.toFixed(2),
        o.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meridian-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} orders`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Orders</p>
            <h1 className="mt-2 font-display text-3xl">Manage Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View, filter, and update order status.
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 text-sm font-medium transition-colors hover:border-[#1b2e24] disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* KPI row */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Kpi label="Total Orders" value={String(stats.total)} />
          <Kpi label="Total Revenue" value={formatPrice(stats.revenue)} />
          <Kpi label="Customers" value={String(stats.customers)} />
        </div>

        <OrderStatusTabs
          active={tab}
          onChange={setTab}
          counts={stats.statusCounts}
          total={stats.total}
        />

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders…"
              className="h-full flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <OrderTable
          orders={filtered}
          selectedId={selectedId}
          onSelect={(o) => setSelectedId(o.id)}
          loading={loading}
        />
      </div>

      <OrderDetailDrawer
        orderId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdated={load}
      />
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="price mt-1.5 font-display text-xl">{value}</p>
    </div>
  );
}