import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { Truck } from "lucide-react";

export const metadata = { title: "Shipping" };

export default function ShippingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Shipping</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage shipping zones and rates.
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
              <Truck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Shipping Zones</h2>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {[
                { zone: "Lagos, Nigeria", rate: "Free over $50", eta: "1–2 days" },
                { zone: "Rest of Nigeria", rate: "$8 flat", eta: "3–5 days" },
                { zone: "International", rate: "$15 flat", eta: "7–14 days" },
              ].map((z) => (
                <li key={z.zone} className="flex items-center gap-3 py-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{z.zone}</p>
                    <p className="text-xs text-muted-foreground">
                      {z.rate} · {z.eta}
                    </p>
                  </div>
                  <button className="rounded-md border border-border px-3 py-1 text-xs font-medium transition-colors hover:border-[#1b2e24]">
                    Edit
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