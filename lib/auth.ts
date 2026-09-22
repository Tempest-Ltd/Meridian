import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User, Role } from "@prisma/client";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });

  // Even existing users get re-checked against ADMIN_EMAILS on each call
  const clerkUser = await currentUser();
  if (!clerkUser) return existing;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return existing;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

  const shouldBeAdmin = getAdminEmails().includes(email.toLowerCase());

  if (existing) {
    // Promote if listed in ADMIN_EMAILS but not yet an admin
    if (shouldBeAdmin && existing.role !== "ADMIN") {
      return prisma.user.update({
        where: { id: existing.id },
        data: { role: "ADMIN" },
      });
    }
    return existing;
  }

  return prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email,
      name,
      imageUrl: clerkUser.imageUrl,
      role: shouldBeAdmin ? "ADMIN" : "USER",
    },
    update: {},
  });
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === ("ADMIN" as Role);
}