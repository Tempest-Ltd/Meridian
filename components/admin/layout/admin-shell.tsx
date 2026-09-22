"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";

interface AdminUser {
  name: string;
  email: string;
  imageUrl: string | null;
}

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AdminSidebar
        user={user}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="min-w-0 lg:pl-60">
        <AdminTopbar
          user={user}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="min-w-0 px-4 py-5 md:px-5">{children}</main>
      </div>
    </div>
  );
}