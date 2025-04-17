import { useContext } from "react";
import { ToastContext } from "./toast-provider";

export interface Toast {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
} 