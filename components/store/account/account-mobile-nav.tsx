"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  Headphones,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  User as UserIcon,
  X,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/account", icon: Home },
  { label: "Order History", href: "/account/orders", icon: Package },
  { label: "Profile Settings", href: "/account/profile", icon: UserIcon },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Payment Methods", href: "/account/payment-methods", icon: CreditCard },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Help & Support", href: "/account/support", icon: Headphones },
];

interface AccountUser {
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

export function AccountMobileNav({ user }: { user: AccountUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstName = user.name.split(" ")[0];

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface-elevated px-4 text-sm font-medium transition-colors hover:border-[#1b2e24]"
      >
        <span className="flex items-center gap-2.5">
          <Menu className="h-4 w-4" />
          Menu
        </span>
        <span className="flex items-center gap-2">
          <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-[10px] font-semibold text-white">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                sizes="28px"
                className="object-cover"
              />
            ) : (
              initials(user.name)
            )}
          </span>
          <span className="text-xs text-muted-foreground">{firstName}</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            style={{ animation: "fadeIn 0.2s ease" }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className="absolute inset-y-0 left-0 flex w-[85vw] max-w-[340px] flex-col bg-surface-elevated shadow-2xl"
            style={{
              animation: "slideInLeft 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <p className="font-display text-base">Account Menu</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-3 flex items-center gap-3 rounded-lg bg-surface p-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-sm font-semibold text-white">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-0.5">
                {NAV.map(({ label, href, icon: Icon }) => {
                  const active =
                    href === "/account"
                      ? pathname === "/account"
                      : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-[#f5e9c8]/50 font-medium text-[#8a6d1a]"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-3 border-t border-border" />

              <SignOutButton>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </SignOutButton>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}