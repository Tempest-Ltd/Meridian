"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LayoutGrid,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ArrowRight,
  Bell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Users", href: "/admin/users", icon: Users },
];

const ADMIN_NAV = [
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminUser {
  name: string;
  email: string;
  imageUrl: string | null;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AdminSidebar({
  user,
  mobileOpen,
  onMobileClose,
}: {
  user: AdminUser;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, onMobileClose]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const content = (
    <>
      <div className="flex h-14 items-center justify-between px-5">
        <Link
          href="/admin"
          onClick={onMobileClose}
          className="flex items-baseline gap-1 font-display text-base font-semibold tracking-[0.18em] uppercase"
        >
          <span>Meridian</span>
          <span className="text-[#c9a227] text-lg leading-none">.</span>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-2.5 py-3">
        <nav className="space-y-0.5">
          {MAIN_NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-[#c9a227]/15 font-medium text-[#c9a227]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#c9a227]" />
                )}
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <p className="mt-6 mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30">
          Admin
        </p>
        <nav className="space-y-0.5">
          {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                  active
                    ? "bg-[#c9a227]/15 font-medium text-[#c9a227]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#c9a227]" />
                )}
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-2.5 mb-2.5">
        <Link
          href="#"
          onClick={onMobileClose}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10"
        >
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-white">
              Upgrade Plan
            </p>
            <p className="truncate text-[10px] text-white/50">
              Get advanced analytics
            </p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#c9a227]" />
        </Link>
      </div>

      <div className="border-t border-white/10 px-2.5 py-2.5">
        <div className="flex items-center gap-2.5 rounded-md p-1.5">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#c9a227] text-[11px] font-semibold text-[#1b2e24]">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              initials(user.name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-[10px] text-white/50">{user.email}</p>
          </div>
          <button
            aria-label="Notifications"
            className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
          </button>
        </div>
        <Link
          href="/"
          onClick={onMobileClose}
          className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-[#1b2e24] text-[#fbfaf7] lg:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            style={{ animation: "fadeIn 0.2s ease" }}
            onClick={onMobileClose}
            aria-hidden
          />
          <aside
            className="absolute inset-y-0 left-0 flex w-[85vw] max-w-[300px] flex-col bg-[#1b2e24] text-[#fbfaf7] shadow-2xl"
            style={{
              animation: "slideInLeft 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
}