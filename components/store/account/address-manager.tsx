"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { AddressModal, type AddressData } from "./address-modal";
import { cn } from "@/lib/utils";

interface Address extends AddressData {
  id: string;
  isDefault: boolean;
}

interface Props {
  initialAddresses: Address[];
}

export function AddressManager({ initialAddresses }: Props) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = async () => {
    const res = await fetch("/api/addresses", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setAddresses(data.addresses ?? []);
    router.refresh();
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (a: Address) => {
    setEditing(a);
    setModalOpen(true);
  };

  const handleDelete = async (a: Address) => {
    if (!confirm(`Delete "${a.name}"? This cannot be undone.`)) return;
    setBusy(a.id);
    const res = await fetch(`/api/addresses/${a.id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? "Delete failed");
      return;
    }
    toast.success("Address deleted");
    reload();
  };

  const handleMakeDefault = async (a: Address) => {
    setBusy(a.id);
    const res = await fetch(`/api/addresses/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    setBusy(null);
    if (!res.ok) {
      toast.error("Couldn't set as default");
      return;
    }
    toast.success(`${a.name} is now the default address`);
    reload();
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          onClick={handleAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-elevated py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </span>
          <p className="mt-5 font-display text-xl">No addresses yet.</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add a shipping address to make checkout faster.
          </p>
          <button
            onClick={handleAdd}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
          >
            <Plus className="h-4 w-4" />
            Add your first address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={cn(
                "rounded-2xl border bg-surface-elevated p-5 transition-colors",
                a.isDefault ? "border-[#c9a227]" : "border-border"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base">{a.name}</p>
                      {a.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f5e9c8] px-2 py-0.5 text-[10px] font-medium text-[#8a6d1a]">
                          <Star className="h-2.5 w-2.5 fill-[#8a6d1a]" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}
                      <br />
                      {a.city}
                      {a.state ? `, ${a.state}` : ""} {a.postalCode}
                      <br />
                      {a.country}
                    </p>
                    {a.phone && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!a.isDefault && (
                    <button
                      onClick={() => handleMakeDefault(a)}
                      disabled={busy === a.id}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium transition-colors hover:border-[#1b2e24] disabled:opacity-50"
                    >
                      Make default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(a)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium transition-colors hover:border-[#1b2e24]"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a)}
                    disabled={busy === a.id}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSaved={() => {
          setModalOpen(false);
          setEditing(null);
          reload();
        }}
        initial={editing}
        isFirst={addresses.length === 0}
      />
    </>
  );
}