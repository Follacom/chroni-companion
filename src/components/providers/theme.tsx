"use client";

import { THEME_STORAGE_KEY, ThemeVariant, ThemeVariants } from "@/lib/theme";
import { setCookie } from "cookies-next";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react";

export const ThemeContext = createContext<[ThemeVariant, Dispatch<SetStateAction<ThemeVariant>>]>([ThemeVariants.system, () => { }])

export type ThemeProviderProps = PropsWithChildren<{
    defaultTheme?: ThemeVariant
}>

export default function ThemeProvider({ defaultTheme = ThemeVariants.system, children }: ThemeProviderProps) {
    const [theme, setTheme] = useState(defaultTheme);
    useEffect(() => setTheme(defaultTheme), [defaultTheme])

    const updateTheme = (theme: ThemeVariant, toggle: boolean = true) => {
        const el = document.documentElement;
        el.classList.toggle(theme, toggle);
        setCookie(THEME_STORAGE_KEY, theme, { maxAge: 60 * 60 * 24 * 365, sameSite: "strict" })
    }

    useEffect(() => {
        updateTheme(theme as ThemeVariant, true);

        return () => {
            updateTheme(theme as ThemeVariant, false);
        }
    }, [theme])

    return (
        <>
            <ThemeContext.Provider value={[theme, setTheme]}>
                {children}
            </ThemeContext.Provider>
        </>
    )
}