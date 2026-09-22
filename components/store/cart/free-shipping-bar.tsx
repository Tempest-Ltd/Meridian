import { Truck } from "lucide-react";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const threshold = SITE.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);

  return (
    <div className="rounded-xl bg-[#f5e9c8]/40 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5e9c8]">
          <Truck className="h-4 w-4 text-[#8a6d1a]" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#8a6d1a]">
            Free shipping on orders over ${threshold}
          </p>
          <p className="mt-0.5 text-xs text-[#8a6d1a]/80">
            {remaining > 0
              ? `You're ${formatPrice(remaining)} away from free shipping!`
              : "You've unlocked free shipping."}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f5e9c8]">
            <div
              className="h-full bg-[#c9a227] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}