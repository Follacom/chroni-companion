export const THEME_STORAGE_KEY = "chroni-companion_theme";
export const ThemeVariants = {
  light: "light",
  dark: "dark",
  system: "system",
} as const;

export type ThemeVariant = keyof typeof ThemeVariants;
