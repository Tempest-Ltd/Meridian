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
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ addresses });
}

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(40).nullable().optional(),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).nullable().optional(),
  city: z.string().min(1).max(80),
  state: z.string().max(80).nullable().optional(),
  postalCode: z.string().max(30).nullable().optional(),
  country: z.string().min(2).max(80),
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

  // If this is the user's first address, force default = true
  const existingCount = await prisma.address.count({
    where: { userId: user.id },
  });
  const shouldBeDefault =
    existingCount === 0 || parsed.data.isDefault === true;

  // If becoming default, clear other defaults first
  if (shouldBeDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      line1: parsed.data.line1,
      line2: parsed.data.line2 ?? null,
      city: parsed.data.city,
      state: parsed.data.state ?? null,
      postalCode: parsed.data.postalCode ?? null,
      country: parsed.data.country,
      isDefault: shouldBeDefault,
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}