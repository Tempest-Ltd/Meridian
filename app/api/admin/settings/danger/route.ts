import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStoreSettings, updateStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const ResetSchema = z.object({
  confirmName: z.string().min(1),
  understood: z.literal(true),
  acceptLoss: z.literal(true),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = ResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const settings = await getStoreSettings();

  // Gate 2 — must type the store name
  if (
    parsed.data.confirmName.trim().toLowerCase() !==
    settings.name.trim().toLowerCase()
  ) {
    return NextResponse.json(
      { error: "NAME_MISMATCH", expected: settings.name },
      { status: 400 }
    );
  }

  // Gate 3 — both checkboxes already enforced by z.literal(true)

  const summary = await prisma.$transaction(async (tx) => {
    const orderItems = await tx.orderItem.deleteMany({});
    const orders = await tx.order.deleteMany({});
    const carts = await tx.cartItem.deleteMany({});
    const wishlists = await tx.wishlistItem.deleteMany({});
    const reviews = await tx.review.deleteMany({});
    const addresses = await tx.address.deleteMany({});
    const notifications = await tx.notification.deleteMany({});
    const products = await tx.product.deleteMany({});
    const categories = await tx.category.deleteMany({});
    const newsletters = await tx.newsletterSubscriber.deleteMany({});

    return {
      orderItems: orderItems.count,
      orders: orders.count,
      carts: carts.count,
      wishlists: wishlists.count,
      reviews: reviews.count,
      addresses: addresses.count,
      notifications: notifications.count,
      products: products.count,
      categories: categories.count,
      newsletters: newsletters.count,
    };
  });

  await updateStoreSettings({
    name: "Meridian",
    url: "https://meridian.com",
    email: "support@meridian.com",
    logoUrl: null,
    timezone: "Africa/Lagos",
    language: "en",
    currency: "USD",
    storeStatus: "LIVE",
    maintenanceMode: false,
    defaultCountry: "NG",
    dateFormat: "MMM d, yyyy",
    theme: "light",
    primaryColor: "#1b2e24",
  });

  return NextResponse.json({ ok: true, deleted: summary });
}