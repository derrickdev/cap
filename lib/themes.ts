export type ThemeName = "light" | "dark";

export type ThemeTokens = Record<string, string>;

export const THEMES: Record<ThemeName, ThemeTokens> = {
  light: {
    bg: "#F4F4F5",
    card: "#FFFFFF",
    line: "#E4E4E7",
    ink: "#18181B",
    mut: "#71717A",
    sub: "#52525B",
    fai: "#A1A1AA",
    acc: "#16A34A",
    accT: "#FFFFFF",
    accS: "#ECFDF5",
    accI: "#166534",
    inc: "#16A34A",
    exp: "#E11D48",
    incS: "#ECFDF5",
    expS: "#FFF1F2",
    chip: "#F4F4F5",
    hero: "#18181B",
    heroT: "#FFFFFF",
    heroPill: "rgba(74,222,128,.16)",
    track: "#E4E4E7",
    nav: "#FFFFFF",
    navL: "#F1F1F3",
    sheet: "#FFFFFF",
    streakBg: "#FFF7ED",
    streakC: "#C2410C",
    fabShadow: "rgba(22,163,74,.5)",
  },
  dark: {
    bg: "#09090B",
    card: "#18181B",
    line: "#27272A",
    ink: "#FAFAFA",
    mut: "#A1A1AA",
    sub: "#D4D4D8",
    fai: "#71717A",
    acc: "#34D399",
    accT: "#052e16",
    accS: "rgba(52,211,153,.12)",
    accI: "#6EE7B7",
    inc: "#34D399",
    exp: "#FB7185",
    incS: "rgba(52,211,153,.14)",
    expS: "rgba(251,113,133,.14)",
    chip: "#18181B",
    hero: "#18181B",
    heroT: "#FFFFFF",
    heroPill: "rgba(52,211,153,.16)",
    track: "#27272A",
    nav: "#000000",
    navL: "#18181B",
    sheet: "#18181B",
    streakBg: "rgba(251,146,60,.15)",
    streakC: "#FB923C",
    fabShadow: "rgba(52,211,153,.5)",
  },
};

/** Transforme les tokens en propriétés CSS custom (--ink, --card, ...) à poser sur un conteneur. */
export function themeVars(name: ThemeName): React.CSSProperties {
  const t = THEMES[name];
  const out: Record<string, string> = {};
  for (const k in t) out[`--${k}`] = t[k];
  return out as React.CSSProperties;
}

export const CATCOLORS = [
  "#16A34A",
  "#E11D48",
  "#2563EB",
  "#F59E0B",
  "#8B5CF6",
  "#0EA5E9",
  "#A1A1AA",
];
