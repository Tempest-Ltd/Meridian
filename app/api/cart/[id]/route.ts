import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { removeCartItem, updateCartItem } from "@/lib/queries/cart";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  quantity: z.number().int().min(0).max(99),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  try {
    await updateCartItem(user.id, params.id, parsed.data.quantity);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    await removeCartItem(user.id, params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 400 });
  }
}