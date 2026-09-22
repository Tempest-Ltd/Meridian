import { SettingsShell } from "@/components/admin/settings/settings-shell";
import { getStoreSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();
  return <SettingsShell initial={settings} />;
}