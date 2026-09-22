"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  CreditCard,
  Headphones,
  Home,
  LogOut,
  MapPin,
  Package,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
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

export function AccountSidebar({ user }: { user: AccountUser }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-2xl border border-border bg-surface-elevated p-4">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-sm font-semibold text-white">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              initials(user.name)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="my-2 border-t border-border" />

        <nav className="space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
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

        <div className="my-2 border-t border-border" />

        <SignOutButton>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </SignOutButton>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-[#1b2e24] p-5 text-[#fbfaf7]">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#c9a227]/20 blur-2xl"
          aria-hidden
        />
        <p className="font-display text-sm tracking-[0.15em]">MERIDIAN.</p>
        <p className="mt-3 font-display text-xl leading-tight">
          Premium perks for members.
        </p>
        <p className="mt-2 text-xs text-white/70">
          Exclusive offers, early access, and more.
        </p>
        <Link
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#c9a227] transition-colors hover:text-[#e0b73a]"
        >
          Learn More
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}