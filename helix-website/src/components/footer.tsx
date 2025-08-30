"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from "react-icons/fa";
import { Logo } from "./ui/logo";
import { motion } from "framer-motion";

const navigation = {
    main: [
        {
            name: "Home",
            href: "/",
        },
        {
            name: "Blog",
            href: "/blog",
        },
        {
            name: "Docs",
            href: "https://docs.helix-db.com",
        },
    ],
    docs: [
        {
            name: "Introduction",
            href: "https://docs.helix-db.com",
        },
        {
            name: "Python SDK",
            href: "https://docs.helix-db.com/documentation/sdks/helix-py",
        },
        {
            name: "HQL",
            href: "https://docs.helix-db.com/documentation/hql/hql",
        },
    ],
    contact: [
        {
            name: "Twitter",
            href: "https://twitter.com/hlx_db",
            icon: FaTwitter,
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/company/helixdb",
            icon: FaLinkedin,
        },
        {
            name: "GitHub",
            href: "https://github.com/HelixDB/helix-db",
            icon: FaGithub,
        },
        {
            name: "Discord",
            href: "https://discord.gg/2stgMPr5BD",
            icon: FaDiscord,
        },
    ],
};

export function Footer() {
    return (
        <footer className="pt-24 pb-0 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
                <motion.div
                    className="relative w-full p-8 pb-12 border-t border-l border-r border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-t-2xl overflow-hidden group"
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="mb-8 md:hidden flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Logo />
                            <h2 className="text-lg font-bold">HelixDB</h2>
                        </div>
                        {/* Social icons on mobile - aligned to the right */}
                        <div className="flex space-x-3">
                            {navigation.contact.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.name}
                                >
                                    <item.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-2 mb-4">
                                <Logo />
                                <h2 className="text-lg font-bold">HelixDB</h2>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-4 tracking-wider">Main</h3>
                            <ul className="space-y-3">
                                {navigation.main.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            target={item.href.startsWith("http") ? "_blank" : undefined}
                                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-4 tracking-wider">Docs</h3>
                            <ul className="space-y-3">
                                {navigation.docs.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            target={item.href.startsWith("http") ? "_blank" : undefined}
                                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="hidden md:block">
                            <h3 className="text-sm font-semibold mb-4 tracking-wider">Contact</h3>
                            {/* Vertical list with text on desktop */}
                            <ul className="space-y-3">
                                {navigation.contact.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                Built in San Francisco
                            </p>
                            <p className="text-sm text-muted-foreground">
                                &copy; {new Date().getFullYear()} Helix DB, Inc.<span className="hidden sm:inline"> All rights reserved.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
} 