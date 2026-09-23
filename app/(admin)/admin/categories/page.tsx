"use client";


export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  CategoryForm,
  type AdminCategory,
} from "@/components/admin/categories/category-form";
import {
  CategoryTable,
  type TableCategory,
} from "@/components/admin/categories/category-table";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<TableCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminCategory | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch {
      toast.error("Failed to load categories");
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
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  const openEdit = (row: TableCategory) => {
    setEditing({
      id: row.id,
      name: row.name,
      slug: row.slug,
      image: row.image,
      description: row.description,
    });
  };

  const handleDelete = async (row: TableCategory) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/categories/${row.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.error === "CATEGORY_HAS_PRODUCTS") {
        toast.error("Move products out of this category before deleting it.");
      } else {
        toast.error(data.error ?? "Delete failed");
      }
      return;
    }
    toast.success("Category deleted");
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
            <p className="eyebrow">Categories</p>
            <h1 className="mt-2 font-display text-3xl">
              Manage Categories
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {categories.length} categories total
            </p>
          </div>
          <button
            onClick={() => setEditing(null)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="h-full flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <CategoryTable
          categories={filtered}
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
              {editing ? "Edit Category" : "Add New Category"}
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
          <CategoryForm
            key={editing?.id ?? "new"}
            category={editing}
            onSaved={onSaved}
            onCancel={() => setEditing(null)}
          />
        </div>
      </aside>
    </div>
  );
}