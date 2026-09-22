import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { Bell } from "lucide-react";

export const metadata = { title: "Notifications" };

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose what you want to be notified about.
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
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Email Notifications</h2>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {[
                { title: "New orders", sub: "Get notified when a customer places an order", on: true },
                { title: "Low stock alerts", sub: "When a product drops below 10 units", on: true },
                { title: "Customer reviews", sub: "New reviews on your products", on: true },
                { title: "Weekly reports", sub: "Summary of your store's performance", on: false },
              ].map((n) => (
                <li key={n.title} className="flex items-center gap-3 py-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.sub}</p>
                  </div>
                  <span
                    className={
                      "relative inline-flex h-6 w-11 rounded-full transition-colors " +
                      (n.on ? "bg-[#1b2e24]" : "bg-[#d6d3d1]")
                    }
                  >
                    <span
                      className={
                        "absolute top-0.5 h-5 w-5 rounded-full bg-surface-elevated transition-transform " +
                        (n.on ? "translate-x-[22px]" : "translate-x-0.5")
                      }
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}