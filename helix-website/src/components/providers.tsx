"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast-provider"
import "@/aws-config"
import { Provider } from 'react-redux'
import { store } from '@/store/store'

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ThemeProvider>
        </Provider>
    )
} 