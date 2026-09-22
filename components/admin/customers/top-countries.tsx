import { ArrowRight } from "lucide-react";

const COUNTRIES = [
  { name: "Nigeria", flag: "🇳🇬", pct: 32, value: 910 },
  { name: "United States", flag: "🇺🇸", pct: 24, value: 682 },
  { name: "United Kingdom", flag: "🇬🇧", pct: 16, value: 455 },
  { name: "Canada", flag: "🇨🇦", pct: 8, value: 227 },
  { name: "Germany", flag: "🇩🇪", pct: 6, value: 170 },
];

export function TopCountries() {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base">Top Countries</h3>
        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {COUNTRIES.map((c) => (
          <li key={c.name} className="flex items-center gap-3 text-xs">
            <span className="text-base">{c.flag}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-muted-foreground">
                  {c.pct}% · {c.value}
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full bg-[#1b2e24]"
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}