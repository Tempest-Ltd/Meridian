"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  /** Controlled mode: pass open + onClose */
  open?: boolean;
  onClose?: () => void;
  /** Trigger mode: pass a render function to get a custom trigger button */
  trigger?: (open: () => void) => React.ReactNode;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right";
  width?: "sm" | "md" | "lg";
}

export function MobileDrawer({
  open: controlledOpen,
  onClose: controlledClose,
  trigger,
  children,
  title,
  side = "left",
  width = "md",
}: MobileDrawerProps) {
  const isControlled = controlledOpen !== undefined;
  const open = controlledOpen ?? false;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") controlledClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, controlledClose]);

  // Trigger mode — always render the trigger, control internal state
  if (!isControlled && trigger) {
    return (
      <TriggerDrawer
        trigger={trigger}
        title={title}
        side={side}
        width={width}
      >
        {children}
      </TriggerDrawer>
    );
  }

  // Controlled mode
  if (!open) return null;

  const widthClass =
    width === "sm"
      ? "max-w-[280px]"
      : width === "lg"
      ? "max-w-md"
      : "max-w-[340px]";

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/50"
        style={{ animation: "fadeIn 0.2s ease" }}
        onClick={controlledClose}
        aria-hidden
      />
      <aside
        className={cn(
          "absolute inset-y-0 flex w-[85vw] flex-col bg-surface-elevated shadow-2xl",
          widthClass,
          side === "left" ? "left-0" : "right-0"
        )}
        style={{
          animation: `${
            side === "left" ? "slideInLeft" : "slideInRight"
          } 0.25s cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <p className="font-display text-base">{title ?? "Menu"}</p>
          <button
            onClick={controlledClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

function TriggerDrawer({
  trigger,
  children,
  title,
  side,
  width,
}: {
  trigger: (open: () => void) => React.ReactNode;
  children: React.ReactNode;
  title?: string;
  side: "left" | "right";
  width: "sm" | "md" | "lg";
}) {
  const [open, setOpen] = useInternalOpen();
  return (
    <>
      {trigger(() => setOpen(true))}
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        side={side}
        width={width}
      >
        {children}
      </MobileDrawer>
    </>
  );
}

function useInternalOpen() {
  const React = require("react") as typeof import("react");
  return React.useState(false);
}