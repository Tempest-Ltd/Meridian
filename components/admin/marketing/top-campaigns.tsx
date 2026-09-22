import { ArrowRight } from "lucide-react";
import { StatusPill } from "@/components/shared/status-pill";

const CAMPAIGNS = [
  { icon: "🔵", name: "Spring Comfort Sale", channel: "Meta Ads", spend: 842, revenue: 4621, roas: "5.48x", status: "Active" },
  { icon: "⚫", name: "Desk Setup Essentials", channel: "TikTok Ads", spend: 611, revenue: 3482, roas: "5.70x", status: "Active" },
  { icon: "🟡", name: "Pain Relief Collection", channel: "Google Ads", spend: 402, revenue: 1902, roas: "4.73x", status: "Active" },
  { icon: "🔴", name: "Re-engagement", channel: "Email Campaign", spend: 228, revenue: 1197, roas: "5.25x", status: "Paused" },
];

export function TopCampaigns() {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-base">Top Campaigns</h3>
        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="hidden grid-cols-[1fr_90px_100px_70px_80px] gap-4 border-b border-border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <span>Campaign</span>
        <span className="text-right">Spend</span>
        <span className="text-right">Revenue</span>
        <span className="text-right">ROAS</span>
        <span className="text-right">Status</span>
      </div>

      <ul className="divide-y divide-border">
        {CAMPAIGNS.map((c) => (
          <li
            key={c.name}
            className="grid grid-cols-2 items-center gap-3 px-5 py-3 text-xs md:grid-cols-[1fr_90px_100px_70px_80px]"
          >
            <div className="col-span-2 flex items-center gap-3 md:col-span-1">
              <span className="text-base">{c.icon}</span>
              <div className="min-w-0">
                <p className="truncate font-medium">{c.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {c.channel}
                </p>
              </div>
            </div>
            <span className="price text-right">${c.spend}</span>
            <span className="price text-right font-medium">
              ${c.revenue.toLocaleString()}
            </span>
            <span className="text-right font-medium text-emerald-600">
              {c.roas}
            </span>
            <div className="text-right">
              <StatusPill
                variant={c.status === "Active" ? "success" : "neutral"}
                dot
              >
                {c.status}
              </StatusPill>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}