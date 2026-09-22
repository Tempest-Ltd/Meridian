"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  current: number;
  total: number;
  onChange?: (page: number) => void;
}

export function Pagination({ current, total, onChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        aria-label="Previous page"
        disabled={current === 1}
        onClick={() => onChange?.(current - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted-foreground transition-colors hover:border-[#1b2e24]/30 hover:text-foreground disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: total }).map((_, i) => {
        const page = i + 1;
        const active = page === current;
        return (
          <button
            key={page}
            onClick={() => onChange?.(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
              active
                ? "border-[#1b2e24] bg-[#1b2e24] text-white"
                : "border-border bg-surface-elevated text-foreground hover:border-[#1b2e24]/30"
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        aria-label="Next page"
        disabled={current === total}
        onClick={() => onChange?.(current + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted-foreground transition-colors hover:border-[#1b2e24]/30 hover:text-foreground disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}