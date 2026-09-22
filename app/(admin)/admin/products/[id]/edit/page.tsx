import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";
import { PRODUCTS } from "@/lib/mock-data";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = PRODUCTS.find((p) => p.id === params.id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Products</span>
        <h1 className="mt-2 font-display text-3xl">Edit Product</h1>
        <p className="mt-2 text-sm text-muted-foreground">{product.name}</p>
      </div>

      <div className="max-w-2xl">
        <ProductForm mode="edit" />
      </div>
    </div>
  );
}