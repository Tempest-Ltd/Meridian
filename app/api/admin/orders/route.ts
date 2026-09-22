import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdminOrderStats, getAdminOrders } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const [orders, stats] = await Promise.all([
    getAdminOrders(),
    getAdminOrderStats(),
  ]);

  return NextResponse.json({ orders, stats });
}