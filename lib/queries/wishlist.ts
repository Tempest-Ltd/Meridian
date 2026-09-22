import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export async function getWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return items.map((i) => ({
    id: i.id,
    productId: i.productId,
    product: serializeProduct(i.product),
  }));
}

export async function toggleWishlist(userId: string, productId: string) {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { added: false };
  }

  await prisma.wishlistItem.create({ data: { userId, productId } });
  return { added: true };
}