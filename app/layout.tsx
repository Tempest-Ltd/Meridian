import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { inter, interTight, jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { getStoreSettings } from "@/lib/settings";
import { THEMES } from "@/lib/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Meridian — Better Products. Brighter Days.",
    template: "%s | Meridian",
  },
  description:
    "Premium everyday essentials designed for comfort, convenience, and confidence.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();
  const base = THEMES[settings.theme] ?? THEMES.light;

  // Inline CSS vars on <html>. Highest specificity — cannot be overridden.
  const cssVars: Record<string, string> = {
    ...base,
    "--primary": settings.primaryColor,
    "--ring": settings.primaryColor,
  };

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: settings.primaryColor,
          colorText: settings.theme === "light" || settings.theme === "minimal" ? "#0a0a0a" : "#f5f5f4",
          colorBackground: settings.theme === "light" || settings.theme === "minimal" ? "#ffffff" : "#1c1c1e",
          colorInputBackground: settings.theme === "light" || settings.theme === "minimal" ? "#ffffff" : "#1c1c1e",
          colorInputText: settings.theme === "light" || settings.theme === "minimal" ? "#0a0a0a" : "#f5f5f4",
          fontFamily: "var(--font-inter)",
          borderRadius: "12px",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        data-theme={settings.theme}
        style={cssVars as React.CSSProperties}
      >
        <body
          className={cn(
            inter.variable,
            interTight.variable,
            jetbrainsMono.variable,
            "min-h-screen bg-background font-sans text-foreground antialiased"
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}