import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdminUsers, getAdminUserStats } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const [users, stats] = await Promise.all([
    getAdminUsers(),
    getAdminUserStats(),
  ]);

  return NextResponse.json({ users, stats });
}