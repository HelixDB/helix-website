"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Logo() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="relative h-12 w-12" />;
    }

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <div className="relative h-12 w-12">
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