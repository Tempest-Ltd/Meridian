import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";

const ADS = [
  { product: PRODUCTS[10], channel: "Meta Ads", spend: 1284, clicks: 4823, ctr: "3.8%" },
  { product: PRODUCTS[0], channel: "TikTok Ads", spend: 982, clicks: 3412, ctr: "3.5%" },
  { product: PRODUCTS[2], channel: "Google Ads", spend: 671, clicks: 2486, ctr: "4.1%" },
  { product: PRODUCTS[11], channel: "Meta Ads", spend: 542, clicks: 1982, ctr: "3.6%" },
];

export function TopAds() {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base">Top Performing Ads</h3>
        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {ADS.map((a) => (
          <li key={a.product.id + a.channel} className="flex gap-3 py-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
              <Image
                src={a.product.images[0]}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-2 text-xs font-medium">
                {a.product.name}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {a.channel}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                ${a.spend} spent · {a.clicks.toLocaleString()} clicks
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">CTR</p>
              <p className="text-xs font-semibold">{a.ctr}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}