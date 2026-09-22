import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

const withCategory = { category: true } as const;

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: withCategory,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getFeaturedProducts(limit = 6) {
  const products = await prisma.product.findMany({
    where: { published: true, featured: true },
    include: withCategory,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: withCategory,
  });
  return product ? serializeProduct(product) : null;
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeId: string,
  limit = 3
) {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: excludeId },
      category: { slug: categorySlug },
    },
    include: withCategory,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function searchProducts(q: string) {
  if (!q.trim()) return [];
  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    include: withCategory,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}