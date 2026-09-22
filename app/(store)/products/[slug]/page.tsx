import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/store/product/product-gallery";
import { ProductInfo } from "@/components/store/product/product-info";
import { ProductTabs } from "@/components/store/product/product-tabs";
import { ProductSidebar } from "@/components/store/product/product-sidebar";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/queries/products";

export const dynamic = "force-dynamic";

interface Params {
  slug: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categorySlug, product.id, 3);

  return (
    <div className="container py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px] lg:gap-8">
        <div>
          <ProductGallery product={product} />
        </div>

        <div>
          <ProductInfo product={product} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductSidebar related={related} />
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}