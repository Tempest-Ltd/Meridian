"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  CreditCard,
  Truck,
  Bell,
  Users,
  Shield,
  Link2,
  FileText,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveSettings } from "@/lib/settings-client";
import type { StoreSettingsData } from "@/lib/settings";
import { StoreInfoForm } from "./store-info-form";
import { StorePreferences } from "./store-preferences";
import { LocalizationForm } from "./localization-form";
import { AppearancePicker } from "./appearance-picker";
import { DangerZone } from "./danger-zone";

type SectionKey =
  | "general"
  | "payments"
  | "shipping"
  | "notifications"
  | "users"
  | "security"
  | "integrations"
  | "billing";

const SECTIONS: {
  key: SectionKey;
  label: string;
  sub: string;
  icon: typeof Store;
  comingSoon?: boolean;
}[] = [
  { key: "general", label: "General", sub: "Store details, timezone, language", icon: Store },
  { key: "payments", label: "Payments", sub: "Payment methods & payouts", icon: CreditCard, comingSoon: true },
  { key: "shipping", label: "Shipping", sub: "Shipping zones & rates", icon: Truck, comingSoon: true },
  { key: "notifications", label: "Notifications", sub: "Email & push notifications", icon: Bell, comingSoon: true },
  { key: "users", label: "Users", sub: "Manage team members", icon: Users, comingSoon: true },
  { key: "security", label: "Security", sub: "Login & data protection", icon: Shield, comingSoon: true },
  { key: "integrations", label: "Integrations", sub: "Apps & third-party services", icon: Link2, comingSoon: true },
  { key: "billing", label: "Billing", sub: "Subscription & invoices", icon: FileText, comingSoon: true },
];

export function SettingsShell({ initial }: { initial: StoreSettingsData }) {
  const router = useRouter();
  const [section, setSection] = useState<SectionKey>("general");
  const [settings, setSettings] = useState<StoreSettingsData>(initial);

  const handleSave = async (patch: Partial<StoreSettingsData>) => {
    const result = await saveSettings(patch);
    if (!result.ok) {
      toast.error(
        result.error === "INVALID_INPUT"
          ? "Some fields are invalid. Check the form."
          : "Failed to save. Try again."
      );
      return false;
    }
    setSettings(result.settings);
    toast.success("Settings saved");
    // Refresh server components so the theme/values propagate everywhere
    router.refresh();
    return true;
  };

  const active = SECTIONS.find((s) => s.key === section)!;

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
      {/* Nav */}
      <aside className="xl:sticky xl:top-20 xl:self-start">
        <nav className="rounded-xl border border-border bg-surface-elevated p-2">
          {SECTIONS.map(({ key, label, sub, icon: Icon, comingSoon }) => {
            const isActive = section === key;
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  isActive ? "bg-[#f5e9c8]/40" : "hover:bg-surface"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                    isActive ? "bg-surface-elevated" : "bg-surface"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-sm",
                        isActive ? "font-medium" : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                    {comingSoon && (
                      <span className="rounded-full bg-surface px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {sub}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0">
        <div className="mb-6">
          <p className="eyebrow">Settings</p>
          <h1 className="mt-2 font-display text-3xl">Account Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your store, preferences, and account settings.
          </p>
        </div>

        {section === "general" ? (
          <div className="space-y-5">
            <StoreInfoForm settings={settings} onSave={handleSave} />
            <LocalizationForm settings={settings} onSave={handleSave} />
            <StorePreferences settings={settings} onSave={handleSave} />
            <AppearancePicker settings={settings} onSave={handleSave} />
            <DangerZone />
          </div>
        ) : (
          <ComingSoon label={active.label} sub={active.sub} icon={active.icon} />
        )}
      </div>
    </div>
  );
}

function ComingSoon({
  label,
  sub,
  icon: Icon,
}: {
  label: string;
  sub: string;
  icon: typeof Store;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-surface-elevated py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </span>
      <p className="mt-5 font-display text-2xl">{label} is coming soon.</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{sub}.</p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        Planned for a future release
      </div>
    </div>
  );
}