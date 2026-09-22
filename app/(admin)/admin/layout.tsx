import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.role !== "ADMIN") redirect("/account");

  const userData = {
    name: user.name ?? "Admin",
    email: user.email,
    imageUrl: user.imageUrl,
  };

  return <AdminShell user={userData}>{children}</AdminShell>;
}