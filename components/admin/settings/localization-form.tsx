"use client";

import { useState } from "react";
import { Globe2, Loader2 } from "lucide-react";
import type { StoreSettingsData } from "@/lib/settings";
import { inputClass, SaveBar } from "./store-info-form";

interface Props {
  settings: StoreSettingsData;
  onSave: (patch: Partial<StoreSettingsData>) => Promise<boolean>;
}

const TIMEZONES = [
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Nairobi",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Tokyo",
  "UTC",
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "ZAR", label: "ZAR — South African Rand" },
];

export function LocalizationForm({ settings, onSave }: Props) {
  const [timezone, setTimezone] = useState(settings.timezone);
  const [language, setLanguage] = useState(settings.language);
  const [currency, setCurrency] = useState(settings.currency);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ timezone, language, currency });
    setSaving(false);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-surface-elevated p-5"
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface">
          <Globe2 className="h-3.5 w-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Localization</h2>
          <p className="text-xs text-muted-foreground">
            Set your timezone, language, and currency.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Timezone">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={inputClass}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Currency">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={inputClass}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <SaveBar saving={saving} />
    </form>
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