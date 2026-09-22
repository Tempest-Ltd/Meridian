"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Plus, Trash2, Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Method {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const BRAND_LABELS: Record<string, string> = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  VERVE: "Verve",
  AMEX: "Amex",
};

const BRAND_STYLES: Record<string, string> = {
  VISA: "bg-[#1a1f71] text-white",
  MASTERCARD: "bg-[#eb001b] text-white",
  VERVE: "bg-[#004b8f] text-white",
  AMEX: "bg-[#006fcf] text-white",
};

const inputClass =
  "h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";

export function PaymentMethodsManager({
  initialMethods,
}: {
  initialMethods: Method[];
}) {
  const router = useRouter();
  const [methods, setMethods] = useState<Method[]>(initialMethods);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = async () => {
    const res = await fetch("/api/payment-methods", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setMethods(data.methods ?? []);
    router.refresh();
  };

  const handleMakeDefault = async (m: Method) => {
    setBusy(m.id);
    const res = await fetch(`/api/payment-methods/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    setBusy(null);
    if (!res.ok) return toast.error("Couldn't set as default");
    toast.success("Default payment method updated");
    reload();
  };

  const handleDelete = async (m: Method) => {
    if (!confirm(`Remove ${BRAND_LABELS[m.brand]} •••• ${m.last4}?`)) return;
    setBusy(m.id);
    const res = await fetch(`/api/payment-methods/${m.id}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (!res.ok) return toast.error("Delete failed");
    toast.success("Payment method removed");
    reload();
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {methods.length} of 5 saved
        </p>
        <button
          onClick={() => setModalOpen(true)}
          disabled={methods.length >= 5}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-elevated py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </span>
          <p className="mt-5 font-display text-xl">No saved cards.</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add a card to save time at checkout. You can remove it anytime.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex flex-wrap items-center gap-4 rounded-2xl border bg-surface-elevated p-4 transition-colors",
                m.isDefault ? "border-[#c9a227]" : "border-border"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-16 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tracking-tight",
                  BRAND_STYLES[m.brand] ?? "bg-[#1b2e24] text-white"
                )}
              >
                {BRAND_LABELS[m.brand] ?? m.brand}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="price text-sm font-medium">
                    •••• {m.last4}
                  </p>
                  {m.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f5e9c8] px-2 py-0.5 text-[10px] font-medium text-[#8a6d1a]">
                      <Star className="h-2.5 w-2.5 fill-[#8a6d1a]" />
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expires {String(m.expMonth).padStart(2, "0")}/
                  {String(m.expYear).slice(-2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!m.isDefault && (
                  <button
                    onClick={() => handleMakeDefault(m)}
                    disabled={busy === m.id}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium transition-colors hover:border-[#1b2e24] disabled:opacity-50"
                  >
                    Make default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m)}
                  disabled={busy === m.id}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          reload();
        }}
        isFirst={methods.length === 0}
      />
    </>
  );
}

function AddModal({
  open,
  onClose,
  onSaved,
  isFirst,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  isFirst: boolean;
}) {
  const [brand, setBrand] = useState("VISA");
  const [last4, setLast4] = useState("");
  const [expMonth, setExpMonth] = useState("12");
  const [expYear, setExpYear] = useState(String(new Date().getFullYear() + 3));
  const [isDefault, setIsDefault] = useState(isFirst);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(last4)) {
      return toast.error("Last 4 must be 4 digits");
    }
    setSaving(true);
    const res = await fetch("/api/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand,
        last4,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        isDefault,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return toast.error(d.error ?? "Couldn't add card");
    }
    toast.success("Card added");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface-elevated p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">Add Payment Method</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-surface p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Demo mode</p>
          <p className="mt-0.5">
            We don't store real card details. Enter any 4 digits to save a
            reference card. Real payments go through Stripe at checkout.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Card Brand *
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={inputClass}
            >
              <option value="VISA">Visa</option>
              <option value="MASTERCARD">Mastercard</option>
              <option value="VERVE">Verve</option>
              <option value="AMEX">Amex</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Last 4 digits *
            </label>
            <input
              value={last4}
              onChange={(e) =>
                setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="4242"
              className={cn(inputClass, "font-mono tracking-widest")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Exp. Month *
              </label>
              <select
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                className={inputClass}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Exp. Year *
              </label>
              <select
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                className={inputClass}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const y = new Date().getFullYear() + i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface-elevated p-3">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-[#1b2e24]"
            />
            <span className="text-sm">Set as default payment method</span>
          </label>

          <div className="flex justify-end gap-2 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-md border border-border bg-surface-elevated px-5 text-sm font-medium transition-colors hover:border-[#1b2e24] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Adding…" : "Add Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}