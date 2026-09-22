"use client";

import Image from "next/image";
import { Shield, ShieldOff, Trash2 } from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";

export interface TableUser {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
  spend: number;
}

interface Props {
  users: TableUser[];
  selectedId: string | null;
  currentUserId: string | null;
  onSelect: (user: TableUser) => void;
  onToggleRole: (user: TableUser) => void;
  onDelete: (user: TableUser) => void;
  loading: boolean;
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

export function UserTable({
  users,
  selectedId,
  currentUserId,
  onSelect,
  onToggleRole,
  onDelete,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-surface-elevated py-16">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-surface-elevated py-16 text-center">
        <p className="font-display text-lg">No users yet.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Users appear here when they sign up.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated">
      <div className="hidden grid-cols-[minmax(0,1fr)_80px_100px_90px_80px_80px] items-center gap-3 border-b border-border px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
        <span>Customer</span>
        <span className="text-center">Orders</span>
        <span className="text-right">Spent</span>
        <span>Joined</span>
        <span className="text-center">Role</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-border">
        {users.map((u) => {
          const isMe = u.id === currentUserId;
          return (
            <button
              key={u.id}
              onClick={() => onSelect(u)}
              className={cn(
                "grid w-full grid-cols-1 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/50 lg:grid-cols-[minmax(0,1fr)_80px_100px_90px_80px_80px]",
                selectedId === u.id && "bg-[#f5e9c8]/30"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] text-[10px] font-semibold text-white">
                  {u.imageUrl ? (
                    <Image
                      src={u.imageUrl}
                      alt={u.name ?? u.email}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    initials(u.name ?? u.email)
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {u.name ?? "Unnamed"}
                    {isMe && (
                      <span className="ml-2 rounded-full bg-surface px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        You
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.email}
                  </p>
                </div>
              </div>

              <span className="price text-center text-sm">
                {u.orderCount}
              </span>

              <span className="price text-right text-sm font-medium">
                {formatPrice(u.spend)}
              </span>

              <span className="hidden text-xs text-muted-foreground lg:block">
                {formatDate(u.createdAt)}
              </span>

              <div className="flex justify-start lg:justify-center">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    u.role === "ADMIN"
                      ? "bg-[#1b2e24] text-[#fbfaf7]"
                      : "bg-surface text-muted-foreground"
                  )}
                >
                  {u.role === "ADMIN" && <Shield className="h-2.5 w-2.5" />}
                  {u.role}
                </span>
              </div>

              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRole(u);
                  }}
                  disabled={isMe}
                  aria-label={u.role === "ADMIN" ? "Demote" : "Promote"}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isMe ? "You can't change your own role" : ""}
                >
                  {u.role === "ADMIN" ? (
                    <ShieldOff className="h-3.5 w-3.5" />
                  ) : (
                    <Shield className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(u);
                  }}
                  disabled={isMe}
                  aria-label="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isMe ? "You can't delete yourself" : ""}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}