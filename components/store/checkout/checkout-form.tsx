"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CheckoutForm({ hasAddress }: { hasAddress: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!hasAddress) {
      toast.error("Add a shipping address first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        if (data.error === "EMPTY_CART") {
          toast.error("Your cart is empty");
        } else if (data.error === "NO_ADDRESS") {
          toast.error("Add a shipping address first");
        } else {
          toast.error("Couldn't start checkout. Try again.");
        }
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface-elevated p-6">
        <h3 className="text-sm font-semibold">Ready to pay</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ll be redirected to Stripe&apos;s secure checkout where
          you&apos;ll enter your card details. When your payment is confirmed,
          we&apos;ll create your order and email you a receipt.
        </p>

        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            Payments are processed securely by Stripe
          </li>
          <li className="flex items-start gap-2">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            We never see or store your card details
          </li>
          <li className="flex items-start gap-2">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            30-day money-back guarantee on every order
          </li>
        </ul>
      </div>

      {hasAddress ? (
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1b2e24] text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60"
        >
          <Lock className="h-4 w-4" />
          {loading ? "Redirecting to Stripe..." : "Continue to Payment"}
        </button>
      ) : (
        <Link
          href="/account/addresses"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1b2e24] text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
        >
          Add a shipping address
        </Link>
      )}

      <div className="rounded-lg bg-surface p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Testing this store?</p>
        <p className="mt-1">
          Use card <span className="font-mono">4242 4242 4242 4242</span>, any
          future expiry, any CVC. This is Stripe test mode — no real money
          moves.
        </p>
      </div>
    </div>
  );
}