import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  getAdminOrder,
  isValidOrderStatus,
} from "@/lib/queries/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const order = await getAdminOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

const PatchSchema = z.object({
  status: z.string().min(1).optional(),
  email: z.string().email().optional(),
  subtotal: z.number().min(0).optional(),
  shipping: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  shippingAddress: z
    .object({
      name: z.string().max(120).optional().default(""),
      line1: z.string().max(200).optional().default(""),
      line2: z.string().max(200).optional().default(""),
      city: z.string().max(80).optional().default(""),
      state: z.string().max(80).optional().default(""),
      postalCode: z.string().max(30).optional().default(""),
      country: z.string().max(80).optional().default(""),
    })
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
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
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (parsed.data.status && !isValidOrderStatus(parsed.data.status)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
  if (parsed.data.email !== undefined) updateData.email = parsed.data.email;
  if (parsed.data.subtotal !== undefined) updateData.subtotal = parsed.data.subtotal;
  if (parsed.data.shipping !== undefined) updateData.shipping = parsed.data.shipping;
  if (parsed.data.tax !== undefined) updateData.tax = parsed.data.tax;
  if (parsed.data.total !== undefined) updateData.total = parsed.data.total;
  if (parsed.data.shippingAddress !== undefined)
    updateData.shippingAddress = parsed.data.shippingAddress;

  try {
    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[api/admin/orders PATCH]", err);
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}