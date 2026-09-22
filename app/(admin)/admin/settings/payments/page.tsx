import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { CreditCard, Check, Plus } from "lucide-react";

export const metadata = { title: "Payments" };

export default function PaymentsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Payments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage payment methods and payouts.
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
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Connected Methods</h2>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {[
                { name: "Stripe", sub: "Cards, Apple Pay, Google Pay", on: true },
                { name: "PayPal", sub: "PayPal balance and linked accounts", on: false },
              ].map((p) => (
                <li key={p.name} className="flex items-center gap-3 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1b2e24] text-xs font-bold text-white">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sub}</p>
                  </div>
                  {p.on ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium transition-colors hover:border-[#1b2e24]">
                      <Plus className="h-3 w-3" /> Connect
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}