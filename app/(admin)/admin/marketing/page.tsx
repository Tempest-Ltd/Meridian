import { Target, DollarSign, TrendingUp, Users, ArrowUp, ArrowRight } from "lucide-react";
import { PerformanceTrend } from "@/components/admin/marketing/performance-trend";
import { TrafficSources } from "@/components/admin/marketing/traffic-sources";
import { TopCampaigns } from "@/components/admin/marketing/top-campaigns";
import { TopAds } from "@/components/admin/marketing/top-ads";
import { AdSpendChart } from "@/components/admin/marketing/ad-spend-chart";

export const metadata = { title: "Marketing" };

const KPIS = [
  { label: "Total Ad Spend", value: "$2,483.00", delta: "18%", icon: DollarSign, color: "#f59e0b" },
  { label: "Attributed Revenue", value: "$12,602.00", delta: "32%", icon: Target, color: "#10b981" },
  { label: "ROAS", value: "5.07x", delta: "21%", icon: TrendingUp, color: "#3b82f6" },
  { label: "New Customers", value: "487", delta: "18%", icon: Users, color: "#8b5cf6" },
];

export default function AdminMarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Marketing</span>
          <h1 className="mt-2 font-display text-3xl">
            Marketing Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your campaigns, ad performance, and customer acquisition
            results.
          </p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 text-sm font-medium transition-colors hover:border-[#1b2e24]">
          Apr 20, 2025 – Apr 26, 2025
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ label, value, delta, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface-elevated p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: `${color}18`, color }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
            <p className="mt-3 font-display text-2xl">{value}</p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                <ArrowUp className="h-3 w-3" />
                {delta}
              </span>
              <span className="text-muted-foreground">vs. previous 7 days</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PerformanceTrend />
        <TrafficSources />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <TopCampaigns />
        <TopAds />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <AdSpendChart />
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-elevated">
              <Target className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-base">
                More Customers, Lower Costs
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Use audience lookalikes and retargeting to increase conversions
                and improve your ROAS.
              </p>
              <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[#1b2e24] px-4 text-xs font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90">
                Create Campaign <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}