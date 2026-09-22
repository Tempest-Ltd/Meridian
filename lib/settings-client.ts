"use client";

import type { StoreSettingsData } from "@/lib/settings";

export async function saveSettings(
  patch: Partial<StoreSettingsData>
): Promise<{ ok: true; settings: StoreSettingsData } | { ok: false; error: string; issues?: unknown }> {
  const res = await fetch("/api/admin/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      error: data.error ?? "SAVE_FAILED",
      issues: data.issues,
    };
  }

  return { ok: true, settings: data };
}