import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/store/account/account-sidebar";
import { AccountMobileNav } from "@/components/store/account/account-mobile-nav";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const userData = {
    name: user.name ?? "Member",
    email: user.email,
    imageUrl: user.imageUrl,
  };

  return (
    <div className="container py-6 md:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">
          <AccountSidebar user={userData} />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-5 lg:hidden">
            <AccountMobileNav user={userData} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}