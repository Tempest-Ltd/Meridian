"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  unitsSold: number;
  revenue: number;
}

export function TopProducts({ products }: { products: TopProduct[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-lg">Top Selling Products</h3>
        <Link
          href="/admin/products"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No sales data yet.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 px-5 py-3"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {p.unitsSold} sold
                </p>
              </div>
              <span className="price text-xs font-medium">
                {formatPrice(p.revenue)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}