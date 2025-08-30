"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="relative h-6" />;
    }

    return (
        <div className={cn("relative h-8 w-6 mr-1 my-1", className)}>
            <Image
                src="/helix-white.svg"
                alt="HelixDB Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
} 