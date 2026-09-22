import Link from "next/link";
import {
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "./newsletter-form";
import { FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background md:mt-24">
      {/* Newsletter band */}
      <div className="container pt-10 md:pt-16">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr_1.2fr] md:items-center md:gap-8 md:p-12">
            {/* Headline */}
            <div>
              <div className="flex items-center gap-3">
                <span className="eyebrow">Join the Meridian Community</span>
                <span className="h-px w-8 bg-[#c9a227]/40" />
              </div>
              <h3 className="mt-3 font-display text-2xl md:text-3xl">
                Get 10% Off Your First Order
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                Be the first to know about new arrivals, exclusive offers, and
                wellness tips.
              </p>
            </div>

            {/* Perks — vertical list on mobile, 3-col on desktop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              <Perk label="Exclusive Offers" />
              <Perk label="Early Access to New Arrivals" />
              <Perk label="Wellness Tips & Guides" />
            </div>

            {/* Newsletter form */}
            <div className="md:justify-self-end">
              <NewsletterForm />
            </div>
          </div>

          <div
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#c9a227]/10 blur-3xl"
            aria-hidden
          />
        </div>
      </div>

      {/* Main footer links */}
      <div className="container py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand block — full width on mobile */}
          <div className="md:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground md:mt-5">
              {SITE.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground md:mt-6">
              We design premium everyday essentials that bring comfort,
              convenience, and confidence to your daily routine.
            </p>

            <div className="mt-5 flex items-center gap-3 md:mt-6">
              {[Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[#1b2e24] hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-[#1b2e24] hover:text-foreground"
              >
                tt
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-[#1b2e24] hover:text-foreground"
              >
                X
              </a>
            </div>
          </div>

          {/* Link columns — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            <FooterColumn eyebrow="Shop" links={FOOTER_LINKS.shop} />
            <FooterColumn
              eyebrow="Customer Care"
              links={FOOTER_LINKS.customerCare}
            />
            <FooterColumn eyebrow="About" links={FOOTER_LINKS.about} />

            {/* Contact — spans 2 cols on mobile so it doesn't cramp */}
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow">Contact Us</p>
              <ul className="mt-4 space-y-3.5 text-sm md:mt-5">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="break-words text-foreground">
                      {SITE.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We reply within 24 hours
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-foreground">{SITE.phone}</p>
                    <p className="text-xs text-muted-foreground">
                      {SITE.hours}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-foreground">{SITE.address}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#1b2e24] text-[#fbfaf7]">
        <div className="container flex flex-col gap-4 py-5 text-xs sm:gap-3">
          {/* Row 1: logo + copyright */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo variant="light" />
              <span className="hidden h-3 w-px bg-white/20 sm:block" />
              <span className="text-white/70">
                © {new Date().getFullYear()} Meridian.
              </span>
            </div>

            <span className="flex items-center gap-1.5 text-white/70">
              <Shield className="h-3.5 w-3.5" />
              Secure payments
            </span>
          </div>

          {/* Row 2: payment methods */}
          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0">
            <div className="flex items-center gap-1.5 rounded-md bg-surface-elevated px-2 py-1">
              {["VISA", "MC", "PayPal", "ApplePay", "GPay"].map((label) => (
                <span
                  key={label}
                  className="text-[9px] font-bold tracking-tight text-[#1b2e24] sm:text-[10px]"
                >
                  {label}
                </span>
              ))}
            </div>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="rounded-md border border-white/20 px-2.5 py-1.5 text-[10px] text-white/70">
              Your privacy matters
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  eyebrow,
  links,
}: {
  eyebrow: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <ul className="mt-4 space-y-2.5 text-sm md:mt-5 md:space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Perk({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 md:flex-col md:items-start md:text-left">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c9a227]/30">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
      </span>
      <p className="text-xs leading-snug text-muted-foreground md:mt-2">
        {label}
      </p>
    </div>
  );
}