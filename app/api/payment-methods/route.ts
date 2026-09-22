import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const methods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ methods });
}

const CreateSchema = z.object({
  brand: z.enum(["VISA", "MASTERCARD", "VERVE", "AMEX"]),
  last4: z.string().regex(/^\d{4}$/, "Must be exactly 4 digits"),
  expMonth: z.number().int().min(1).max(12),
  expYear: z.number().int().min(new Date().getFullYear()),
  isDefault: z.boolean().optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const count = await prisma.paymentMethod.count({
    where: { userId: user.id },
  });
  const shouldBeDefault =
    count === 0 || parsed.data.isDefault === true;

  if (shouldBeDefault) {
    await prisma.paymentMethod.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const method = await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      brand: parsed.data.brand,
      last4: parsed.data.last4,
      expMonth: parsed.data.expMonth,
      expYear: parsed.data.expYear,
      isDefault: shouldBeDefault,
    },
  });

  return NextResponse.json({ method }, { status: 201 });
}