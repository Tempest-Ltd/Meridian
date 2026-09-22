"use client";

import { useState } from "react";
import { Settings2, Loader2, AlertTriangle } from "lucide-react";
import type { StoreSettingsData } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { inputClass, SaveBar } from "./store-info-form";

interface Props {
  settings: StoreSettingsData;
  onSave: (patch: Partial<StoreSettingsData>) => Promise<boolean>;
}

const COUNTRIES = [
  { value: "NG", label: "Nigeria" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
];

const DATE_FORMATS = [
  { value: "MMM d, yyyy", label: "Apr 20, 2025" },
  { value: "dd/MM/yyyy", label: "20/04/2025" },
  { value: "MM/dd/yyyy", label: "04/20/2025" },
  { value: "yyyy-MM-dd", label: "2025-04-20" },
];

export function StorePreferences({ settings, onSave }: Props) {
  const [storeStatus, setStoreStatus] = useState(settings.storeStatus);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [defaultCountry, setDefaultCountry] = useState(settings.defaultCountry);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      storeStatus,
      maintenanceMode,
      defaultCountry,
      dateFormat,
    });
    setSaving(false);
  };

  const isLive = storeStatus === "LIVE";

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-surface-elevated p-5"
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface">
          <Settings2 className="h-3.5 w-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Store Preferences</h2>
          <p className="text-xs text-muted-foreground">
            Customize how your store works and appears.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <ToggleRow
          title="Store Status"
          description={
            isLive
              ? "Your store is currently live and accepting orders."
              : "Your store is closed. Customers cannot place orders."
          }
          checked={isLive}
          onToggle={(v) => setStoreStatus(v ? "LIVE" : "CLOSED")}
          label={isLive ? "Live" : "Closed"}
        />

        <div className="border-t border-border" />

        <div>
          <ToggleRow
            title="Maintenance Mode"
            description="Temporarily hide your store from customers."
            checked={maintenanceMode}
            onToggle={setMaintenanceMode}
            label={maintenanceMode ? "On" : "Off"}
          />
          {maintenanceMode && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Non-admin visitors are being redirected to the maintenance
                page. Only you and other admins can see the store right now.
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Default Country">
            <select
              value={defaultCountry}
              onChange={(e) => setDefaultCountry(e.target.value)}
              className={inputClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date Format">
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className={inputClass}
            >
              {DATE_FORMATS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <SaveBar saving={saving} />
    </form>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onToggle,
  label,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onToggle(!checked)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            checked ? "bg-[#1b2e24]" : "bg-[#e7e5e4]"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-surface-elevated shadow-sm transition-transform",
              checked ? "translate-x-[22px]" : "translate-x-0.5"
            )}
          />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}