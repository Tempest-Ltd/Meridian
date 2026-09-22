import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({
      signedIn: false,
      role: null,
      name: null,
      email: null,
      imageUrl: null,
    });
  }

  return NextResponse.json({
    signedIn: true,
    role: user.role,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
  });
}