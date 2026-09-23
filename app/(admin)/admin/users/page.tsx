"use client";


export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import {
  UserTable,
  type TableUser,
} from "@/components/admin/users/user-table";
import { CustomerSegments } from "@/components/admin/users/customer-segments";
import { RecentActivity } from "@/components/admin/users/recent-activity";
import { formatPrice } from "@/lib/utils";

interface UserStats {
  total: number;
  newThisMonth: number;
  returning: number;
  avgOrderValue: number;
}

export default function AdminUsersPage() {
  const { user: clerkUser } = useUser();
  const [users, setUsers] = useState<TableUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    newThisMonth: 0,
    returning: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      setUsers(
        (data.users ?? []).map((u: TableUser & { createdAt: string }) => ({
          ...u,
          createdAt:
            typeof u.createdAt === "string"
              ? u.createdAt
              : new Date(u.createdAt).toISOString(),
        }))
      );
      setStats(data.stats ?? stats);
    } catch {
      toast.error("Failed to load users");
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
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.name ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleToggleRole = async (u: TableUser) => {
    const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";
    const verb = newRole === "ADMIN" ? "Promote" : "Demote";
    if (
      !confirm(
        `${verb} ${u.name ?? u.email} to ${newRole}?`
      )
    )
      return;

    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.error === "CANNOT_DEMOTE_SELF") {
        toast.error("You can't change your own role.");
      } else {
        toast.error(data.error ?? "Update failed");
      }
      return;
    }
    toast.success(`${u.name ?? u.email} is now ${newRole}`);
    load();
  };

  const handleDelete = async (u: TableUser) => {
    if (!confirm(`Delete ${u.name ?? u.email}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      if (data.error === "USER_HAS_ORDERS") {
        toast.error("This user has orders and cannot be deleted.");
      } else if (data.error === "CANNOT_DELETE_SELF") {
        toast.error("You can't delete yourself.");
      } else {
        toast.error(data.error ?? "Delete failed");
      }
      return;
    }
    toast.success("User deleted");
    if (selectedId === u.id) setSelectedId(null);
    load();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Customers</p>
            <h1 className="mt-2 font-display text-3xl">Your Customers</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage your customer list.
            </p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Total Customers" value={String(stats.total)} />
          <Kpi label="New this month" value={String(stats.newThisMonth)} />
          <Kpi label="With orders" value={String(stats.returning)} />
          <Kpi
            label="Avg. Order Value"
            value={formatPrice(stats.avgOrderValue)}
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
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

        <UserTable
          users={filtered}
          selectedId={selectedId}
          currentUserId={clerkUser?.id ?? null}
          onSelect={(u) => setSelectedId(u.id)}
          onToggleRole={handleToggleRole}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <CustomerSegments
          total={stats.total}
          returning={stats.returning}
          newThisMonth={stats.newThisMonth}
        />
        <RecentActivity
          users={filtered.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            imageUrl: u.imageUrl,
            createdAt: u.createdAt,
            orderCount: u.orderCount,
          }))}
        />
      </aside>
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