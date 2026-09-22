import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <ShoppingBag className="h-7 w-7 text-muted-foreground" />
      </span>
      <h2 className="mt-6 font-display text-2xl">Your cart is empty.</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
      >
        Continue shopping
      </Link>
    </div>
  );
}