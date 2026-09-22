"use client";

import Image from "next/image";
import { formatDate } from "@/lib/utils";

export interface ActivityUser {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  createdAt: string;
  orderCount: number;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RecentActivity({ users }: { users: ActivityUser[] }) {
  const recent = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5">
      <h3 className="font-display text-lg">Recent Signups</h3>

      {recent.length === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">
          No users yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {recent.map((u) => (
            <li key={u.id} className="flex items-center gap-3">
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-[10px] font-semibold text-white">
                {u.imageUrl ? (
                  <Image
                    src={u.imageUrl}
                    alt={u.name ?? u.email}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  initials(u.name ?? u.email)
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">
                  {u.name ?? "Unnamed"}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {u.email}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatDate(u.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}