import { ThemeContext } from "@/components/providers/theme";
import { ThemeVariant, ThemeVariants } from "@/lib/theme";
import { useCallback, useContext } from "react";

export function useTheme() {
  const [theme, setTheme] = useContext(ThemeContext);

  const toggleTheme = useCallback(
    (variant: ThemeVariant | "next") => {
      const currentTheme = theme;
      if (variant === "next") {
        const variantIndex = Object.keys(ThemeVariants).findIndex(
          (variant) => variant == currentTheme
        );
        if (variantIndex >= 0) {
          const nextVariantIndex = Math.min(
            variantIndex + 1,
            Object.keys(ThemeVariants).length - 1
          );
          if (nextVariantIndex === variantIndex) {
            setTheme(
              Object.values(ThemeVariants).at(0) || ThemeVariants.system
            );
            return;
          }
          setTheme(
            Object.values(ThemeVariants).at(nextVariantIndex) ||
              ThemeVariants.system
          );
          return;
        }
      } else {
        setTheme(ThemeVariants[variant]);
      }
    },
    [setTheme, theme]
  );

  return { theme, toggleTheme };
}
