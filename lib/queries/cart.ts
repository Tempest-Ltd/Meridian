import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "asc" },
  });

  return items.map((i) => ({
    id: i.id,
    productId: i.productId,
    quantity: i.quantity,
    color: i.color,
    product: serializeProduct(i.product),
  }));
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  color: string | null = null
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("PRODUCT_NOT_FOUND");

  return prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity, color },
    update: { quantity: { increment: quantity }, color },
  });
}

export async function updateCartItem(
  userId: string,
  cartItemId: string,
  quantity: number
) {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });
  if (!item) throw new Error("NOT_FOUND");

  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export async function removeCartItem(userId: string, cartItemId: string) {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });
  if (!item) throw new Error("NOT_FOUND");
  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

export async function clearCart(userId: string) {
  return prisma.cartItem.deleteMany({ where: { userId } });
}