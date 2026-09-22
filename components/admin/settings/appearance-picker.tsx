"use client";

import { useEffect, useState } from "react";
import { Palette, Loader2 } from "lucide-react";
import type { StoreSettingsData } from "@/lib/settings";
import {
  THEMES,
  PRIMARY_COLOR_SWATCHES,
  type ThemeName,
} from "@/lib/themes";
import { cn } from "@/lib/utils";
import { SaveBar } from "./store-info-form";

interface Props {
  settings: StoreSettingsData;
  onSave: (patch: Partial<StoreSettingsData>) => Promise<boolean>;
}

const THEME_LABELS: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  forest: "Forest",
  minimal: "Minimal",
};

const THEME_PREVIEW: Record<ThemeName, { bg: string; fg: string }> = {
  light: { bg: "#fbfaf7", fg: "#0a0a0a" },
  dark: { bg: "#0a0a0a", fg: "#f5f5f4" },
  forest: { bg: "#0f1a13", fg: "#e8ede9" },
  minimal: { bg: "#ffffff", fg: "#171717" },
};

function applyLivePreview(theme: ThemeName, primaryColor: string) {
  const base = THEMES[theme];
  const root = document.documentElement;
  Object.entries(base).forEach(([k, v]) => root.style.setProperty(k, v));
  root.style.setProperty("--primary", primaryColor);
  root.style.setProperty("--ring", primaryColor);
}

export function AppearancePicker({ settings, onSave }: Props) {
  const [theme, setTheme] = useState<ThemeName>(settings.theme);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [saving, setSaving] = useState(false);

  const dirty =
    theme !== settings.theme || primaryColor !== settings.primaryColor;

  // Live preview as user picks
  useEffect(() => {
    applyLivePreview(theme, primaryColor);
  }, [theme, primaryColor]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ theme, primaryColor });
    setSaving(false);
  };

  const reset = () => {
    setTheme(settings.theme);
    setPrimaryColor(settings.primaryColor);
    applyLivePreview(settings.theme, settings.primaryColor);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-surface-elevated p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface">
            <Palette className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Appearance</h2>
            <p className="text-xs text-muted-foreground">
              Customize your store&apos;s look and feel.
            </p>
          </div>
        </div>

        {dirty && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Reset preview
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Theme grid */}
        <div>
          <label className="mb-2 block text-xs font-medium">Theme</label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(Object.keys(THEMES) as ThemeName[]).map((t) => {
              const active = t === theme;
              const preview = THEME_PREVIEW[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={cn(
                    "group relative rounded-lg border-2 p-2 transition-all",
                    active
                      ? "border-[#1b2e24] shadow-sm"
                      : "border-border hover:border-[#1b2e24]/30"
                  )}
                >
                  <div
                    className="aspect-square w-full rounded-md"
                    style={{ backgroundColor: preview.bg }}
                  >
                    <div className="flex h-full flex-col justify-end p-2">
                      <div
                        className="h-1 w-6 rounded-full opacity-70"
                        style={{ backgroundColor: preview.fg }}
                      />
                      <div
                        className="mt-1.5 h-1 w-4 rounded-full opacity-40"
                        style={{ backgroundColor: preview.fg }}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-center text-[11px] font-medium">
                    {THEME_LABELS[t]}
                  </p>
                  {active && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1b2e24] text-[8px] text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color swatches */}
        <div>
          <label className="mb-2 block text-xs font-medium">Primary Color</label>
          <div className="flex flex-wrap items-center gap-3">
            {PRIMARY_COLOR_SWATCHES.map((c) => {
              const active = c.value.toLowerCase() === primaryColor.toLowerCase();
              return (
                <button
                  key={c.value}
                  type="button"
                  aria-label={c.label}
                  onClick={() => setPrimaryColor(c.value)}
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    active
                      ? "border-[#1b2e24] scale-110"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <span
                    className="h-7 w-7 rounded-full border border-black/10"
                    style={{ backgroundColor: c.value }}
                  />
                  {active && (
                    <span
                      className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        color: isLight(c.value) ? "#0a0a0a" : "#ffffff",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Applied to buttons, links, and accents across the entire store.
          </p>
        </div>
      </div>

      <SaveBar saving={saving} />
    </form>
  );
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}