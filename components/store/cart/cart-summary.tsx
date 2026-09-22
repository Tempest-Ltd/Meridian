import Link from "next/link";
import { Shield, Lock, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { FreeShippingBar } from "./free-shipping-bar";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const shipping = subtotal >= 50 ? 0 : 8;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border bg-surface-elevated p-6">
        <h2 className="font-display text-2xl">Order Summary</h2>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </dt>
            <dd className="price font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              Shipping
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border text-[8px]">
                ?
              </span>
            </dt>
            <dd className="text-sm font-medium text-emerald-600">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              Estimated Tax
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border text-[8px]">
                ?
              </span>
            </dt>
            <dd className="price font-medium">{formatPrice(tax)}</dd>
          </div>
        </dl>

        <div className="my-5 border-t border-border" />

        <div className="flex items-baseline justify-between">
          <span className="font-display text-lg">Total</span>
          <span className="price font-display text-2xl font-semibold">
            {formatPrice(total)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1b2e24] text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
        >
          <Lock className="h-4 w-4" />
          Proceed to Checkout
          <span className="ml-1">→</span>
        </Link>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          Secure checkout powered by Stripe
        </p>

        <div className="mt-6">
          <FreeShippingBar subtotal={subtotal} />
        </div>

        <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
          <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              30-day money back guarantee
            </p>
            <p>Not satisfied? No problem. We&apos;ve got you covered.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5">
          {["VISA", "MC", "AMEX", "Pay", "GPay"].map((label) => (
            <span
              key={label}
              className="rounded border border-border px-2 py-1 text-[9px] font-bold text-foreground/70"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}