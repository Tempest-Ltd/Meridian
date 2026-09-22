import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ShoppingBag } from "lucide-react";
import { CheckoutForm } from "@/components/store/checkout/checkout-form";
import { OrderSummary } from "@/components/store/checkout/order-summary";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/queries/cart";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [cart, addresses] = await Promise.all([
    getCart(user.id),
    prisma.address.findMany({ where: { userId: user.id } }),
  ]);

  const subtotal = cart.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 8;
  const tax = 0;
  const total = subtotal + shipping + tax;
  const hasAddress = addresses.length > 0;

  if (cart.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </span>
        <p className="mt-6 font-display text-2xl">Your cart is empty.</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Add a few products to your cart before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="flex items-center gap-3">
        <span className="eyebrow">Checkout</span>
        <span className="h-px w-8 bg-[#c9a227]/40" />
      </div>
      <h1 className="mt-3 font-display text-4xl">Almost there.</h1>

      {!hasAddress && (
        <div className="mt-6 flex flex-wrap items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-900">
              Add a shipping address to continue
            </p>
            <p className="mt-0.5 text-xs text-amber-800/80">
              We need an address to deliver your order. Add one now — you can
              always change it later.
            </p>
          </div>
          <Link
            href="/account/addresses"
            className="inline-flex h-9 items-center rounded-md bg-amber-900 px-4 text-xs font-medium text-white transition-colors hover:bg-amber-950"
          >
            Add address
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <CheckoutForm hasAddress={hasAddress} />
        <OrderSummary
          lines={cart}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  );
}