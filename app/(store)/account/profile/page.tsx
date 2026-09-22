import { redirect } from "next/navigation";
import { User as UserIcon, Mail, Shield } from "lucide-react";
import { ProfileForm } from "@/components/store/account/profile-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const orderCount = await prisma.order.count({
    where: { userId: user.id },
  });

  const spendAgg = await prisma.order.aggregate({
    where: { userId: user.id, status: { not: "CANCELLED" } },
    _sum: { total: true },
  });

  const totalSpent = Number(spendAgg._sum.total ?? 0);
  const [firstName, ...rest] = (user.name ?? "").split(" ");
  const lastName = rest.join(" ");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow">Profile</span>
          <span className="h-px w-8 bg-[#c9a227]/40" />
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Profile Settings
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Update your personal information and manage your account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-5">
          <ProfileForm
            initialFirstName={firstName ?? ""}
            initialLastName={lastName}
            email={user.email}
            imageUrl={user.imageUrl}
            role={user.role}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold">Account Summary</h3>
            <div className="mt-4 space-y-3 text-xs">
              <SummaryRow
                icon={UserIcon}
                label="Full name"
                value={user.name ?? "Not set"}
              />
              <SummaryRow icon={Mail} label="Email" value={user.email} />
              <SummaryRow
                icon={Shield}
                label="Account type"
                value={user.role === "ADMIN" ? "Admin" : "Customer"}
              />
              <div className="border-t border-border pt-3">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">
                    {formatDate(user.createdAt)}
                  </span>
                </p>
              </div>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Total orders</span>
                <span className="price font-medium">{orderCount}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Total spent</span>
                <span className="price font-medium">
                  ${totalSpent.toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold">Security</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Password, 2FA, and connected accounts are managed by Clerk.
            </p>
            <a
              href="https://accounts.clerk.dev/user"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-4 text-xs font-medium transition-colors hover:border-[#1b2e24]"
            >
              Manage account security
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-xs font-medium">{value}</p>
      </div>
    </div>
  );
}