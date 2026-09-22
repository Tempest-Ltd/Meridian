import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const ITEMS = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    subtitle: "100% protected",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "30-day policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:divide-x md:divide-border">
        {ITEMS.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="flex items-center gap-3 px-2 md:justify-center"
          >
            <Icon className="h-5 w-5 shrink-0 text-foreground" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}