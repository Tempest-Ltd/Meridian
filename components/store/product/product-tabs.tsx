"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const TABS = ["Description", "Specifications", "Shipping & Returns", "Reviews"] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>("Description");

  return (
    <div className="mt-16">
      {/* Tab bar */}
      <div className="flex items-center gap-8 border-b border-border">
        {TABS.map((t) => {
          const active = t === tab;
          const label =
            t === "Reviews" ? `Reviews (${product.reviewCount})` : t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative py-4 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
              {active && (
                <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#c9a227]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="py-8">
        {tab === "Description" && <DescriptionTab product={product} />}
        {tab === "Specifications" && <SpecsTab />}
        {tab === "Shipping & Returns" && <ShippingTab />}
        {tab === "Reviews" && <ReviewsTab product={product} />}
      </div>
    </div>
  );
}

function DescriptionTab({ product }: { product: Product }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <div>
        <h3 className="font-display text-2xl md:text-3xl">
          Immersive Sound. Total Freedom.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {product.description} With advanced spatial audio, world-class
          comfort, and up to 24 hours of battery life, they&apos;re built for
          those who demand more from their sound.
        </p>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80"
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 max-w-xs text-white">
          <p className="font-display text-2xl leading-tight">
            Less noise.
            <br />
            More you.
          </p>
          <span className="mt-2 block h-px w-10 bg-[#c9a227]" />
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
            Meridian.
          </p>
        </div>
      </div>
    </div>
  );
}

function SpecsTab() {
  const rows = [
    ["Driver", "40mm dynamic"],
    ["Battery Life", "Up to 24 hours"],
    ["Connectivity", "Bluetooth 5.3, multipoint"],
    ["Noise Cancellation", "Active, adaptive"],
    ["Weight", "254g"],
    ["In the box", "Headphones, USB-C, case, cable"],
  ];
  return (
    <div className="max-w-2xl">
      <dl className="divide-y divide-border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-2 gap-4 py-3 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ShippingTab() {
  return (
    <div className="max-w-2xl space-y-4 text-sm text-muted-foreground">
      <p>
        <span className="font-medium text-foreground">Shipping.</span> Free
        standard shipping on orders over $50. Ships within 1–2 business days.
        Express options available at checkout.
      </p>
      <p>
        <span className="font-medium text-foreground">Returns.</span> 30-day
        money-back guarantee. Items must be in original condition. Prepaid
        return label included.
      </p>
    </div>
  );
}

function ReviewsTab({ product }: { product: Product }) {
  const bars = [
    { stars: 5, pct: 88 },
    { stars: 4, pct: 8 },
    { stars: 3, pct: 2 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-border bg-surface-elevated p-6">
        <p className="text-sm font-semibold">Customer Reviews</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            / 5 ({product.reviewCount} reviews)
          </span>
        </div>
        <div className="mt-5 space-y-2">
          {bars.map((b) => (
            <div key={b.stars} className="flex items-center gap-2 text-xs">
              <span className="w-6 text-muted-foreground">{b.stars}★</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full bg-[#1b2e24]"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-muted-foreground">
                {b.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-semibold">
                JD
              </div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">2 weeks ago</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sound quality is unreal. Noise cancellation actually works on
              flights. Comfortable for hours.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}