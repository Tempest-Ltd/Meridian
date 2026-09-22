import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PrefsSchema = z.object({
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  accountActivity: z.boolean(),
  productUpdates: z.boolean(),
  marketingEmails: z.boolean(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const prefs = (user.notificationPrefs as Record<string, boolean>) ?? {
    orderUpdates: true,
    promotions: true,
    accountActivity: true,
    productUpdates: true,
    marketingEmails: false,
  };
  return NextResponse.json({ prefs });
}

export async function PATCH(req: Request) {
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
  const parsed = PrefsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { notificationPrefs: parsed.data },
  });
  return NextResponse.json({ prefs: parsed.data });
}