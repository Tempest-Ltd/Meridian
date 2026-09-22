"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductImageUpload } from "./product-image-upload";
import { cn } from "@/lib/utils";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string[];
  badge: string | null;
  categoryId: string;
  brand: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  product?: AdminProduct | null;
  categories: Category[];
  onSaved: () => void;
  onCancel: () => void;
}

const BADGE_OPTIONS = [
  { value: "", label: "None" },
  { value: "BEST_SELLER", label: "Best Seller" },
  { value: "NEW", label: "New" },
  { value: "SALE", label: "Sale" },
  { value: "POPULAR", label: "Popular" },
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ product, categories, onSaved, onCancel }: Props) {
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState<string>(product?.price?.toString() ?? "");
  const [comparePrice, setComparePrice] = useState<string>(
    product?.comparePrice?.toString() ?? ""
  );
  const [stock, setStock] = useState<string>(product?.stock?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? ""
  );
  const [badge, setBadge] = useState<string>(product?.badge ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!slug.trim()) return toast.error("Slug is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!price || Number(price) <= 0) return toast.error("Valid price required");
    if (!categoryId) return toast.error("Category is required");
    if (images.length === 0) return toast.error("At least 1 image is required");

    setSaving(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      stock: Number(stock) || 0,
      categoryId,
      badge: badge || null,
      brand: brand.trim() || null,
      images,
    };

    try {
      const url = isEdit
        ? `/api/admin/products/${product!.id}`
        : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "SLUG_TAKEN") {
          toast.error("That slug is already in use");
        } else if (data.issues?.[0]?.message) {
          toast.error(data.issues[0].message);
        } else {
          toast.error(data.error ?? "Save failed");
        }
        setSaving(false);
        return;
      }

      toast.success(isEdit ? "Product updated" : "Product created");
      onSaved();
    } catch {
      toast.error("Something went wrong");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium">
          Product Images *
        </label>
        <ProductImageUpload images={images} onChange={setImages} max={5} />
      </div>

      <Field label="Product Name *">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Wireless Headphones"
          className={inputClass}
        />
      </Field>

      <Field label="Slug *">
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          placeholder="wireless-headphones"
          className={cn(inputClass, "font-mono text-xs")}
        />
      </Field>

      <Field label="Description *">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description…"
          rows={3}
          className={cn(inputClass, "h-auto resize-none py-2")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (USD) *">
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="129.00"
            className={inputClass}
          />
        </Field>
        <Field label="Compare Price">
          <input
            type="number"
            step="0.01"
            min="0"
            value={comparePrice}
            onChange={(e) => setComparePrice(e.target.value)}
            placeholder="179.00"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock *">
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="24"
            className={inputClass}
          />
        </Field>
        <Field label="Brand">
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Meridian"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Category *">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Badge">
        <select
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          className={inputClass}
        >
          {BADGE_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-10 rounded-md border border-border bg-surface-elevated px-5 text-sm font-medium transition-colors hover:border-[#1b2e24] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}