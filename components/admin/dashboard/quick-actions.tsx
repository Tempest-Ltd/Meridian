"use client";

import Link from "next/link";
import {
  Plus,
  ShoppingCart,
  LayoutGrid,
  Users,
  ArrowRight,
} from "lucide-react";

const ACTIONS = [
  {
    icon: Plus,
    title: "Add New Product",
    sub: "Create and publish a new product",
    href: "/admin/products",
  },
  {
    icon: ShoppingCart,
    title: "Manage Orders",
    sub: "View and update order status",
    href: "/admin/orders",
  },
  {
    icon: LayoutGrid,
    title: "Add Category",
    sub: "Create a new product category",
    href: "/admin/categories",
  },
  {
    icon: Users,
    title: "View Customers",
    sub: "Manage registered users",
    href: "/admin/users",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Quick Actions</h3>
      <ul className="mt-4 space-y-1">
        {ACTIONS.map(({ icon: Icon, title, sub, href }) => (
          <li key={title}>
            <Link
              href={href}
              className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">{title}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {sub}
                </p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}