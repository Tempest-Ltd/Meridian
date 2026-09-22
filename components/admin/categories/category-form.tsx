"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductImageUpload } from "@/components/admin/products/product-image-upload";
import { cn } from "@/lib/utils";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
}

interface Props {
  category?: AdminCategory | null;
  onSaved: () => void;
  onCancel: () => void;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryForm({ category, onSaved, onCancel }: Props) {
  const isEdit = !!category;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(category?.description ?? "");
  const [images, setImages] = useState<string[]>(
    category?.image ? [category.image] : []
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!slug.trim()) return toast.error("Slug is required");

    setSaving(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      image: images[0] ?? null,
    };

    try {
      const url = isEdit
        ? `/api/admin/categories/${category!.id}`
        : "/api/admin/categories";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "CATEGORY_TAKEN") {
          toast.error(`${data.field === "slug" ? "Slug" : "Name"} is already in use`);
        } else {
          toast.error(data.error ?? "Save failed");
        }
        setSaving(false);
        return;
      }

      toast.success(isEdit ? "Category updated" : "Category created");
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
          Category Image
        </label>
        <ProductImageUpload
          images={images}
          onChange={setImages}
          max={1}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">
          Category Name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electronics"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">Slug *</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          placeholder="electronics"
          className={cn(inputClass, "font-mono text-xs")}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description…"
          rows={3}
          className={cn(inputClass, "h-auto resize-none py-2")}
        />
      </div>

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
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";