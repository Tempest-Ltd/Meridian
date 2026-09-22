"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/store/product/quantity-stepper";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/types";

export function CartItem({ line }: { line: CartLine }) {
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const { product, quantity, color } = line;

  return (
    <div className="flex gap-4 border-b border-border py-6 last:border-0">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {product.brand ?? product.category}
            </p>
            <Link
              href={`/products/${product.slug}`}
              className="mt-1 line-clamp-2 text-sm font-medium transition-colors hover:text-[#1b2e24]"
            >
              {product.name}
            </Link>
            {color && (
              <span className="mt-2 inline-flex rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-medium">
                {color}
              </span>
            )}
            <p className="price mt-2 text-sm font-semibold">
              {formatPrice(product.price)}
            </p>
          </div>

          <button
            onClick={() => remove(line.id)}
            aria-label="Remove item"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <QuantityStepper
            value={quantity}
            onChange={(v) => updateQty(line.id, v)}
            size="sm"
          />
          <p className="price text-sm font-semibold">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}