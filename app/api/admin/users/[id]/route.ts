import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { updateAdminUserRole } from "@/lib/queries/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Guard against an admin demoting themselves and losing access
  if (params.id === admin.id) {
    return NextResponse.json(
      { error: "CANNOT_DEMOTE_SELF" },
      { status: 400 }
    );
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
    const user = await updateAdminUserRole(params.id, parsed.data.role);
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[api/admin/users PATCH]", err);
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (params.id === admin.id) {
    return NextResponse.json({ error: "CANNOT_DELETE_SELF" }, { status: 400 });
  }

  const orderCount = await prisma.order.count({ where: { userId: params.id } });
  if (orderCount > 0) {
    return NextResponse.json(
      {
        error: "USER_HAS_ORDERS",
        message: "This user has orders and cannot be deleted.",
      },
      { status: 409 }
    );
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/users DELETE]", err);
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}