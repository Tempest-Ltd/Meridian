import { cn } from "@/lib/utils";

type StatusVariant =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral"
  | "purple";

const VARIANTS: Record<StatusVariant, string> = {
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  neutral: "bg-stone-100 text-stone-600",
  purple: "bg-violet-50 text-violet-700",
};

interface StatusPillProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function StatusPill({
  variant = "neutral",
  children,
  dot = false,
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        VARIANTS[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-emerald-500",
            variant === "info" && "bg-blue-500",
            variant === "warning" && "bg-amber-500",
            variant === "danger" && "bg-rose-500",
            variant === "purple" && "bg-violet-500",
            variant === "neutral" && "bg-stone-400"
          )}
        />
      )}
      {children}
    </span>
  );
}