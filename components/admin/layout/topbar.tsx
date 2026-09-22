"use client";

import Image from "next/image";
import { Bell, Search, ChevronDown, Menu } from "lucide-react";

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

export function AdminTopbar({
  user,
  onOpenMobileNav,
}: {
  user: AdminUser;
  onOpenMobileNav?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:gap-4 md:px-6">
      {/* Mobile hamburger */}
      {onOpenMobileNav && (
        <button
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Search — full on md+, hidden on small */}
      <div className="hidden h-10 max-w-md flex-1 items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 md:flex">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          placeholder="Search anything..."
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {/* Icon-only search on mobile */}
        <button
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
        </button>

        <button className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated py-1 pl-1 pr-2 transition-colors hover:border-[#1b2e24]/30 md:pr-3">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-xs font-semibold text-white">
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
          </span>
          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
            {user.name}
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </button>
      </div>
    </header>
  );
}