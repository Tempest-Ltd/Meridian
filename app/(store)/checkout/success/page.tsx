import Link from "next/link";
import { Check, Mail, Package, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderBySessionId } from "@/lib/queries/orders";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order Confirmed" };

interface SearchParams {
  session_id?: string;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  const sessionId = searchParams.session_id;

  // Webhook might still be processing. Give it up to 5 seconds.
  let order = sessionId ? await getOrderBySessionId(sessionId) : null;
  let attempts = 0;
  while (!order && sessionId && attempts < 10) {
    await new Promise((r) => setTimeout(r, 500));
    order = await getOrderBySessionId(sessionId);
    attempts++;
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-8 w-8 text-emerald-700" strokeWidth={3} />
        </span>

        <p className="eyebrow mt-6">Order Confirmed</p>
        <h1 className="mt-3 font-display text-4xl">Thank you.</h1>

        {order ? (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Your order{" "}
              <span className="font-mono font-semibold text-foreground">
                #{order.orderNumber}
              </span>{" "}
              has been placed. A confirmation email is on the way.
            </p>

            <div className="mt-8 space-y-3 rounded-2xl border border-border bg-surface-elevated p-6 text-left">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Confirmation sent</p>
                  <p className="text-xs text-muted-foreground">
                    Check your inbox at {order.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Ships within 1–2 business days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll get a tracking link when it ships
                  </p>
                </div>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">Total paid</span>
                <span className="price font-semibold">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Your payment was received. Your order details will appear in your
            account shortly.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account/orders"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
          >
            View Order
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface-elevated px-6 text-sm font-medium transition-colors hover:border-[#1b2e24]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}