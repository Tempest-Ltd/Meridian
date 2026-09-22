import { MoreHorizontal } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";
import { formatPrice } from "@/lib/utils";

const USERS = [
  { name: "John Doe", email: "john.doe@example.com", orders: 5, spent: 487, status: "Active", joined: "Apr 12, 2025" },
  { name: "Sarah Johnson", email: "sarah.j@example.com", orders: 3, spent: 289, status: "Active", joined: "Apr 10, 2025" },
  { name: "Mike Chen", email: "mike.chen@example.com", orders: 7, spent: 763, status: "Active", joined: "Apr 8, 2025" },
  { name: "Emily Davis", email: "emily.d@example.com", orders: 2, spent: 142, status: "Inactive", joined: "Apr 6, 2025" },
  { name: "David Wilson", email: "david.w@example.com", orders: 4, spent: 376, status: "Active", joined: "Apr 3, 2025" },
  { name: "Jessica Brown", email: "jess.b@example.com", orders: 6, spent: 628, status: "Active", joined: "Apr 1, 2025" },
  { name: "Daniel Garcia", email: "daniel.g@example.com", orders: 1, spent: 98, status: "Inactive", joined: "Mar 28, 2025" },
  { name: "Sophia Martinez", email: "sophia.m@example.com", orders: 3, spent: 267, status: "Active", joined: "Mar 25, 2025" },
];

export function CustomerTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[32px_1fr_70px_90px_90px_110px_100px] items-center gap-3 border-b border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" />
            <span>Customer</span>
            <span>Orders</span>
            <span>Spent</span>
            <span>Status</span>
            <span>Joined</span>
            <span className="text-right">Actions</span>
          </div>

          <ul className="divide-y divide-border">
            {USERS.map((u) => (
              <li
                key={u.email}
                className="grid grid-cols-[32px_1fr_70px_90px_90px_110px_100px] items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/40"
              >
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-border"
                />

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-semibold">
                    {u.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{u.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {u.email}
                    </p>
                  </div>
                </div>

                <span className="text-xs tabular-nums">{u.orders}</span>

                <span className="price text-xs font-medium">
                  {formatPrice(u.spent)}
                </span>

                <StatusPill
                  variant={u.status === "Active" ? "success" : "neutral"}
                  dot
                >
                  {u.status}
                </StatusPill>

                <span className="text-[11px] text-muted-foreground">
                  {u.joined}
                </span>

                <div className="flex items-center justify-end gap-1">
                  <button className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-[#1b2e24]">
                    View
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
            <span>Showing 1–8 of 2,843 customers</span>
            <div className="flex items-center gap-1">
              {["‹", "1", "2", "3", "4", "5", "›"].map((x, i) => (
                <button
                  key={i}
                  className={
                    "flex h-7 w-7 items-center justify-center rounded text-[11px] transition-colors " +
                    (x === "1"
                      ? "bg-[#1b2e24] text-white"
                      : "border border-border bg-surface-elevated hover:border-[#1b2e24]")
                  }
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}