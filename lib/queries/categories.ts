import { prisma } from "@/lib/prisma";
import { serializeCategory } from "@/lib/serializers";

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return categories.map(serializeCategory);
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
  return category ? serializeCategory(category) : null;
}