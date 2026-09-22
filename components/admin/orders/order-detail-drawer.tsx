"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2, Mail, MapPin, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "@/components/shared/status-pill";
import { cn, formatPrice, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

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

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  email: string;
  createdAt: string;
  shippingAddress: Record<string, string> | null;
  user: {
    name: string | null;
    email: string;
    imageUrl: string | null;
  } | null;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string | null;
  }[];
}

interface Props {
  orderId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const inputClass =
  "h-9 w-full rounded-md border border-border bg-surface-elevated px-2.5 text-xs outline-none transition-colors focus:border-[#1b2e24]";

export function OrderDetailDrawer({ orderId, onClose, onUpdated }: Props) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable state
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [shipping, setShipping] = useState("");
  const [tax, setTax] = useState("");
  const [total, setTotal] = useState("");
  const [address, setAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const hydrate = (o: OrderDetail) => {
    setOrder(o);
    setStatus(o.status);
    setEmail(o.email);
    setSubtotal(String(o.subtotal));
    setShipping(String(o.shipping));
    setTax(String(o.tax));
    setTotal(String(o.total));
    const a = o.shippingAddress ?? {};
    setAddress({
      name: a.name ?? "",
      line1: a.line1 ?? "",
      line2: a.line2 ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      postalCode: a.postalCode ?? "",
      country: a.country ?? "",
    });
  };

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/orders/${orderId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.order) hydrate(d.order);
      })
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const dirty =
    order &&
    (status !== order.status ||
      email !== order.email ||
      Number(subtotal) !== order.subtotal ||
      Number(shipping) !== order.shipping ||
      Number(tax) !== order.tax ||
      Number(total) !== order.total ||
      JSON.stringify(address) !==
        JSON.stringify({
          name: order.shippingAddress?.name ?? "",
          line1: order.shippingAddress?.line1 ?? "",
          line2: order.shippingAddress?.line2 ?? "",
          city: order.shippingAddress?.city ?? "",
          state: order.shippingAddress?.state ?? "",
          postalCode: order.shippingAddress?.postalCode ?? "",
          country: order.shippingAddress?.country ?? "",
        }));

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        email,
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        tax: Number(tax),
        total: Number(total),
        shippingAddress: address,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Update failed");
      return;
    }
    toast.success("Order updated");
    onUpdated();
  };

  const handleReset = () => {
    if (order) hydrate(order);
  };

  // Empty state — nothing selected
  if (!orderId) {
    return (
      <aside className="xl:sticky xl:top-20 xl:self-start">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-elevated py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </span>
          <p className="mt-4 font-display text-lg">Select an order</p>
          <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
            Click any order in the table to view and edit its details.
          </p>
        </div>
      </aside>
    );
  }

  if (loading || !order) {
    return (
      <aside className="xl:sticky xl:top-20 xl:self-start">
        <div className="flex items-center justify-center rounded-xl border border-border bg-surface-elevated py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </aside>
    );
  }

  const meta = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING;

  return (
    <aside className="xl:sticky xl:top-20 xl:self-start">
      <div className="flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="font-mono text-lg font-semibold">
              #{order.orderNumber}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <StatusPill variant={meta.variant} dot>
            {meta.label}
          </StatusPill>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Customer */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-xs font-semibold text-white">
                {order.user?.imageUrl ? (
                  <Image
                    src={order.user.imageUrl}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  initials(order.user?.name ?? "Guest")
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {order.user?.name ?? "Guest"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {order.user?.email ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <EditField label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </EditField>

          {/* Email */}
          <EditField label="Contact Email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </EditField>

          {/* Shipping address */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Shipping Address
            </p>
            <div className="space-y-2">
              <input
                value={address.name}
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
                placeholder="Full name"
                className={inputClass}
              />
              <input
                value={address.line1}
                onChange={(e) =>
                  setAddress({ ...address, line1: e.target.value })
                }
                placeholder="Address line 1"
                className={inputClass}
              />
              <input
                value={address.line2}
                onChange={(e) =>
                  setAddress({ ...address, line2: e.target.value })
                }
                placeholder="Address line 2 (optional)"
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  placeholder="City"
                  className={inputClass}
                />
                <input
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  placeholder="State"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                  placeholder="Postal code"
                  className={inputClass}
                />
                <input
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  placeholder="Country"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Items (read-only — they're snapshots of the product at order time) */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Items ({order.items.length})
            </p>
            <ul className="mt-3 divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-2.5 first:pt-0">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {item.color ? `${item.color} · ` : ""}× {item.quantity}
                    </p>
                  </div>
                  <span className="price shrink-0 self-start text-xs font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Amounts — editable */}
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Totals
            </p>
            <div className="space-y-2">
              <EditRow
                label="Subtotal"
                value={subtotal}
                onChange={setSubtotal}
              />
              <EditRow
                label="Shipping"
                value={shipping}
                onChange={setShipping}
              />
              <EditRow label="Tax" value={tax} onChange={setTax} />
              <EditRow label="Total" value={total} onChange={setTotal} bold />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-border px-5 py-3">
          <button
            onClick={handleReset}
            disabled={!dirty || saving}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface-elevated text-xs font-medium transition-colors hover:border-[#1b2e24] disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={cn(
              "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors",
              dirty
                ? "bg-[#1b2e24] text-[#fbfaf7] hover:bg-[#1b2e24]/90"
                : "bg-surface text-muted-foreground"
            )}
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </aside>
  );
}

function EditField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function EditRow({
  label,
  value,
  onChange,
  bold,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={cn(
          "text-xs",
          bold ? "font-medium" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <div className="relative w-28">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          $
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputClass, "pl-6 text-right", bold && "font-semibold")}
        />
      </div>
    </div>
  );
}