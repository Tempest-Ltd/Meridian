"use client";

import Image from "next/image";

interface Ad {
  id: string;
  name: string;
  image: string;
  ctr: number;
  spend: number;
}

const ADS: Ad[] = [
  {
    id: "a1",
    name: "Wireless Headphones — Summer Sale",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    ctr: 4.8,
    spend: 1240,
  },
  {
    id: "a2",
    name: "Oversized Hoodie — New Arrivals",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
    ctr: 3.9,
    spend: 890,
  },
  {
    id: "a3",
    name: "Classic Runner Sneakers — Flash Sale",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80",
    ctr: 3.4,
    spend: 620,
  },
  {
    id: "a4",
    name: "Urban Backpack — Free Shipping",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&q=80",
    ctr: 2.9,
    spend: 480,
  },
];

export function TopAds() {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Top Performing Ads</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Highest click-through rates this week
      </p>

      <ul className="mt-5 divide-y divide-border">
        {ADS.map((ad) => (
          <li key={ad.id} className="flex items-center gap-3 py-3 first:pt-0">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface">
              <Image
                src={ad.image}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-medium">{ad.name}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                ${ad.spend.toLocaleString()} spend
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {ad.ctr}% CTR
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}