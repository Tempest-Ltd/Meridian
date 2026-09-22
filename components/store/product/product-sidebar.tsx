import { Shield, Truck, RotateCcw, Lock, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const TRUST = [
  { icon: Shield, title: "Meridian Guarantee", sub: "30-day money back, no questions asked." },
  { icon: Truck, title: "Free Shipping", sub: "On orders over $50" },
  { icon: RotateCcw, title: "Easy Returns", sub: "30-day policy" },
  { icon: Lock, title: "Secure Checkout", sub: "100% encrypted" },
];

interface ProductSidebarProps {
  related: Product[];
}

export function ProductSidebar({ related }: ProductSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface-elevated p-6">
        <ul className="space-y-4">
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <li key={title} className="flex items-start gap-3">
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {related.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-elevated p-6">
          <p className="text-sm font-semibold">You might also like</p>
          <ul className="mt-4 space-y-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group flex items-center gap-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-2 text-xs font-medium leading-snug">
                      {p.name}
                    </p>
                    <p className="price mt-1 text-xs font-semibold">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-[#1b2e24] group-hover:text-foreground">
                    <Plus className="h-3 w-3" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}