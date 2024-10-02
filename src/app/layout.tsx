import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { THEME_STORAGE_KEY, ThemeVariant, ThemeVariants } from "@/lib/theme";

export const metadata: Metadata = {
    title: "Chroni-Companion",
    description: "All the tools to help you on your adventure",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const defaultTheme = getCookie(THEME_STORAGE_KEY, { cookies }) as ThemeVariant || ThemeVariants.system

    return (
        <html lang="en" className={cn(defaultTheme)}>
            <body>
                <Providers defaultTheme={defaultTheme}>
                    <Navbar />
                    <main className={cn('max-w-5xl flex flex-col flex-grow items-center mx-auto py-4 px-2 overflow-hidden')}>
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
