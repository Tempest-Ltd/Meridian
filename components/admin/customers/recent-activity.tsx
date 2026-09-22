import { ArrowRight } from "lucide-react";

const ACTIVITY = [
  { name: "John Doe", action: "placed a new order", time: "2 minutes ago", tone: "success", tag: "Order" },
  { name: "Sarah Johnson", action: "registered an account", time: "12 minutes ago", tone: "info", tag: "New" },
  { name: "Mike Chen", action: "placed a new order", time: "38 minutes ago", tone: "success", tag: "Order" },
  { name: "Emily Davis", action: "updated their profile", time: "1 hour ago", tone: "purple", tag: "Profile" },
];

const TONES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-blue-50 text-blue-700",
  purple: "bg-violet-50 text-violet-700",
};

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base">Recent Activity</h3>
        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground">
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <ul className="mt-4 space-y-4">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-[10px] font-semibold">
              {a.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs">
                <span className="font-medium">{a.name}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {a.time}
              </p>
            </div>
            <span
              className={
                "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold " +
                TONES[a.tone]
              }
            >
              {a.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}