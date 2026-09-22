"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  initialFirstName: string;
  initialLastName: string;
  email: string;
  imageUrl: string | null;
  role: string;
}

const inputClass =
  "h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";

export function ProfileForm({
  initialFirstName,
  initialLastName,
  email,
  imageUrl,
  role,
}: Props) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [saving, setSaving] = useState(false);

  const dirty =
    firstName !== initialFirstName || lastName !== initialLastName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !user) return;

    if (!firstName.trim()) return toast.error("First name is required");

    setSaving(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      toast.success("Profile updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface-elevated p-6"
    >
      <div className="mb-6">
        <h2 className="text-sm font-semibold">Personal Information</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Your name is used on receipts and order confirmations.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1b2e24] font-display text-lg text-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            initials.toUpperCase() || "U"
          )}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            Profile photo is synced from your sign-in provider.
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            To change it, update your Google or Clerk profile.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium">
            First Name *
          </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium">
            Last Name
          </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium">
          Email Address
        </label>
        <div className="relative">
          <input
            value={email}
            readOnly
            disabled
            className={cn(inputClass, "cursor-not-allowed bg-surface/60")}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Managed by Clerk
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          To change your email, use the "Manage account security" link on the
          right.
        </p>
      </div>

      {role === "ADMIN" && (
        <div className="mt-4 rounded-lg border border-[#c9a227]/30 bg-[#f5e9c8]/40 px-3 py-2.5">
          <p className="text-xs font-medium text-[#8a6d1a]">
            Admin account
          </p>
          <p className="mt-0.5 text-[10px] text-[#8a6d1a]/80">
            You have access to the admin dashboard and store settings.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end border-t border-border pt-4">
        <button
          type="submit"
          disabled={!dirty || saving}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium transition-colors",
            dirty
              ? "bg-[#1b2e24] text-[#fbfaf7] hover:bg-[#1b2e24]/90"
              : "cursor-not-allowed bg-surface text-muted-foreground"
          )}
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}