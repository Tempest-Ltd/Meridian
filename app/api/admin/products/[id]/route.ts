import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteAdminProduct,
  getAdminProduct,
  updateAdminProduct,
} from "@/lib/queries/admin";
import { ProductUpdateSchema } from "@/lib/validations/product";
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
  const product = await getAdminProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

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

  console.log("[admin] PATCH /api/admin/products body:", body);

  const parsed = ProductUpdateSchema.safeParse(body);
  if (!parsed.success) {
    console.error("[admin] validation failed:", parsed.error.issues);
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (parsed.data.slug) {
    const taken = await prisma.product.findFirst({
      where: { slug: parsed.data.slug, id: { not: params.id } },
    });
    if (taken) {
      return NextResponse.json(
        { error: "SLUG_TAKEN", field: "slug" },
        { status: 409 }
      );
    }
  }

  try {
    const product = await updateAdminProduct(params.id, parsed.data);

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[api/admin/products PATCH]", err);
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
    const product = await getAdminProduct(params.id);
    await deleteAdminProduct(params.id);

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    if (product?.slug) revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "PRODUCT_IN_ORDERS") {
      return NextResponse.json(
        {
          error: "PRODUCT_IN_ORDERS",
          message:
            "This product is part of existing orders and cannot be deleted.",
        },
        { status: 409 }
      );
    }
    console.error("[api/admin/products DELETE]", err);
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}