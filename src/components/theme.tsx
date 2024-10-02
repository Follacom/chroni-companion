"use client"

import { useTheme } from "@/hooks/useTheme"
import { ThemeVariants } from "@/lib/theme"
import { cn } from "@/lib/utils"
import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-react"

const themeIconClass = "opacity-0 transition-opacity duration-150 ease-in row-start-1 col-start-1"

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <>
            <button
                type="button"
                onClick={() => toggleTheme("next")}
                className={cn("inline-grid")}
            >
                <SunIcon className={cn(themeIconClass, theme === ThemeVariants.light ? "opacity-100" : "")} />
                <MoonIcon className={cn(themeIconClass, theme === ThemeVariants.dark ? "opacity-100" : "")} />
                <LaptopMinimalIcon className={cn(themeIconClass, theme === ThemeVariants.system ? "opacity-100" : "")} />
            </button>
        </>
    )
}