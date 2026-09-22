import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { addToCart, clearCart, getCart } from "@/lib/queries/cart";

export const dynamic = "force-dynamic";

const AddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
  color: z.string().nullable().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ items: [], count: 0, subtotal: 0 });
  }
  const items = await getCart(user.id);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  return NextResponse.json({ items, count, subtotal });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = AddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    await addToCart(
      user.id,
      parsed.data.productId,
      parsed.data.quantity,
      parsed.data.color ?? null
    );
    const items = await getCart(user.id);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "ADD_FAILED" }, { status: 400 });
  }
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  await clearCart(user.id);
  return NextResponse.json({ ok: true });
}