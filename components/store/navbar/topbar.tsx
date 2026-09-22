import { Truck, ArrowRight } from "lucide-react";

export function Topbar() {
  return (
    <div className="bg-[#1b2e24] text-[#fbfaf7]">
      <div className="container flex h-9 items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <span className="hidden items-center gap-2 sm:flex">
            <Truck className="h-3.5 w-3.5" />
            <span>Free shipping on orders over $50</span>
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:block" />
          <span className="hidden sm:inline">30-day money back guarantee</span>
          <span className="sm:hidden">Free shipping over $50</span>
        </div>

        <a
          href="/account/orders"
          className="group inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          <span>Track Order</span>
        </a>
      </div>
    </div>
  );
}