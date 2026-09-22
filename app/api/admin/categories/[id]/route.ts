import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteAdminCategory,
  updateAdminCategory,
} from "@/lib/queries/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

const UpdateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  image: z.string().url().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
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

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (parsed.data.slug || parsed.data.name) {
    const clash = await prisma.category.findFirst({
      where: {
        OR: [
          parsed.data.slug ? { slug: parsed.data.slug } : {},
          parsed.data.name ? { name: parsed.data.name } : {},
        ].filter((o) => Object.keys(o).length > 0),
        id: { not: params.id },
      },
    });
    if (clash) {
      return NextResponse.json(
        { error: "CATEGORY_TAKEN" },
        { status: 409 }
      );
    }
  }

  try {
    const category = await updateAdminCategory(params.id, parsed.data);
    return NextResponse.json({ category });
  } catch (err) {
    console.error("[api/admin/categories PATCH]", err);
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    await deleteAdminCategory(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "CATEGORY_HAS_PRODUCTS") {
      return NextResponse.json(
        {
          error: "CATEGORY_HAS_PRODUCTS",
          message: "Move products out of this category before deleting it.",
        },
        { status: 409 }
      );
    }
    console.error("[api/admin/categories DELETE]", err);
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}