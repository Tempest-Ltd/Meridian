import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, Truck, Package } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";
import { getCurrentUser } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/queries/orders";
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

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const order = await getOrderByNumber(user.id, params.id);
  if (!order) notFound();

  const meta = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING;
  const address = order.shippingAddress as Record<string, string>;

  const TIMELINE = [
    { label: "Order placed", done: true },
    { label: "Payment confirmed", done: true },
    { label: "Shipped", done: ["SHIPPED", "DELIVERED"].includes(order.status) },
    { label: "Delivered", done: order.status === "DELIVERED" },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow">Order</span>
            <span className="h-px w-8 bg-[#c9a227]/40" />
          </div>
          <h1 className="mt-3 font-mono font-display text-2xl md:text-3xl">
            #{order.orderNumber}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusPill variant={meta.variant} dot>
          {meta.label}
        </StatusPill>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold">Tracking</h2>
            <ol className="mt-5 space-y-4">
              {TIMELINE.map((t, i) => (
                <li key={t.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        "flex h-7 w-7 items-center justify-center rounded-full " +
                        (t.done
                          ? "bg-[#1b2e24] text-white"
                          : "border border-border bg-white text-muted-foreground")
                      }
                    >
                      {t.done ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      )}
                    </span>
                    {i < TIMELINE.length - 1 && (
                      <span className="mt-1 h-8 w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{t.label}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold">
              Items ({order.items.length})
            </h2>
            <ul className="mt-5 divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.color ? `${item.color} · ` : ""}Qty {item.quantity}
                    </p>
                  </div>
                  <span className="price self-center text-sm font-semibold">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold">Order Summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="price">{formatPrice(Number(order.subtotal))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="price">
                  {Number(order.shipping) === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    formatPrice(Number(order.shipping))
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="price">{formatPrice(Number(order.tax))}</dd>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <dt className="font-display text-base">Total</dt>
                <dd className="price font-display text-lg font-semibold">
                  {formatPrice(Number(order.total))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold">Shipping Address</h3>
            <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
              {address.name}
              {"\n"}
              {address.line1}
              {address.line2 ? `\n${address.line2}` : ""}
              {"\n"}
              {address.city}
              {address.state ? `, ${address.state}` : ""} {address.postalCode}
              {"\n"}
              {address.country}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">{order.email}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold">Need Help?</h3>
            <ul className="mt-4 space-y-1">
              {[
                { icon: Truck, label: "Track shipment", href: "/account/support" },
                { icon: Package, label: "Start a return", href: "/account/support" },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-colors hover:bg-surface"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{label}</span>
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