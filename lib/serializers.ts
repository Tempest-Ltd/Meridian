import type {
  Product as PrismaProduct,
  Category as PrismaCategory,
} from "@prisma/client";
import type { Product, Category, ProductBadge } from "@/types";

type ProductWithCategory = PrismaProduct & { category: PrismaCategory };

const BADGE_MAP: Record<string, ProductBadge> = {
  BEST_SELLER: "best-seller",
  NEW: "new",
  SALE: "sale",
  POPULAR: "popular",
};

export function serializeProduct(p: ProductWithCategory): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category.name,
    categorySlug: p.category.slug,
    brand: p.brand ?? undefined,
    description: p.description,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    images: p.images,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    badge: p.badge ? BADGE_MAP[p.badge] : undefined,
    colors: (p.colors as { name: string; hex: string }[] | null) ?? undefined,
    createdAt: p.createdAt.toISOString(),
  };
}

export function serializeCategory(
  c: PrismaCategory & { _count?: { products: number } }
): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? "",
    count: c._count?.products,
  };
}