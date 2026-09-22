export type ThemeName = "light" | "dark" | "forest" | "minimal";

export interface ThemeColors {
  "--background": string;
  "--surface": string;
  "--surface-elevated": string;
  "--foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--border": string;
  "--input": string;
  "--primary-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  light: {
    "--background": "#fbfaf7",
    "--surface": "#f5f3ef",
    "--surface-elevated": "#ffffff",
    "--foreground": "#0a0a0a",
    "--muted": "#f5f3ef",
    "--muted-foreground": "#6b6b6b",
    "--border": "#e7e5e4",
    "--input": "#e7e5e4",
    "--primary-foreground": "#fbfaf7",
    "--accent": "#c9a227",
    "--accent-foreground": "#0a0a0a",
  },
  dark: {
    "--background": "#0a0a0a",
    "--surface": "#141414",
    "--surface-elevated": "#1c1c1e",
    "--foreground": "#f5f5f4",
    "--muted": "#1c1c1e",
    "--muted-foreground": "#a1a1aa",
    "--border": "#27272a",
    "--input": "#27272a",
    "--primary-foreground": "#0a0a0a",
    "--accent": "#c9a227",
    "--accent-foreground": "#0a0a0a",
  },
  forest: {
    "--background": "#0f1a13",
    "--surface": "#142219",
    "--surface-elevated": "#1a2d20",
    "--foreground": "#e8ede9",
    "--muted": "#1a2d20",
    "--muted-foreground": "#8fa192",
    "--border": "#22392a",
    "--input": "#22392a",
    "--primary-foreground": "#0f1a13",
    "--accent": "#c9a227",
    "--accent-foreground": "#0a0a0a",
  },
  minimal: {
    "--background": "#ffffff",
    "--surface": "#fafafa",
    "--surface-elevated": "#ffffff",
    "--foreground": "#171717",
    "--muted": "#f5f5f5",
    "--muted-foreground": "#737373",
    "--border": "#e5e5e5",
    "--input": "#e5e5e5",
    "--primary-foreground": "#ffffff",
    "--accent": "#c9a227",
    "--accent-foreground": "#0a0a0a",
  },
};

export const PRIMARY_COLOR_SWATCHES = [
  { label: "Forest", value: "#1b2e24" },
  { label: "Rose", value: "#dc2626" },
  { label: "Sand", value: "#a8895a" },
  { label: "Ocean", value: "#2563eb" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Ink", value: "#0a0a0a" },
] as const;

export function buildThemeStyle(settings: {
  theme: ThemeName;
  primaryColor: string;
}): string {
  const base = THEMES[settings.theme] ?? THEMES.light;
  const vars: Record<string, string> = {
    ...base,
    "--primary": settings.primaryColor,
    "--ring": settings.primaryColor,
  };

  return `:root { ${Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")} }`;
}