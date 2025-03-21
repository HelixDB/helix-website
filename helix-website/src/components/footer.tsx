"use client";

import React, { useState } from "react";
import { File, Github, Linkedin, Twitter, Bug } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";
import { BugReportPopup } from "./bug-report-popup";
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
            href: "https://helix.mintlify.app",
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
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-row justify-between">
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
                    <div className="flex flex-col gap-2">
                        {/* <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsBugReportOpen(true)}
                            className="hover:text-destructive"
                        >
                            <Bug className="h-4 w-4" />
                        </Button> */}
                        <ThemeToggle />
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t flex flex-row justify-between">
                    <p className="text-center text-muted-foreground">
                        &copy; {new Date().getFullYear()} HelixDB. All rights reserved.
                    </p>
                    <p className="text-center text-muted-foreground">
                        Backed by Y Combinator
                    </p>
                </div>
            </div>

            <BugReportPopup
                isOpen={isBugReportOpen}
                onClose={() => setIsBugReportOpen(false)}
            />
        </footer>
    );
} 