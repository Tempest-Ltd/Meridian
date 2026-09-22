import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/store/product/product-card";
import type { Product } from "@/types";

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  if (products.length === 0) return null;

  return (
    <section className="container py-16 md:py-20">
      <SectionHeader
        eyebrow="Featured Products"
        title="Best Sellers"
        href="/shop"
        linkLabel="View All Products"
      />

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}