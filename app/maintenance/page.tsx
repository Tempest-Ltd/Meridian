import Link from "next/link";
import { Wrench } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const settings = await getStoreSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <span className="mt-12 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface">
          <Wrench className="h-7 w-7 text-muted-foreground" />
        </span>

        <p className="eyebrow mt-6">We&apos;ll be right back</p>
        <h1 className="mt-3 font-display text-4xl">
          {settings.name} is down for maintenance.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We&apos;re making a few improvements. Check back shortly — we
          won&apos;t be long.
        </p>

        {settings.email && (
          <p className="mt-6 text-xs text-muted-foreground">
            Need help? Email{" "}
            <a
              href={`mailto:${settings.email}`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              {settings.email}
            </a>
          </p>
        )}

        <Link
          href="/sign-in"
          className="mt-8 inline-flex h-10 items-center rounded-md border border-border bg-surface-elevated px-5 text-sm font-medium transition-colors hover:border-primary"
        >
          Admin sign in
        </Link>
      </div>
    </div>
  );
}