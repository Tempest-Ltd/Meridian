"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

export interface AddressData {
  name: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initial?: (AddressData & { id: string }) | null;
  isFirst?: boolean;
}

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
];

const empty: AddressData = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "NG",
};

const inputClass =
  "h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";

export function AddressModal({
  open,
  onClose,
  onSaved,
  initial,
  isFirst,
}: Props) {
  const [data, setData] = useState<AddressData>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setData({
        name: initial.name,
        phone: initial.phone ?? "",
        line1: initial.line1,
        line2: initial.line2 ?? "",
        city: initial.city,
        state: initial.state ?? "",
        postalCode: initial.postalCode ?? "",
        country: initial.country,
      });
    } else {
      setData(empty);
    }
  }, [open, initial]);

  if (!open) return null;

  const isEdit = !!initial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name.trim()) return toast.error("Full name is required");
    if (!data.line1.trim()) return toast.error("Address line 1 is required");
    if (!data.city.trim()) return toast.error("City is required");

    setSaving(true);

    const payload = {
      name: data.name.trim(),
      phone: data.phone?.trim() || null,
      line1: data.line1.trim(),
      line2: data.line2?.trim() || null,
      city: data.city.trim(),
      state: data.state?.trim() || null,
      postalCode: data.postalCode?.trim() || null,
      country: data.country,
      isDefault: isFirst && !isEdit ? true : undefined,
    };

    try {
      const url = isEdit ? `/api/addresses/${initial!.id}` : "/api/addresses";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error ?? "Save failed");
        setSaving(false);
        return;
      }
      toast.success(isEdit ? "Address updated" : "Address added");
      onSaved();
    } catch {
      toast.error("Something went wrong");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface-elevated p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Full Name *
            </label>
            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="John Doe"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Phone Number
            </label>
            <input
              value={data.phone ?? ""}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="+234 801 234 5678"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Address Line 1 *
            </label>
            <input
              value={data.line1}
              onChange={(e) => setData({ ...data, line1: e.target.value })}
              placeholder="12 Victoria Island Road"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Address Line 2
            </label>
            <input
              value={data.line2 ?? ""}
              onChange={(e) => setData({ ...data, line2: e.target.value })}
              placeholder="Apartment, suite, etc. (optional)"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                City *
              </label>
              <input
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                placeholder="Lagos"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                State
              </label>
              <input
                value={data.state ?? ""}
                onChange={(e) => setData({ ...data, state: e.target.value })}
                placeholder="Lagos State"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Postal Code
              </label>
              <input
                value={data.postalCode ?? ""}
                onChange={(e) =>
                  setData({ ...data, postalCode: e.target.value })
                }
                placeholder="101241"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium">
                Country *
              </label>
              <select
                value={data.country}
                onChange={(e) => setData({ ...data, country: e.target.value })}
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}