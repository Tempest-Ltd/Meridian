import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/types";

interface OrderSummaryProps {
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function OrderSummary({
  lines,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border bg-surface-elevated p-6">
        <h2 className="font-display text-xl">Your Order</h2>

        <ul className="mt-5 divide-y divide-border">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-3 py-4 first:pt-0">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image
                  src={line.product.images[0]}
                  alt={line.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1b2e24] text-[10px] font-semibold text-white">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs font-medium">
                  {line.product.name}
                </p>
                {line.color && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {line.color}
                  </p>
                )}
              </div>
              <span className="price shrink-0 text-xs font-semibold">
                {formatPrice(line.product.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="price">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="price">
                {shipping === 0 ? (
                  <span className="text-emerald-600">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="price">{formatPrice(tax)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-display text-lg">Total</span>
            <span className="price font-display text-2xl font-semibold">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}