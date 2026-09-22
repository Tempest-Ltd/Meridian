import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SupportForm } from "@/components/store/account/support-form";
import { getCurrentUser } from "@/lib/auth";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

const QUICK_QUESTIONS = [
  {
    icon: ShoppingCart,
    title: "Ordering",
    sub: "How do I place an order?",
    href: "/shop",
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    sub: "How long does shipping take?",
    href: "/about",
  },
  {
    icon: RotateCcw,
    title: "Returns & Exchanges",
    sub: "What's your return policy?",
    href: "/about",
  },
  {
    icon: Sparkles,
    title: "Product Care",
    sub: "How do I care for my product?",
    href: "/about",
  },
];

export default async function SupportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow">Help & Support</span>
          <span className="h-px w-8 bg-[#c9a227]/40" />
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl">
          How can we help?
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Browse common topics below or reach out to our team directly.
          We respond within 24 hours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <h2 className="text-sm font-semibold">Contact Information</h2>
            <div className="mt-5 space-y-4">
              <ContactRow
                icon={Mail}
                title="Email Us"
                value={SITE.email}
                sub="We usually respond within 24 hours"
              />
              <ContactRow
                icon={Phone}
                title="Call Us"
                value={SITE.phone}
                sub={SITE.hours}
              />
              <ContactRow
                icon={MapPin}
                title="Our Office"
                value={SITE.address}
              />
              <ContactRow
                icon={MessageCircle}
                title="Live Chat"
                value="Available on our website"
                sub="Mon – Fri, 9AM – 6PM (WAT)"
              />
            </div>
          </div>

          <SupportForm defaultName={user.name ?? ""} defaultEmail={user.email} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold">Quick Questions</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Answers to the most common questions.
            </p>
            <ul className="mt-4 space-y-1">
              {QUICK_QUESTIONS.map(({ icon: Icon, title, sub, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-surface"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {sub}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface-elevated p-5">
            <h3 className="text-sm font-semibold">Still need help?</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Our support team is here for you.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-4 text-xs font-medium transition-colors hover:border-[#1b2e24]"
            >
              <MessageCircle className="h-3 w-3" />
              Start Live Chat
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  title,
  value,
  sub,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-foreground">{value}</p>
        {sub && <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}