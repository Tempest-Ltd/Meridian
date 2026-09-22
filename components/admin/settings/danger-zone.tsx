"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Counts = {
  orders: number;
  orderItems: number;
  products: number;
  categories: number;
  addresses: number;
  reviews: number;
  carts: number;
  wishlists: number;
  notifications: number;
  newsletter: number;
};

interface PreviewData {
  storeName: string;
  counts: Counts;
  usersKept: number;
}

export function DangerZone() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [gate, setGate] = useState<1 | 2 | 3>(1);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [acceptLoss, setAcceptLoss] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch preview counts when the modal opens
  useEffect(() => {
    if (!open || preview) return;
    fetch("/api/admin/settings/danger/preview")
      .then((r) => r.json())
      .then(setPreview)
      .catch(() => toast.error("Couldn't load impact preview"));
  }, [open, preview]);

  const reset = () => {
    setOpen(false);
    setGate(1);
    setNameInput("");
    setUnderstood(false);
    setAcceptLoss(false);
  };

  const handleDelete = async () => {
    if (!understood || !acceptLoss) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings/danger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmName: nameInput,
          understood: true,
          acceptLoss: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NAME_MISMATCH") {
          toast.error(`Name must match exactly: "${data.expected}"`);
          setGate(2);
        } else {
          toast.error("Delete failed. Try again.");
        }
        setLoading(false);
        return;
      }

      const d = data.deleted;
      toast.success(
        `Store reset. ${d.orders} orders, ${d.products} products, ${d.categories} categories deleted.`
      );
      reset();
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-lg text-rose-900">Danger Zone</h3>
            <p className="mt-1 text-sm text-rose-700/80">
              These actions are permanent and cannot be undone.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-rose-200 bg-surface-elevated p-4">
              <div>
                <p className="text-sm font-medium">Delete Store</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Permanently delete all orders, products, and categories.
                </p>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-rose-600 px-5 text-sm font-medium text-white transition-colors hover:bg-rose-700"
              >
                Delete Store
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-elevated p-6 shadow-2xl">
            {/* Gate 1 */}
            {gate === 1 && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    </span>
                    <h2 className="font-display text-xl">
                      This will permanently delete
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {!preview ? (
                  <div className="mt-6 flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <ul className="mt-5 space-y-2 rounded-lg bg-rose-50 p-4 text-sm">
                      <Line count={preview.counts.orders} label="orders" />
                      <Line count={preview.counts.orderItems} label="order items" />
                      <Line count={preview.counts.products} label="products" />
                      <Line count={preview.counts.categories} label="categories" />
                      <Line count={preview.counts.addresses} label="customer addresses" />
                      <Line count={preview.counts.reviews} label="reviews" />
                      <Line count={preview.counts.carts} label="cart items" />
                      <Line count={preview.counts.wishlists} label="wishlist items" />
                      <Line count={preview.counts.notifications} label="notifications" />
                      <Line count={preview.counts.newsletter} label="newsletter subscribers" />
                    </ul>

                    <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                      ✓ Your {preview.usersKept} user{" "}
                      {preview.usersKept === 1 ? "account" : "accounts"} will be
                      kept. You won&apos;t be locked out.
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={reset}
                        className="h-10 rounded-md border border-border bg-surface-elevated px-5 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setGate(2)}
                        className="h-10 rounded-md bg-rose-600 px-5 text-sm font-medium text-white hover:bg-rose-700"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Gate 2 */}
            {gate === 2 && preview && (
              <>
                <h2 className="font-display text-xl">
                  Type the store name to confirm
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Type <strong>{preview.storeName}</strong> exactly as shown.
                </p>

                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={preview.storeName}
                  className="mt-5 h-11 w-full rounded-md border border-border bg-surface-elevated px-4 text-sm outline-none focus:border-rose-500"
                />

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setGate(1)}
                    className="h-10 rounded-md border border-border bg-surface-elevated px-5 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    disabled={
                      nameInput.trim().toLowerCase() !==
                      preview.storeName.trim().toLowerCase()
                    }
                    onClick={() => setGate(3)}
                    className="h-10 rounded-md bg-rose-600 px-5 text-sm font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* Gate 3 */}
            {gate === 3 && (
              <>
                <h2 className="font-display text-xl">Final confirmation</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Two final acknowledgements before we proceed.
                </p>

                <div className="mt-5 space-y-3">
                  <Checkbox
                    checked={understood}
                    onChange={setUnderstood}
                    label="I understand this action is permanent and cannot be undone."
                  />
                  <Checkbox
                    checked={acceptLoss}
                    onChange={setAcceptLoss}
                    label="I have a database backup or I accept the risk of losing all data."
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setGate(2)}
                    disabled={loading}
                    className="h-10 rounded-md border border-border bg-surface-elevated px-5 text-sm font-medium disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    disabled={!understood || !acceptLoss || loading}
                    onClick={handleDelete}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium text-white transition-colors",
                      understood && acceptLoss && !loading
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "cursor-not-allowed bg-rose-300"
                    )}
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Deleting…" : "Delete Everything"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Line({ count, label }: { count: number; label: string }) {
  if (count === 0) return null;
  return (
    <li className="flex items-center justify-between">
      <span className="text-rose-900">
        {count} {label}
      </span>
    </li>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface-elevated p-4 transition-colors hover:border-rose-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-rose-600"
      />
      <span className="text-sm leading-snug">{label}</span>
    </label>
  );
}