"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "Order issue",
  "Shipping or delivery",
  "Return or refund",
  "Product question",
  "Account issue",
  "Payment issue",
  "Other",
];

const inputClass =
  "h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm outline-none transition-colors focus:border-[#1b2e24]";

export function SupportForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!subject) return toast.error("Pick a subject");
    if (message.trim().length < 10)
      return toast.error("Message should be at least 10 characters");

    setSending(true);
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      }),
    });
    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      toast.error("Couldn't send your message. Try again.");
      return;
    }

    toast.success("Message sent. We'll get back to you within 24 hours.");
    setSubject("");
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface-elevated p-6"
    >
      <div className="mb-5">
        <h2 className="text-sm font-semibold">Send Us a Message</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you shortly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium">
            Full Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium">Subject *</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a topic</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium">Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          placeholder="How can we help you?"
          rows={6}
          className={cn(inputClass, "h-auto resize-none py-2.5")}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {message.length}/500
        </p>
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-[#1b2e24] px-6 text-sm font-medium text-[#fbfaf7] transition-colors hover:bg-[#1b2e24]/90 disabled:opacity-60"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {sending ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}