import { ShopClient } from "@/components/store/product/shop-client";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllProducts } from "@/lib/queries/products";

export const metadata = {
  title: "Shop All Products",
};

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  inStock?: string;
  q?: string;
  sort?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <div className="container pb-10 pt-5 md:pb-14 md:pt-6">
      <ShopClient
        products={products}
        categories={categories}
        initialFilters={{
          category: searchParams.category,
          minPrice: searchParams.minPrice
            ? Number(searchParams.minPrice)
            : undefined,
          maxPrice: searchParams.maxPrice
            ? Number(searchParams.maxPrice)
            : undefined,
          rating: searchParams.rating
            ? Number(searchParams.rating)
            : undefined,
          inStock: searchParams.inStock === "1",
          q: searchParams.q,
          sort: searchParams.sort,
        }}
      />
    </div>
  );
}