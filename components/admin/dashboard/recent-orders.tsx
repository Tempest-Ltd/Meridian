"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";
import { formatPrice, formatDate } from "@/lib/utils";

export interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string; imageUrl: string | null } | null;
  items: { id: string }[];
}

const STATUS_MAP: Record<
  string,
  { variant: "success" | "info" | "warning" | "neutral" | "purple"; label: string }
> = {
  PENDING: { variant: "warning", label: "Pending" },
  PAID: { variant: "purple", label: "Paid" },
  PROCESSING: { variant: "warning", label: "Processing" },
  SHIPPED: { variant: "info", label: "Shipped" },
  DELIVERED: { variant: "success", label: "Delivered" },
  CANCELLED: { variant: "neutral", label: "Cancelled" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-lg">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {orders.map((o) => {
            const meta = STATUS_MAP[o.status] ?? STATUS_MAP.PENDING;
            const name = o.user?.name ?? "Guest";
            return (
              <Link
                key={o.id}
                href="/admin/orders"
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface/50"
              >
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-[10px] font-semibold text-white">
                  {o.user?.imageUrl ? (
                    <Image
                      src={o.user.imageUrl}
                      alt={name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    initials(name)
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{name}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">
                    #{o.orderNumber} · {formatDate(o.createdAt)}
                  </p>
                </div>

                <StatusPill variant={meta.variant} dot>
                  {meta.label}
                </StatusPill>

                <span className="price hidden text-xs font-medium sm:block">
                  {formatPrice(o.total)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}