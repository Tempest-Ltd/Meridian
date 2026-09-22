import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, User, Sparkles, Globe } from "lucide-react";

const VALUES = [
  { icon: Shield, title: "Quality First", sub: "We source and design only the best." },
  { icon: User, title: "Customer Focused", sub: "Your comfort and satisfaction matter." },
  { icon: Sparkles, title: "Thoughtful Innovation", sub: "Practical solutions for modern life." },
  { icon: Globe, title: "A Healthier Tomorrow", sub: "Better habits. Better you." },
];

const STATS = [
  { value: "100K+", label: "Happy Customers" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "Worldwide", label: "Shipping Available" },
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-background">
      {/* Hero block */}
      <div className="container py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="eyebrow">About Meridian</span>
              <span className="h-px w-8 bg-[#c9a227]/40" />
            </div>
            <h2 className="mt-3 font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em] md:text-[3rem]">
              Better Products.
              <br />A Brighter You<span className="text-[#c9a227]">.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              At Meridian, we believe everyday life should feel better. We
              design premium, functional products that bring comfort,
              convenience, and confidence to your daily routine.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
            >
              Shop Our Products <ArrowRight className="h-4 w-4" />
            </Link>
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
                Comfort
                <br />
                fuels better days.
              </p>
              <span className="mt-1 block h-px w-8 bg-[#c9a227]" />
            </div>
          </div>
        </div>
      </div>

      {/* Values strip */}
      <div className="border-y border-border bg-surface">
        <div className="container grid gap-8 py-12 md:grid-cols-[1.3fr_3fr] md:py-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Our Values</span>
              <span className="h-px w-8 bg-[#c9a227]/40" />
            </div>
            <h3 className="mt-3 font-display text-2xl md:text-3xl">
              What Drives Us
            </h3>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              We&apos;re more than a store — we&apos;re a team that cares about
              your comfort, your goals, and the little things that make a big
              difference.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, sub }) => (
              <div key={title}>
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="container py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr_0.8fr] lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80"
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="eyebrow">Our Mission</span>
              <span className="h-px w-8 bg-[#c9a227]/40" />
            </div>
            <h3 className="mt-3 font-display text-2xl md:text-3xl">
              Comfort for Real Life
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Our mission is simple: to create high-quality ergonomic and
              everyday comfort products that help you feel better, move better,
              and live better — every single day.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[#1b2e24] px-5 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90"
            >
              Shop Our Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="space-y-6">
            {STATS.map((s) => (
              <li key={s.label} className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <Shield className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-lg">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}