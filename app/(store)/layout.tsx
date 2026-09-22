import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { AlertTriangle } from "lucide-react";
import { Topbar } from "@/components/store/navbar/topbar";
import { Navbar } from "@/components/store/navbar/navbar";
import { Footer } from "@/components/store/footer/footer";
import { Providers } from "@/components/shared/providers";
import { CartSync } from "@/components/store/cart-sync";
import { getStoreSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  const [settings, user, categories] = await Promise.all([
    getStoreSettings(),
    getCurrentUser(),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
    }),
  ]);

  const isAdmin = user?.role === "ADMIN";
  const isDown =
    settings.maintenanceMode || settings.storeStatus === "CLOSED";

  if (isDown && !isAdmin) {
    redirect("/maintenance");
  }

  return (
    <Providers>
      <CartSync />
      <div className="flex min-h-screen flex-col">
        {isDown && isAdmin && (
          <div className="flex items-center justify-center gap-2 bg-amber-500 py-2 text-xs font-medium text-amber-950">
            <AlertTriangle className="h-3.5 w-3.5" />
            Store is in{" "}
            {settings.maintenanceMode ? "maintenance mode" : "closed"} — only
            admins can see this.
          </div>
        )}
        <Topbar />
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </Providers>
  );
}