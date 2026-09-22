import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  createAdminCategory,
  getAdminCategories,
} from "@/lib/queries/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

const CreateSchema = z.object({
  name: z.string().min(2).max(60),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "lowercase, numbers, hyphens only"),
  image: z.string().url().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
});

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const categories = await getAdminCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
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

  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: parsed.data.name }, { slug: parsed.data.slug }],
    },
  });
  if (existing) {
    return NextResponse.json(
      {
        error: "CATEGORY_TAKEN",
        field: existing.slug === parsed.data.slug ? "slug" : "name",
      },
      { status: 409 }
    );
  }

  try {
    const category = await createAdminCategory(parsed.data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("[api/admin/categories POST]", err);
    return NextResponse.json({ error: "CREATE_FAILED" }, { status: 500 });
  }
}