import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/queries/cart";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const cart = await getCart(user.id);
  if (cart.length === 0) {
    return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
  }

  const addressCount = await prisma.address.count({
    where: { userId: user.id },
  });
  if (addressCount === 0) {
    return NextResponse.json({ error: "NO_ADDRESS" }, { status: 400 });
  }

  const subtotal = cart.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 800;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { userId: user.id },
      line_items: cart.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(line.product.price * 100),
          product_data: {
            name: line.product.name,
            images: line.product.images.slice(0, 1),
            metadata: {
              productId: line.productId,
              color: line.color ?? "",
            },
          },
        },
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shipping, currency: "usd" },
            display_name:
              shipping === 0 ? "Free Shipping" : "Standard Shipping",
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: [
          "NG",
          "US",
          "GB",
          "CA",
          "DE",
          "FR",
          "ZA",
          "GH",
          "KE",
        ],
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[api/checkout]", error);
    return NextResponse.json(
      { error: "CHECKOUT_FAILED" },
      { status: 500 }
    );
  }
}