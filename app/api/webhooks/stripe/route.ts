import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createOrder, getOrderBySessionId } from "@/lib/queries/orders";
import { OrderConfirmation } from "@/emails/order-confirmation";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "NO_SIGNATURE" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutCompleted(session);
    } catch (err) {
      console.error("[webhook] handler error", err);
      return NextResponse.json({ error: "HANDLER_FAILED" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const sessionId = session.id;

  // Idempotency — if order already exists for this session, skip
  const existing = await getOrderBySessionId(sessionId);
  if (existing) {
    console.log(`[webhook] order already exists for session ${sessionId}`);
    return;
  }

  const userId = (session.metadata?.userId as string) || session.client_reference_id;
  if (!userId) {
    throw new Error("Missing userId in session");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // Get cart items from DB (they're still there — webhook runs before cart is cleared)
  const cart = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: { include: { category: true } },
    },
  });

  if (cart.length === 0) {
    console.log("[webhook] cart already cleared, ignoring");
    return;
  }

  const subtotal = cart.reduce(
    (s, i) => s + Number(i.product.price) * i.quantity,
    0
  );
  const shippingAmount =
    (session.total_details?.amount_shipping ?? 0) / 100;
  const taxAmount = (session.total_details?.amount_tax ?? 0) / 100;
  const total = session.amount_total ? session.amount_total / 100 : subtotal;
  const email = session.customer_details?.email ?? user.email;

  const address = session.collected_information?.shipping_details?.address;
  const name = session.collected_information?.shipping_details?.name ?? user.name ?? "";
  const shippingAddress = address
    ? {
        name,
        line1: address.line1 ?? "",
        line2: address.line2 ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        postalCode: address.postal_code ?? "",
        country: address.country ?? "",
      }
    : { name, line1: "", line2: "", city: "", state: "", postalCode: "", country: "" };

  const order = await createOrder({
    userId,
    sessionId,
    paymentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
    email,
    subtotal,
    shipping: shippingAmount,
    tax: taxAmount,
    total,
    shippingAddress,
    items: cart.map((c) => ({
      productId: c.productId,
      name: c.product.name,
      image: c.product.images[0] ?? "",
      price: Number(c.product.price),
      quantity: c.quantity,
      color: c.color,
    })),
  });

  console.log(`[webhook] order ${order.orderNumber} created`);

  // Send confirmation email
  const addressLines = [
    shippingAddress.name,
    shippingAddress.line1,
    shippingAddress.line2,
    `${shippingAddress.city}${shippingAddress.state ? `, ${shippingAddress.state}` : ""} ${shippingAddress.postalCode}`.trim(),
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await resend.emails.send({
      from: `Meridian <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: `Order #${order.orderNumber} confirmed`,
      react: OrderConfirmation({
        orderNumber: order.orderNumber,
        customerName: user.name ?? "there",
        items: cart.map((c) => ({
          name: c.product.name,
          image: c.product.images[0] ?? "",
          price: Number(c.product.price),
          quantity: c.quantity,
        })),
        subtotal,
        shipping: shippingAmount,
        total,
        shippingAddress: addressLines,
      }),
    });
    console.log(`[webhook] confirmation email sent to ${email}`);
  } catch (err) {
    console.error("[webhook] email send failed", err);
    // Don't throw — order is created regardless
  }
}