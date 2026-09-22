"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Store as StoreIcon } from "lucide-react";
import { toast } from "sonner";
import type { StoreSettingsData } from "@/lib/settings";

interface Props {
  settings: StoreSettingsData;
  onSave: (patch: Partial<StoreSettingsData>) => Promise<boolean>;
}

export function StoreInfoForm({ settings, onSave }: Props) {
  const [name, setName] = useState(settings.name);
  const [url, setUrl] = useState(settings.url ?? "");
  const [email, setEmail] = useState(settings.email ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logoUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadLogo = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Not an image");
    if (file.size > 2 * 1024 * 1024) return toast.error("Logo must be under 2MB");

    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "meridian/branding");

    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) return toast.error(data.error ?? "Upload failed");
    setLogoUrl(data.url);
    toast.success("Logo uploaded");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSave({
      name: name.trim(),
      url: url.trim() || null,
      email: email.trim() || null,
      logoUrl,
    });
    setSaving(false);
    return ok;
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-surface-elevated p-5"
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface">
          <StoreIcon className="h-3.5 w-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Store Information</h2>
          <p className="text-xs text-muted-foreground">
            Update your basic store information and branding.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        {/* Logo */}
        <div className="md:w-40">
          <label className="mb-1.5 block text-xs font-medium">Logo</label>
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Store logo"
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="text-[10px] text-muted-foreground">No logo</span>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <label className="mt-2 block cursor-pointer rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-center text-xs font-medium transition-colors hover:border-[#1b2e24]">
            Change Logo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadLogo(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <Field label="Store Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="Store URL">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://meridian.com"
              className={inputClass}
            />
          </Field>
          <Field label="Business Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="support@meridian.com"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <SaveBar saving={saving} />
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}

export function SaveBar({ saving }: { saving: boolean }) {
  return (
    <div className="mt-5 flex justify-end border-t border-border pt-4">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-xs font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60"
      >
        {saving && <Loader2 className="h-3 w-3 animate-spin" />}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

export { inputClass };