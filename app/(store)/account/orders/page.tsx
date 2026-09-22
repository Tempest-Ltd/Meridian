import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, Headphones, RotateCcw, Package } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/queries/orders";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const orders = await getUserOrders(user.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow">My Orders</span>
          <span className="h-px w-8 bg-[#c9a227]/40" />
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Order History
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          View your past orders, track shipments, and manage your purchases all
          in one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-elevated py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
                <Package className="h-6 w-6 text-muted-foreground" />
              </span>
              <p className="mt-5 font-display text-xl">No orders yet.</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your order history will appear here once you place your first
                order.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex h-11 items-center rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated">
              {/* Header row — desktop only */}
              <div className="hidden items-center gap-4 border-b border-border bg-surface/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:flex">
                <span className="w-[110px] shrink-0">Order</span>
                <span className="min-w-0 flex-1">Items</span>
                <span className="w-[110px] shrink-0 text-right">Total</span>
                <span className="w-[110px] shrink-0">Status</span>
                <span className="w-[110px] shrink-0 text-right">Action</span>
              </div>

              <div className="divide-y divide-border">
                {orders.map((o) => {
                  const meta = STATUS_MAP[o.status] ?? STATUS_MAP.PENDING;
                  const totalItems = o.items.reduce(
                    (s, i) => s + i.quantity,
                    0
                  );
                  return (
                    <div
                      key={o.id}
                      className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface/40 md:flex-row md:items-center md:gap-4"
                    >
                      {/* Order number + date */}
                      <div className="w-full md:w-[110px] md:shrink-0">
                        <p className="font-mono text-xs font-semibold">
                          #{o.orderNumber}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatDate(o.createdAt)}
                        </p>
                      </div>

                      {/* Items — thumbnails + count */}
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex -space-x-2">
                          {o.items.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="relative h-9 w-9 overflow-hidden rounded-md border-2 border-white bg-surface"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {o.items.length > 3 && (
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-md border-2 border-white bg-surface text-[10px] font-semibold text-muted-foreground">
                              +{o.items.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="flex w-full items-center justify-between md:w-[110px] md:shrink-0 md:justify-end">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:hidden">
                          Total
                        </span>
                        <span className="price text-sm font-semibold">
                          {formatPrice(Number(o.total))}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex w-full items-center justify-between md:w-[110px] md:shrink-0 md:justify-start">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground md:hidden">
                          Status
                        </span>
                        <StatusPill variant={meta.variant} dot>
                          {meta.label}
                        </StatusPill>
                      </div>

                      {/* View Details */}
                      <div className="md:w-[110px] md:shrink-0 md:text-right">
                        <Link
                          href={`/account/orders/${o.orderNumber}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium transition-colors hover:border-[#1b2e24]"
                        >
                          View
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                <span>
                  Showing {orders.length} of {orders.length}{" "}
                  {orders.length === 1 ? "order" : "orders"}
                </span>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold">Need help?</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              We&apos;re here to make things right.
            </p>
            <ul className="mt-4 space-y-1">
              {[
                {
                  icon: Headphones,
                  title: "Track Order",
                  sub: "Get real-time updates",
                  href: "/account/support",
                },
                {
                  icon: RotateCcw,
                  title: "Return or Exchange",
                  sub: "Start a return request",
                  href: "/account/support",
                },
                {
                  icon: Headphones,
                  title: "Contact Support",
                  sub: "Chat with our team",
                  href: "/account/support",
                },
              ].map(({ icon: Icon, title, sub, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-surface"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}