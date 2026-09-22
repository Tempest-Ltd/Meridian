import { redirect } from "next/navigation";
import { Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PaymentMethodsManager } from "@/components/store/account/payment-methods-manager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PaymentMethodsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const methods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow">Payment Methods</span>
          <span className="h-px w-8 bg-[#c9a227]/40" />
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          Payment Methods
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Manage your saved payment methods for faster checkout.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <div>
          <p className="text-sm font-medium text-emerald-900">
            Your payments are secure
          </p>
          <p className="mt-0.5 text-xs text-emerald-800/80">
            Full card numbers are never stored on our servers. Only the last 4
            digits are saved for your reference.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <PaymentMethodsManager
            initialMethods={methods.map((m) => ({
              id: m.id,
              brand: m.brand,
              last4: m.last4,
              expMonth: m.expMonth,
              expYear: m.expYear,
              isDefault: m.isDefault,
            }))}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-semibold">Secure & Protected</h3>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                    SSL encrypted checkout
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                    PCI DSS compliant
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                    Fraud protection
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}