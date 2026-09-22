import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { FileText, Download } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";

export const metadata = { title: "Billing" };

const INVOICES = [
  { id: "INV-2025-04", date: "Apr 1, 2025", amount: "$29.00", status: "Paid" },
  { id: "INV-2025-03", date: "Mar 1, 2025", amount: "$29.00", status: "Paid" },
  { id: "INV-2025-02", date: "Feb 1, 2025", amount: "$29.00", status: "Paid" },
];

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Billing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your subscription and invoices.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface-elevated p-3">
            <SettingsNav />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#1b2e24] p-6 text-[#fbfaf7]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-[#c9a227]">Current Plan</p>
                <p className="mt-2 font-display text-2xl">Meridian Pro</p>
                <p className="mt-1 text-xs text-white/70">
                  $29/month · Renews May 1, 2025
                </p>
              </div>
              <button className="rounded-md bg-[#c9a227] px-4 py-2 text-xs font-medium text-[#1b2e24] transition-colors hover:bg-[#e0b73a]">
                Manage Plan
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Recent Invoices</h2>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {INVOICES.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="flex-1">
                    <p className="font-mono text-xs font-semibold">
                      {inv.id}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {inv.date}
                    </p>
                  </div>
                  <span className="price text-sm font-medium">
                    {inv.amount}
                  </span>
                  <StatusPill variant="success" dot>
                    {inv.status}
                  </StatusPill>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}