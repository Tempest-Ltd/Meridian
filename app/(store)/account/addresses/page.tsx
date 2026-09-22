import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { AddressManager } from "@/components/store/account/address-manager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow">Addresses</span>
            <span className="h-px w-8 bg-[#c9a227]/40" />
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">
            Addresses
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <AddressManager
            initialAddresses={addresses.map((a) => ({
              id: a.id,
              name: a.name,
              phone: a.phone,
              line1: a.line1,
              line2: a.line2,
              city: a.city,
              state: a.state,
              postalCode: a.postalCode,
              country: a.country,
              isDefault: a.isDefault,
            }))}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold">Address Tips</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Set a default shipping address for faster checkout. You can
                  still change it at checkout.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}