"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  Menu,
  User,
  X,
  ArrowRight,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  useUser,
  UserButton,
} from "@clerk/nextjs";
import { Logo } from "@/components/shared/logo";
import { SearchBar } from "./search-bar";
import { CartIcon } from "./cart-icon";
import { PRIMARY_NAV } from "@/lib/constants";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

const USER_BUTTON_APPEARANCE = {
  elements: {
    avatarBox:
      "h-9 w-9 ring-1 ring-border transition-all hover:ring-[#1b2e24]",
    userButtonPopoverCard:
      "shadow-xl border border-border rounded-xl overflow-hidden",
    userButtonPopoverMain: "text-sm",
    userButtonPopoverActions: "p-1",
    userButtonPopoverActionButton:
      "px-3 py-2 rounded-md text-xs hover:bg-[#f5f3ef]",
    userButtonPopoverActionButtonText: "text-xs font-medium",
    userButtonPopoverActionButtonIcon: "h-3.5 w-3.5",
    userButtonPopoverFooter: "hidden",
  },
} as const;

export function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isSignedIn, user } = useUser();
  const wishlistCount = useWishlist((s) => s.items.length);

  useEffect(() => {
    if (!isSignedIn) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setIsAdmin(d.role === "ADMIN");
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, user?.id]);

  const handleAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    e.preventDefault();
    if (pathname === "/") {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-6">
        <Logo />

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((link) => {
            const isAnchor = link.href.startsWith("/#");
            const active =
              link.href === "/"
                ? pathname === "/"
                : !isAnchor && pathname.startsWith(link.href);
            const isCategory = link.label === "Categories";

            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => isCategory && setOpenMenu("categories")}
                onMouseLeave={() => isCategory && setOpenMenu(null)}
              >
                <Link
                  href={link.href}
                  onClick={(e) => handleAnchor(e, link.href)}
                  className={cn(
                    "relative flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isCategory && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        openMenu === "categories" && "rotate-180"
                      )}
                    />
                  )}
                  {active && !isCategory && (
                    <span className="absolute inset-x-3 -bottom-[21px] h-[2px] bg-[#c9a227]" />
                  )}
                </Link>

                {isCategory && openMenu === "categories" && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-[640px] rounded-xl border border-border bg-surface-elevated p-6 shadow-lg">
                      {categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No categories yet.
                        </p>
                      ) : (
                        <>
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c9a227]">
                              Shop by Category
                            </p>
                            <Link
                              href="/shop"
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              View all <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            {categories.slice(0, 6).map((c) => (
                              <Link
                                key={c.id}
                                href={`/shop?category=${c.slug}`}
                                className="group flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-surface/60"
                              >
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface">
                                  {c.image && (
                                    <Image
                                      src={c.image}
                                      alt={c.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">
                                    {c.name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    Shop now
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {categories.length > 6 && (
                            <Link
                              href="/shop"
                              className="mt-4 flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-xs font-medium transition-colors hover:border-[#1b2e24]"
                            >
                              Browse all {categories.length} categories
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop controls */}
        <div className="hidden flex-1 items-center justify-end gap-1 lg:flex">
          <SearchBar className="mr-3 w-[260px]" />
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Link
                href="/admin"
                className="mr-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#1b2e24] px-3.5 text-xs font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={USER_BUTTON_APPEARANCE}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Account"
                    labelIcon={<User className="h-4 w-4" />}
                    href="/account"
                  />
                  <UserButton.Link
                    label="Order History"
                    labelIcon={<Heart className="h-4 w-4" />}
                    href="/account/orders"
                  />
                  <UserButton.Link
                    label="Wishlist"
                    labelIcon={<Heart className="h-4 w-4" />}
                    href="/wishlist"
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
                aria-label="Sign in"
              >
                <User className="h-5 w-5" />
              </Link>
            </SignedOut>

            <Link
              href="/wishlist"
              className="group/heart relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#c9a227] px-1 text-[10px] font-semibold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1b2e24] px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover/heart:opacity-100">
                Wishlist
              </span>
            </Link>

            <CartIcon />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <SearchBar className="hidden max-w-[180px] sm:flex" />

          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Admin dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b2e24] text-[#fbfaf7]"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          )}

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={USER_BUTTON_APPEARANCE}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Account"
                  labelIcon={<User className="h-4 w-4" />}
                  href="/account"
                />
                <UserButton.Link
                  label="Order History"
                  labelIcon={<Heart className="h-4 w-4" />}
                  href="/account/orders"
                />
                <UserButton.Link
                  label="Wishlist"
                  labelIcon={<Heart className="h-4 w-4" />}
                  href="/wishlist"
                />
                <UserButton.Action label="manageAccount" />
                <UserButton.Action label="signOut" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
              aria-label="Sign in"
            >
              <User className="h-5 w-5" />
            </Link>
          </SignedOut>

          <CartIcon />

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col py-4">
            {PRIMARY_NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={(e) => {
                  if (l.href.startsWith("/#")) {
                    handleAnchor(e, l.href);
                  } else {
                    setMobileOpen(false);
                  }
                }}
                className="border-b border-border/60 py-3 text-sm font-medium last:border-0"
              >
                {l.label}
              </Link>
            ))}

            {categories.length > 0 && (
              <div className="border-t border-border/60 pt-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c9a227]">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop?category=${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-[#1b2e24]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between border-t border-border/60 py-3 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}