import Link from "next/link";
import Image from "next/image";
import { ArrowRight, RotateCcw, Headphones } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [orderCount, spentAgg, recentOrders, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.order.aggregate({
      where: { userId: user.id, status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.address.count({ where: { userId: user.id } }),
  ]);

  const totalSpent = Number(spentAgg._sum.total ?? 0);
  const firstName = (user.name ?? "there").split(" ")[0];
  const memberSince = formatDate(user.createdAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="eyebrow">My Account</span>
            <span className="h-px w-8 bg-[#c9a227]/40" />
          </div>
          <h1 className="mt-3 font-display text-2xl md:text-4xl">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Manage your account, track your orders, and keep your information
            up to date.
          </p>
        </div>
        <Link
          href="/account/profile"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface-elevated px-4 text-sm font-medium transition-colors hover:border-[#1b2e24]"
        >
          Edit Profile
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {/* Profile card — responsive layout */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-5 md:p-6">
            {/* Top: avatar + name/email — stacked on mobile */}
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-5 md:text-left">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] font-display text-xl text-white">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name ?? ""}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  (user.name ?? "M").slice(0, 1).toUpperCase()
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <p className="font-display text-lg">
                    {user.name ?? "Member"}
                  </p>
                  <span className="rounded-full bg-[#f5e9c8] px-2.5 py-0.5 text-[10px] font-semibold text-[#8a6d1a]">
                    Verified
                  </span>
                </div>
                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {user.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* Account status — full width below */}
            <div className="mt-5 rounded-lg bg-surface px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Account Status
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <p className="text-sm font-medium">Active</p>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Your account is in good standing.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 md:flex md:gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Orders
                </p>
                <p className="price mt-1 text-lg font-semibold">{orderCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saved Addresses
                </p>
                <p className="price mt-1 text-lg font-semibold">
                  {addressCount}
                </p>
              </div>
              <div className="col-span-2 md:ml-auto md:col-span-1 md:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Lifetime Spend
                </p>
                <p className="price mt-1 text-lg font-semibold">
                  {formatPrice(totalSpent)}
                </p>
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="rounded-2xl border border-border bg-surface-elevated">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <p className="font-display text-lg">No orders yet.</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  When you place your first order, it&apos;ll show up here.
                </p>
                <Link
                  href="/shop"
                  className="mt-5 inline-flex h-10 items-center rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((o) => {
                  const meta = STATUS_MAP[o.status] ?? STATUS_MAP.PENDING;
                  const first = o.items[0];
                  return (
                    <Link
                      key={o.id}
                      href={`/account/orders/${o.orderNumber}`}
                      className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface/50 md:flex-row md:items-center md:gap-4"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        {first && (
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
                            <Image
                              src={first.image}
                              alt={first.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs font-semibold">
                            #{o.orderNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(o.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusPill variant={meta.variant} dot>
                          {meta.label}
                        </StatusPill>
                        <span className="price text-sm font-medium">
                          {formatPrice(Number(o.total))}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium">
                          View <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold">Quick Actions</h3>
            <ul className="mt-4 space-y-1">
              {[
                {
                  icon: RotateCcw,
                  label: "Track an Order",
                  sub: "View your latest order status",
                  href: "/account/orders",
                },
                {
                  icon: RotateCcw,
                  label: "Return or Exchange",
                  sub: "Start a return request",
                  href: "/account/support",
                },
                {
                  icon: Headphones,
                  label: "Contact Support",
                  sub: "Get help from our team",
                  href: "/account/support",
                },
              ].map(({ icon: Icon, label, sub, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-surface"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Saved Addresses</h3>
              <Link
                href="/account/addresses"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Manage
              </Link>
            </div>
            {addressCount === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                No addresses saved yet.
              </p>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                {addressCount} {addressCount === 1 ? "address" : "addresses"}{" "}
                saved
              </p>
            )}
            <Link
              href="/account/addresses"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-medium transition-colors hover:border-[#1b2e24]"
            >
              + Add Address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}