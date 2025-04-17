"use client";

import { createContext } from "react";
import { Toaster, toast as sonnerToast } from "sonner";
import { Toast } from "./use-toast";

export const ToastContext = createContext<((toast: Toast) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const showToast = (toast: Toast) => {
        const { title, description, variant = "default" } = toast;
        if (variant === "destructive") {
            sonnerToast.error(title, { description });
        } else {
            sonnerToast(title, { description });
        }
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                        border: "1px solid hsl(var(--border))",
                    },
                }}
            />
        </ToastContext.Provider>
    );
} 