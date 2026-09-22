import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { Shield, Lock, Key } from "lucide-react";

export const metadata = { title: "Security" };

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Security</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Login and data protection settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface-elevated p-3">
            <SettingsNav />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold">
                  Two-Factor Authentication
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add an extra layer of security to your admin account.
                </p>
                <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-4 text-xs font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90">
                  <Key className="h-3.5 w-3.5" />
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold">Password</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Last changed 3 months ago. Use a strong, unique password.
                </p>
                <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-xs font-medium transition-colors hover:border-[#1b2e24]">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}