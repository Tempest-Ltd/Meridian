import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { NotificationsManager } from "@/components/store/account/notifications-manager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const prefs = (user.notificationPrefs as Record<string, boolean>) ?? {
    orderUpdates: true,
    promotions: true,
    accountActivity: true,
    productUpdates: true,
    marketingEmails: false,
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow">Notifications</span>
          <span className="h-px w-8 bg-[#c9a227]/40" />
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Your Notifications
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Stay updated with your orders, offers, and account activity.
        </p>
      </div>

      <NotificationsManager
        initialNotifications={notifications.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          type: n.type,
          read: n.read,
          createdAt: n.createdAt.toISOString(),
        }))}
        initialPrefs={prefs}
      />
    </div>
  );
}