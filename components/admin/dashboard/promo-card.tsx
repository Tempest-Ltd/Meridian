import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromoCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#1b2e24] text-[#fbfaf7]">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#c9a227]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm leading-tight">
            Boost Your Sales
          </p>
          <p className="mt-1 text-[11px] leading-snug text-white/70">
            Featured products get 3x more views.
          </p>
          <Link
            href="/admin/products"
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-[#c9a227] px-3 py-1.5 text-[11px] font-medium text-[#1b2e24] transition-colors hover:bg-[#e0b73a]"
          >
            Manage Products <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}