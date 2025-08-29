"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from "react-icons/fa";
import { Logo } from "./ui/logo";

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
            href: "https://docs.helix-db.com/documentation/sdk/python",
        },
        {
            name: "HQL",
            href: "https://docs.helix-db.com/documentation/hql/hql",
        },
    ],
    contact: [
        {
            name: "Twitter",
            href: "https://twitter.com/helixdb",
            icon: FaTwitter,
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/company/helixdb",
            icon: FaLinkedin,
        },
        {
            name: "GitHub",
            href: "https://github.com/HelixDB",
            icon: FaGithub,
        },
        {
            name: "Discord",
            href: "https://discord.gg/helixdb",
            icon: FaDiscord,
        },
    ],
};

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-6 sm:px-8 md:px-4 py-12 md:py-16">
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
                <div className="mt-12 pt-8 border-t">
                    <div className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} HelixDB, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 