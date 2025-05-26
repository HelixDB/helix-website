"use client";

import React, { useState } from "react";
import { File, Github, Linkedin, Twitter, Bug } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const navigation = {
    social: [
        {
            name: "GitHub",
            href: "https://github.com/HelixDB/helix-db",
            icon: Github,
        },
        {
            name: "Docs",
            href: "https://docs.helix-db.com",
            icon: File,
        },
    ],
    social1: [
        {
            name: "Twitter",
            href: "https://x.com/xav_db",
            icon: Twitter,
        },
    ],
    social2: [
        {
            name: "Twitter",
            href: "https://x.com/georgecurtiss",
            icon: Twitter,
        },
    ],
};

export function Footer() {
    const [isBugReportOpen, setIsBugReportOpen] = useState(false);

    return (
        <footer className="bg-muted/50 relative">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Pages</h3>
                        <ul className="space-y-3">
                            {navigation.social.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground flex items-center"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <item.icon className="h-5 w-5 mr-2" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Xav's Contact</h3>
                        <ul className="space-y-3">
                            {navigation.social1.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground flex items-center"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <item.icon className="h-5 w-5 mr-2" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-4">George's Contact</h3>
                        <ul className="space-y-3">
                            {navigation.social2.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground flex items-center"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <item.icon className="h-5 w-5 mr-2" />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-row sm:flex-col justify-center sm:justify-start gap-2">
                        {/* <ThemeToggle /> */}
                    </div>
                </div>
                <div className="mt-8 md:mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                    <p className="text-center text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} HelixDB. All rights reserved.
                    </p>
                    {/* <p className="text-center text-muted-foreground text-sm">
                        Backed by Y Combinator
                    </p> */}
                </div>
            </div>

        </footer>
    );
} 