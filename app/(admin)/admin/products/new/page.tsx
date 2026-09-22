import { ProductForm } from "@/components/admin/products/product-form";

export const metadata = { title: "New Product" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Products</span>
        <h1 className="mt-2 font-display text-3xl">Add New Product</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the details below to publish a new product.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}