import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
  href?: string;
}

export function Logo({ className, variant = "default", href = "/" }: LogoProps) {
  const color = variant === "light" ? "text-[#fbfaf7]" : "text-foreground";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-baseline gap-1 font-display text-xl font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-80",
        color,
        className
      )}
      aria-label="Meridian home"
    >
      <span>Meridian</span>
      <span className="text-[#c9a227] text-2xl leading-none">.</span>
    </Link>
  );
}