import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getStoreSettings, updateStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const SettingsSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  url: z.string().url().nullable().optional(),
  email: z.string().email().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  timezone: z.string().min(1).max(60).optional(),
  language: z.string().min(2).max(10).optional(),
  currency: z.enum(["USD", "NGN", "GBP", "EUR", "CAD", "ZAR"]).optional(),
  storeStatus: z.enum(["LIVE", "CLOSED"]).optional(),
  maintenanceMode: z.boolean().optional(),
  defaultCountry: z.string().length(2).optional(),
  dateFormat: z.string().min(3).max(30).optional(),
  theme: z.enum(["light", "dark", "forest", "minimal"]).optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color")
    .optional(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const settings = await getStoreSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const updated = await updateStoreSettings(parsed.data);
  return NextResponse.json(updated);
}