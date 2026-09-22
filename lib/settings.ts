import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface StoreSettingsData {
  id: string;
  name: string;
  url: string | null;
  email: string | null;
  logoUrl: string | null;
  timezone: string;
  language: string;
  currency: string;
  storeStatus: "LIVE" | "CLOSED";
  maintenanceMode: boolean;
  defaultCountry: string;
  dateFormat: string;
  theme: "light" | "dark" | "forest" | "minimal";
  primaryColor: string;
}

const DEFAULTS: StoreSettingsData = {
  id: "singleton",
  name: "Meridian",
  url: "https://meridian.com",
  email: "support@meridian.com",
  logoUrl: null,
  timezone: "Africa/Lagos",
  language: "en",
  currency: "USD",
  storeStatus: "LIVE",
  maintenanceMode: false,
  defaultCountry: "NG",
  dateFormat: "MMM d, yyyy",
  theme: "light",
  primaryColor: "#1b2e24",
};

export const getStoreSettings = cache(async (): Promise<StoreSettingsData> => {
  try {
    const row = await prisma.storeSettings.findUnique({
      where: { id: "singleton" },
    });
    if (!row) return DEFAULTS;
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      email: row.email,
      logoUrl: row.logoUrl,
      timezone: row.timezone,
      language: row.language,
      currency: row.currency,
      storeStatus: row.storeStatus as "LIVE" | "CLOSED",
      maintenanceMode: row.maintenanceMode,
      defaultCountry: row.defaultCountry,
      dateFormat: row.dateFormat,
      theme: row.theme as "light" | "dark" | "forest" | "minimal",
      primaryColor: row.primaryColor,
    };
  } catch {
    return DEFAULTS;
  }
});

export async function updateStoreSettings(
  data: Partial<StoreSettingsData>
): Promise<StoreSettingsData> {
  const updated = await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...DEFAULTS, ...data },
    update: data,
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");

  return updated as StoreSettingsData;
}