"use client";


export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  ProductForm,
  type AdminProduct,
} from "@/components/admin/products/product-form";
import {
  ProductTable,
  type TableProduct,
} from "@/components/admin/products/product-table";

interface Category {
  id: string;
  name: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<TableProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData.products ?? []);
      setCategories(cData.categories ?? []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.includes(q)) {
        return false;
      }
      if (categoryFilter && p.category?.name !== categoryFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  const openEdit = async (row: TableProduct) => {
    const res = await fetch(`/api/admin/products/${row.id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error("Couldn't load product");
      return;
    }
    setEditing({
      id: data.product.id,
      name: data.product.name,
      slug: data.product.slug,
      description: data.product.description,
      price: Number(data.product.price),
      comparePrice:
        data.product.comparePrice != null
          ? Number(data.product.comparePrice)
          : null,
      stock: data.product.stock,
      images: data.product.images,
      badge: data.product.badge,
      categoryId: data.product.categoryId,
      brand: data.product.brand,
    });
  };

  const handleDelete = async (row: TableProduct) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${row.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.error === "PRODUCT_IN_ORDERS") {
        toast.error("This product is part of existing orders — can't delete.");
      } else {
        toast.error(data.error ?? "Delete failed");
      }
      return;
    }
    toast.success("Product deleted");
    if (editing?.id === row.id) setEditing(null);
    load();
  };

  const onSaved = () => {
    setEditing(null);
    load();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Products</p>
            <h1 className="mt-2 font-display text-3xl">
              Manage Your Products
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {products.length} products ·{" "}
              {categories.length} categories
            </p>
          </div>
          <button
            onClick={() => setEditing(null)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3">
          <div className="flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="h-full flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-surface-elevated px-3 text-xs outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {(search || categoryFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("");
              }}
              className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        <ProductTable
          products={filtered}
          selectedId={editing?.id ?? null}
          onEdit={openEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <aside className="xl:sticky xl:top-20 xl:self-start">
        <div className="rounded-xl border border-border bg-surface-elevated p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg">
              {editing ? "Edit Product" : "Add New Product"}
            </h2>
            {editing && (
              <button
                onClick={() => setEditing(null)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Cancel edit
              </button>
            )}
          </div>
          <ProductForm
            key={editing?.id ?? "new"}
            product={editing}
            categories={categories}
            onSaved={onSaved}
            onCancel={() => setEditing(null)}
          />
        </div>
      </aside>
    </div>
  );
}