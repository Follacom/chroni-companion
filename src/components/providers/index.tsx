import { PropsWithChildren } from "react"
import ThemeProvider, { ThemeProviderProps } from "./theme"

type ProvidersProps = PropsWithChildren<ThemeProviderProps>

export default function Providers({ children, defaultTheme }: ProvidersProps) {
    return (
        <>
            <ThemeProvider defaultTheme={defaultTheme}>
                {children}
            </ThemeProvider>
        </>
    )
}