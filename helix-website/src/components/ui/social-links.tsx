import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, MessageCircle, X, LucideX } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socialLinks = [
    {
        name: "GitHub",
        icon: Github,
        href: "https://github.com/HelixDB/helix-db",
        color: "hover:text-[#333]"
    },
    {
        name: "X (Twitter)",
        icon: FaXTwitter,
        href: "https://twitter.com/HelixDB",
        color: "hover:text-[#1DA1F2]"
    },
    {
        name: "LinkedIn",
        icon: Linkedin,
        href: "https://linkedin.com/company/helixdb",
        color: "hover:text-[#0077b5]"
    },
    {
        name: "Discord",
        icon: FaDiscord,
        href: "https://discord.gg/GaudqunK",
        color: "hover:text-[#7289DA]"
    }
];

interface SocialLinksProps {
    className?: string;
    iconSize?: number;
}

export function SocialLinks({ className, iconSize = 20 }: SocialLinksProps) {
    return (
        <div className={cn("flex justify-center gap-4", className)}>
            {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                    <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "transition-colors duration-200",
                            "text-muted-foreground",
                            social.color,
                        )}
                        whileTap={{ scale: 0.95 }}
                        title={social.name}
                    >
                        <Icon size={iconSize} />
                    </motion.a>
                );
            })}
        </div>
    );
} 