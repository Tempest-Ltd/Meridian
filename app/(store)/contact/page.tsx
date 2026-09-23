export const dynamic = "force-dynamic";

import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShoppingCart,
  Package,
  RotateCcw,
  Shield,
} from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="container py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Get In Touch</span>
              <span className="h-px w-8 bg-[#c9a227]/40" />
            </div>
            <h1 className="mt-3 font-display text-[2.5rem] leading-[1.05] tracking-[-0.02em] md:text-[3.5rem]">
              We&apos;re Here to Help
              <span className="text-[#c9a227]">.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Have a question, need support, or just want to say hello? Our team
              is ready to help. Send us a message and we&apos;ll get back to you
              as soon as possible.
            </p>
          </div>

          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute right-5 top-5 max-w-[140px] rounded-lg bg-white/90 px-3 py-2 backdrop-blur-sm">
              <p className="font-display text-sm italic leading-tight">
                Better Support.
                <br />
                Better Days.
              </p>
              <span className="mt-1 block h-px w-8 bg-[#c9a227]" />
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="container pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr_1.2fr]">
          {/* Contact info */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Contact Information</span>
              <span className="h-px w-6 bg-[#c9a227]/40" />
            </div>
            <ul className="mt-6 space-y-6">
              {[
                { icon: Mail, title: "Email Us", value: "support@meridian.com", sub: "We usually respond within 24 hours" },
                { icon: Phone, title: "Call Us", value: "+234 801 234 5678", sub: "Mon – Fri, 9AM – 6PM (WAT)" },
                { icon: MapPin, title: "Our Office", value: "12 Victoria Island Road", sub: "Lagos, Lagos State 101241, Nigeria" },
                { icon: MessageCircle, title: "Live Chat", value: "Available on our website", sub: "Mon – Fri, 9AM – 6PM (WAT)" },
              ].map(({ icon: Icon, title, value, sub }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {sub}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-surface-elevated p-6">
            <div className="flex items-center gap-3">
              <span className="eyebrow">Send Us a Message</span>
              <span className="h-px w-6 bg-[#c9a227]/40" />
            </div>
            <h2 className="mt-3 font-display text-2xl">Let&apos;s Talk</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you shortly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" placeholder="Your name" required />
              <Field
                label="Email Address"
                placeholder="you@example.com"
                required
              />
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium">
                  Subject <span className="text-rose-500">*</span>
                </span>
                <select className="h-11 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm outline-none focus:border-[#1b2e24]">
                  <option>Select a topic</option>
                  <option>Order issue</option>
                  <option>Shipping</option>
                  <option>Returns</option>
                  <option>Product question</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium">
                  Message <span className="text-rose-500">*</span>
                </span>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full rounded-lg border border-border bg-surface-elevated p-3 text-sm outline-none transition-colors focus:border-[#1b2e24]"
                />
                <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                  0/500
                </span>
              </label>
            </div>

            <button className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90">
              Send Message <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#1b2e24] text-[#fbfaf7]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover opacity-60"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="eyebrow text-[#c9a227]">Customer Support</p>
                <p className="mt-2 font-display text-xl leading-tight">
                  Real People.
                  <br />
                  Actual Help.
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Our support team is always here to make your experience
                  better.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-elevated p-5">
              <h3 className="text-sm font-semibold">Quick Questions</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Find answers to the most common questions.
              </p>
              <ul className="mt-4 space-y-1">
                {[
                  { icon: ShoppingCart, title: "Ordering", sub: "How do I place an order?" },
                  { icon: Package, title: "Shipping & Delivery", sub: "How long does shipping take?" },
                  { icon: RotateCcw, title: "Returns & Exchanges", sub: "What's your return policy?" },
                  { icon: Shield, title: "Product Care", sub: "How do I care for my product?" },
                ].map(({ icon: Icon, title, sub }) => (
                  <li key={title}>
                    <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-surface">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  placeholder,
  required,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]"
      />
    </label>
  );
}