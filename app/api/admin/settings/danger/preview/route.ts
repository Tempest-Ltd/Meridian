import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const [
    orders,
    orderItems,
    products,
    categories,
    addresses,
    reviews,
    carts,
    wishlists,
    notifications,
    newsletter,
    users,
    settings,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.orderItem.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.address.count(),
    prisma.review.count(),
    prisma.cartItem.count(),
    prisma.wishlistItem.count(),
    prisma.notification.count(),
    prisma.newsletterSubscriber.count(),
    prisma.user.count(),
    getStoreSettings(),
  ]);

  return NextResponse.json({
    storeName: settings.name,
    counts: {
      orders,
      orderItems,
      products,
      categories,
      addresses,
      reviews,
      carts,
      wishlists,
      notifications,
      newsletter,
    },
    usersKept: users,
  });
}