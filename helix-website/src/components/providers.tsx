"use client"

import { ThemeProvider } from "@/components/theme-provider"
import "@/aws-config"

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    )
} 