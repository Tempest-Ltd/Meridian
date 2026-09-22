import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { Users, Plus, MoreHorizontal } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";

export const metadata = { title: "Users" };

const MEMBERS = [
  { name: "Admin", email: "admin@meridian.com", role: "Owner", status: "Active" },
  { name: "Sarah Johnson", email: "sarah.j@meridian.com", role: "Manager", status: "Active" },
  { name: "Mike Chen", email: "mike.c@meridian.com", role: "Support", status: "Invited" },
];

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Settings</span>
        <h1 className="mt-2 font-display text-3xl">Team Members</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage who has access to your Meridian admin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface-elevated p-3">
            <SettingsNav />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">
                Members ({MEMBERS.length})
              </h2>
            </div>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-4 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90">
              <Plus className="h-4 w-4" />
              Invite Member
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated">
            <ul className="divide-y divide-border">
              {MEMBERS.map((m) => (
                <li
                  key={m.email}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b2e24] text-xs font-semibold text-white">
                    {m.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <span className="hidden rounded-md bg-surface px-3 py-1 text-xs font-medium text-foreground sm:inline-block">
                    {m.role}
                  </span>
                  <StatusPill
                    variant={m.status === "Active" ? "success" : "warning"}
                    dot
                  >
                    {m.status}
                  </StatusPill>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface">
                    <MoreHorizontal className="h-3.5 w-3.5" />
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