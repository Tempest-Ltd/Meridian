"use client";

import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("You're in. Check your inbox for 10% off.");
    setEmail("");
    setLoading(false);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-12 w-full items-center gap-1 rounded-full border border-border bg-surface-elevated pl-4 pr-1 md:max-w-md"
    >
      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        disabled={loading}
        className="group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#1b2e24] px-3 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60 sm:gap-2 sm:px-5"
      >
        <span className="hidden sm:inline">
          {loading ? "..." : "Subscribe"}
        </span>
        <span className="sm:hidden">{loading ? "..." : "Join"}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}