import { ProductCard } from "@/components/store/product/product-card";
import { searchProducts } from "@/lib/queries/products";

export const metadata = { title: "Search" };

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="container py-12 md:py-16">
      <div className="flex items-center gap-3">
        <span className="eyebrow">Search Results</span>
        <span className="h-px w-8 bg-[#c9a227]/40" />
      </div>
      <h1 className="mt-3 font-display text-3xl md:text-4xl">
        {q ? `"${q}"` : "Search Meridian"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {q
          ? `${results.length} ${results.length === 1 ? "result" : "results"}`
          : "Type something in the search bar to find products."}
      </p>

      {q && results.length === 0 ? (
        <div className="mt-12 flex flex-col items-center py-16 text-center">
          <p className="font-display text-2xl">No results found.</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try a different search term, or browse the full catalog.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}