"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Package,
  Percent,
  User as UserIcon,
  Info,
  Check,
  Trash2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface Prefs {
  orderUpdates: boolean;
  promotions: boolean;
  accountActivity: boolean;
  productUpdates: boolean;
  marketingEmails: boolean;
}

const TYPE_META: Record<
  string,
  { icon: typeof Bell; bg: string; color: string; label: string }
> = {
  ORDER: {
    icon: Package,
    bg: "bg-emerald-50",
    color: "text-emerald-700",
    label: "Orders",
  },
  PROMOTION: {
    icon: Percent,
    bg: "bg-amber-50",
    color: "text-amber-700",
    label: "Promotions",
  },
  ACCOUNT: {
    icon: UserIcon,
    bg: "bg-blue-50",
    color: "text-blue-700",
    label: "Account",
  },
  SYSTEM: {
    icon: Info,
    bg: "bg-violet-50",
    color: "text-violet-700",
    label: "System",
  },
};

const TABS = [
  { key: "ALL", label: "All" },
  { key: "ORDER", label: "Orders" },
  { key: "PROMOTION", label: "Promotions" },
  { key: "ACCOUNT", label: "Account" },
  { key: "SYSTEM", label: "System" },
] as const;

export function NotificationsManager({
  initialNotifications,
  initialPrefs,
}: {
  initialNotifications: Notification[];
  initialPrefs: Prefs;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);
  const [tab, setTab] = useState<string>("ALL");
  const [savingPrefs, setSavingPrefs] = useState(false);

  const filtered = useMemo(() => {
    if (tab === "ALL") return notifications;
    return notifications.filter((n) => n.type === tab);
  }, [notifications, tab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const reload = async () => {
    const res = await fetch("/api/notifications", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setNotifications(data.notifications ?? []);
    router.refresh();
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
    router.refresh();
  };

  const markRead = async (n: Notification) => {
    if (n.read) return;
    await fetch(`/api/notifications/${n.id}`, { method: "PATCH" });
    setNotifications((ns) =>
      ns.map((x) => (x.id === n.id ? { ...x, read: true } : x))
    );
    router.refresh();
  };

  const remove = async (n: Notification) => {
    await fetch(`/api/notifications/${n.id}`, { method: "DELETE" });
    setNotifications((ns) => ns.filter((x) => x.id !== n.id));
    router.refresh();
  };

  const clearAll = async () => {
    if (!confirm("Delete all notifications? This cannot be undone.")) return;
    await fetch("/api/notifications", { method: "DELETE" });
    setNotifications([]);
    toast.success("All notifications cleared");
    router.refresh();
  };

  const updatePrefs = async (next: Prefs) => {
    setPrefs(next);
    setSavingPrefs(true);
    const res = await fetch("/api/account/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSavingPrefs(false);
    if (!res.ok) {
      toast.error("Couldn't save preferences");
      setPrefs(prefs);
      return;
    }
    toast.success("Preferences saved");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface-elevated p-1">
            {TABS.map((t) => {
              const count =
                t.key === "ALL"
                  ? notifications.length
                  : notifications.filter((n) => n.type === t.key).length;
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#1b2e24] text-[#fbfaf7]"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      isActive ? "bg-white/20" : "bg-surface"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium transition-colors hover:border-[#1b2e24]"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-3 text-xs font-medium text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-50"
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-elevated py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </span>
            <p className="mt-5 font-display text-xl">Nothing here yet.</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {tab === "ALL"
                ? "Order updates, promotions, and account activity will show up here."
                : `No ${tab.toLowerCase()} notifications.`}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated">
            <div className="divide-y divide-border">
              {filtered.map((n) => {
                const meta = TYPE_META[n.type] ?? TYPE_META.SYSTEM;
                const Icon = meta.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n)}
                    className={cn(
                      "group flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-surface/50",
                      !n.read && "bg-[#f5e9c8]/20"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        meta.bg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", meta.color)} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={cn(
                            "text-sm",
                            n.read ? "font-medium" : "font-semibold"
                          )}
                        >
                          {n.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          {!n.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(n.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {n.body}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(n);
                      }}
                      aria-label="Delete"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface-elevated p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Notification Settings</h3>
            {savingPrefs && (
              <span className="text-[10px] text-muted-foreground">
                Saving…
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose what you want to be notified about.
          </p>

          <ul className="mt-5 space-y-4">
            <PrefToggle
              icon={Package}
              label="Order updates"
              sub="Shipping, delivery, returns"
              checked={prefs.orderUpdates}
              onChange={(v) => updatePrefs({ ...prefs, orderUpdates: v })}
            />
            <PrefToggle
              icon={Percent}
              label="Promotions & offers"
              sub="Discounts, special deals"
              checked={prefs.promotions}
              onChange={(v) => updatePrefs({ ...prefs, promotions: v })}
            />
            <PrefToggle
              icon={UserIcon}
              label="Account activity"
              sub="Logins, security, profile changes"
              checked={prefs.accountActivity}
              onChange={(v) => updatePrefs({ ...prefs, accountActivity: v })}
            />
            <PrefToggle
              icon={Info}
              label="Product updates"
              sub="Price drops, restocks, wishlist"
              checked={prefs.productUpdates}
              onChange={(v) => updatePrefs({ ...prefs, productUpdates: v })}
            />
            <PrefToggle
              icon={Mail}
              label="Marketing emails"
              sub="News, tips, and more"
              checked={prefs.marketingEmails}
              onChange={(v) => updatePrefs({ ...prefs, marketingEmails: v })}
            />
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface-elevated p-5">
          <h3 className="text-sm font-semibold">Summary</h3>
          <div className="mt-4 space-y-2 text-xs">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="price font-medium">{notifications.length}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground">Unread</span>
              <span className="price font-medium">{unreadCount}</span>
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PrefToggle({
  icon: Icon,
  label,
  sub,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  sub: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="flex min-w-0 items-start gap-2.5">
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="min-w-0">
          <span className="block text-xs font-medium">{label}</span>
          <span className="block text-[10px] text-muted-foreground">{sub}</span>
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#1b2e24]" : "bg-[#e7e5e4]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-surface-elevated shadow-sm transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
    </li>
  );
}