import { cn } from "@/lib/utils";
import React from "react";

interface AuroraTextProps {
    children: React.ReactNode;
    className?: string;
}

export function AuroraText({ children, className }: AuroraTextProps) {
    return (
        <span
            className={cn(
                "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-aurora-text",
                className
            )}
        >
            {children}
        </span>
    );
} 