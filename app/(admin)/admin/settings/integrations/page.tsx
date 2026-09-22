import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { Link2, Check, Plus } from "lucide-react";

export const metadata = { title: "Integrations" };

const APPS = [
  { name: "Stripe", sub: "Payments", on: true },
  { name: "Cloudinary", sub: "Image hosting & CDN", on: true },
  { name: "Resend", sub: "Transactional emails", on: true },
  { name: "Clerk", sub: "Authentication", on: true },
  { name: "Klaviyo", sub: "Email marketing", on: false },
  { name: "ShipStation", sub: "Shipping & fulfillment", on: false },
];

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Integrations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect apps and third-party services.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface-elevated p-3">
            <SettingsNav />
          </div>
        </aside>

        <div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Available Apps</h2>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {APPS.map((a) => (
                <li key={a.name} className="flex items-center gap-3 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-xs font-bold">
                    {a.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                  {a.on ? (
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