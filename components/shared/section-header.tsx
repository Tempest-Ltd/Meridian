import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View All",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px w-8 bg-[#c9a227]/40" />
        </div>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{title}</h2>
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-[#c9a227]"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}