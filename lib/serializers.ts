import type { Product as PrismaProduct, Category as PrismaCategory } from "@prisma/client";
import type { Product, Category } from "@/types";

export function serializeProduct(
  product: PrismaProduct & { category?: PrismaCategory | null }
): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    comparePrice:
      product.comparePrice != null ? Number(product.comparePrice) : undefined,
    images: product.images,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    brand: product.brand ?? undefined,
    colors: (product.colors as Product["colors"]) ?? undefined,
    category: product.category?.name ?? "",
    categorySlug: product.category?.slug ?? "",
    badge: product.badge ?? undefined,
    createdAt: product.createdAt.toISOString(),
  };
}

export function serializeCategory(
  category: PrismaCategory & { _count?: { products: number } }
): Category & { count?: number } {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image ?? "",
    count: category._count?.products,
  };
}