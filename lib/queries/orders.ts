import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const withItems = {
  items: true,
} as const;

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: withItems,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderByNumber(userId: string, orderNumber: string) {
  return prisma.order.findFirst({
    where: { userId, orderNumber },
    include: withItems,
  });
}

export async function getOrderBySessionId(sessionId: string) {
  return prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: withItems,
  });
}

export async function generateOrderNumber() {
  const count = await prisma.order.count();
  const next = count + 1;
  const padded = String(next).padStart(6, "0");
  return `MD-${padded}`;
}

interface CreateOrderInput {
  userId: string;
  sessionId: string;
  paymentId: string | null;
  email: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Prisma.InputJsonValue;
  items: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string | null;
  }[];
}

export async function createOrder(input: CreateOrderInput) {
  const orderNumber = await generateOrderNumber();

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        status: "PAID",
        subtotal: input.subtotal,
        shipping: input.shipping,
        tax: input.tax,
        total: input.total,
        stripeSessionId: input.sessionId,
        stripePaymentId: input.paymentId,
        email: input.email,
        shippingAddress: input.shippingAddress,
        items: {
          create: input.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            color: i.color,
          })),
        },
      },
      include: withItems,
    });

    // Clear the user's cart
    await tx.cartItem.deleteMany({ where: { userId: input.userId } });

    // Decrement stock
    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  });
}