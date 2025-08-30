"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SocialCardProps {
    href: string;
    title: string;
    icon: React.ComponentType<{ className?: string }> | LucideIcon;
    variant: 'github' | 'twitter' | 'linkedin' | 'discord';
}

const variantStyles = {
    github: {
        hoverBorder: 'hover:border-[#333]/50 dark:hover:border-white/50',
        hoverShadow: 'hover:shadow-[#333]/10 dark:hover:shadow-white/10',
        iconColor: 'text-[#333]/50 dark:text-gray-400 group-hover:text-[#333] dark:group-hover:text-white',
        gradient: 'from-[#333]/5'
    },
    twitter: {
        hoverBorder: 'hover:border-[#1DA1F2]/50',
        hoverShadow: 'hover:shadow-[#1DA1F2]/10',
        iconColor: 'text-[#1DA1F2]/50 group-hover:text-[#1DA1F2]',
        gradient: 'from-[#1DA1F2]/5'
    },
    linkedin: {
        hoverBorder: 'hover:border-[#0077b5]/50',
        hoverShadow: 'hover:shadow-[#0077b5]/10',
        iconColor: 'text-[#0077b5]/50 group-hover:text-[#0077b5]',
        gradient: 'from-[#0077b5]/5'
    },
    discord: {
        hoverBorder: 'hover:border-[#7289DA]/50',
        hoverShadow: 'hover:shadow-[#7289DA]/10',
        iconColor: 'text-[#7289DA]/50 group-hover:text-[#7289DA]',
        gradient: 'from-[#7289DA]/5'
    }
};

export function SocialCard({
    href,
    title,
    icon: Icon,
    variant
}: SocialCardProps) {
    const styles = variantStyles[variant];

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative bg-background/80 backdrop-blur-sm border rounded-xl p-5 h-32 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl ${styles.hoverBorder} `}
            whileTap={{ scale: 0.95 }}
        >
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 blur-lg scale-105 -z-10`}></div>

            <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300 relative z-10">
                {title}
            </span>
            <Icon className={`absolute -bottom-4 -right-4 w-20 h-20 transition-all duration-300 group-hover:scale-110 transform ${styles.iconColor}`} />
        </motion.a>
    );
} 