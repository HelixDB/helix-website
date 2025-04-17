"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="relative h-10 w-10" />;
    }

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <div className={cn("relative h-10 w-10", className)}>
            <Image
                src={currentTheme === "dark" ? "/dark-helix.png" : "/light-helix.png"}
                alt="HelixDB Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
} 