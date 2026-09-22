"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantityStepperProps) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const btn = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-1.5 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "flex items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface disabled:opacity-40",
          btn
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn(
          "text-center text-sm font-medium tabular-nums",
          size === "sm" ? "w-6" : "w-8"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "flex items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface disabled:opacity-40",
          btn
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}