"use client";

import Image from "next/image";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { StatusPill } from "@/components/shared/status-pill";

export interface TableOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    imageUrl: string | null;
  } | null;
  items: { id: string; image: string }[];
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

interface Props {
  orders: TableOrder[];
  selectedId: string | null;
  onSelect: (order: TableOrder) => void;
  loading: boolean;
}

export function OrderTable({
  orders,
  selectedId,
  onSelect,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface-elevated py-16">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-surface-elevated py-16 text-center">
        <p className="font-display text-lg">No orders here.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Orders will appear once customers check out.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      <div className="hidden items-center gap-4 border-b border-border bg-surface/50 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:flex">
        <span className="w-[110px] shrink-0">Order</span>
        <span className="min-w-0 flex-1">Customer</span>
        <span className="w-[130px] shrink-0">Date</span>
        <span className="w-[90px] shrink-0">Items</span>
        <span className="w-[100px] shrink-0 text-right">Total</span>
        <span className="w-[120px] shrink-0">Status</span>
      </div>

      <div className="divide-y divide-border">
        {orders.map((o) => {
          const meta = STATUS_MAP[o.status] ?? STATUS_MAP.PENDING;
          const name = o.user?.name ?? "Guest";
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o)}
              className={cn(
                "flex w-full flex-col gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/50 lg:flex-row lg:items-center lg:gap-4",
                selectedId === o.id && "bg-[#f5e9c8]/40"
              )}
            >
              <span className="w-full font-mono text-xs font-semibold lg:w-[110px] lg:shrink-0">
                #{o.orderNumber}
              </span>

              <div className="flex min-w-0 flex-1 items-center gap-2.5">
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
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {o.user?.email ?? "—"}
                  </p>
                </div>
              </div>

              <span className="hidden w-[130px] shrink-0 text-xs text-muted-foreground lg:block">
                {formatDate(o.createdAt)}
              </span>

              <div className="flex -space-x-2 lg:w-[90px] lg:shrink-0">
                {o.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative h-7 w-7 overflow-hidden rounded-md border-2 border-white bg-surface"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                ))}
                {o.items.length > 3 && (
                  <span className="ml-2 self-center text-[10px] text-muted-foreground">
                    +{o.items.length - 3}
                  </span>
                )}
              </div>

              <span className="price hidden w-[100px] shrink-0 text-right text-xs font-medium lg:block">
                {formatPrice(o.total)}
              </span>

              <div className="lg:w-[120px] lg:shrink-0">
                <StatusPill variant={meta.variant} dot>
                  {meta.label}
                </StatusPill>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}