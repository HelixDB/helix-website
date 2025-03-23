"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CodeEditor } from "./ui/code-editor";

export function Install() {
    const [activeOS, setActiveOS] = useState("linux");
    const [copied, setCopied] = useState(false);
    const [height, setHeight] = useState("auto");
    const preRef = useRef<HTMLPreElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!preRef.current) return;

        const updateHeight = () => {
            if (preRef.current) {
                setHeight(`${preRef.current.scrollHeight}px`);
            }
        };

        // Create a ResizeObserver to watch for content size changes
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(preRef.current);

        // Initial height measurement
        updateHeight();

        return () => {
            if (preRef.current) {
                resizeObserver.unobserve(preRef.current);
            }
        };
    }, [activeOS]); // Re-run when OS changes to ensure proper observation

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const installCommands = {
        linux: `curl -Lo helix.zip https://github.com/HelixDB/helix-db/releases/latest/download/helix-linux-x64.zip && unzip helix.zip &&
./helix version`,
        macos: `curl -Lo helix.zip https://github.com/HelixDB/helix-db/releases/latest/download/helix-mac-x64.zip &&
unzip helix.zip &&
./helix version`,
        windows: `curl.exe -Lo helix.zip https://github.com/HelixDB/helix-db/releases/latest/download/helix-win-x64.zip
Expand-Archive -Path helix.zip -DestinationPath .
helix.exe version`
    };

    const fileNames = {
        linux: "Linux",
        macos: "Mac OS",
        windows: "Windows"
    };

    return (
        <div className="min-h-screen flex items-center relative py-24">
            {/* Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute inset-0 bg-background dark:bg-black"></div>
                <div className="absolute inset-0 bg-grid-small-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center max-w-8xl mx-auto">
                    {/* Left column - text content */}
                    <div className="flex flex-col max-w-2xl relative ">
                        <div className="absolute -inset-10 bg-gradient-radial from-background/95 dark:from-black/95 via-background/70 dark:via-black/70 to-transparent rounded-3xl -z-10 blur-sm"></div>

                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6">
                            Installation
                        </h2>

                        <p className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8">
                            HelixDB is production-ready on Linux and seamlessly integrated with major programming languages.
                        </p>


                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="px-8 py-6 text-lg border-white/10 hover:bg-white/5 mb-4 sm:mb-0"
                                asChild
                            >
                                <Link href="">Get Started</Link>
                            </Button>

                            <Button
                                size="lg"
                                className="px-8 py-6 text-lg flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                                asChild
                            >
                                <a
                                    href="https://github.com/HelixDB/helix-db"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    <span>GitHub Repo</span>
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Right column - code display */}
                    <div className="relative">
                        <div className="rounded-lg overflow-hidden shadow-lg flex flex-col">
                            <div className="bg-muted/50 flex-none flex items-center ">
                                {Object.entries(fileNames).map(([os, fileName]) => (
                                    <button
                                        key={os}
                                        onClick={() => setActiveOS(os)}
                                        className={`px-3 py-2 text-sm font-medium border-r border-border/20 relative 
                                            ${activeOS === os
                                                ? "text-foreground bg-background mb-[2px]"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {fileName}
                                    </button>
                                ))}

                                {/* Copy button */}
                                <div className="ml-auto">
                                    <button
                                        className="text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors flex flex-row items-center justify-center rounded-md mr-2"
                                        onClick={() => copyToClipboard(installCommands[activeOS as keyof typeof installCommands])}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2 ml-2 py-0.5 text-green-500" />
                                                <span className="mr-2">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-2 ml-2 py-0.5" />
                                                <span className="mr-2">Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div
                                className="grid transition-[height] duration-300 ease-in-out overflow-hidden"
                                style={{
                                    background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                                }}
                            >
                                <div className="[grid-area:1/1]">
                                    <pre
                                        ref={preRef}
                                        className="w-full px-4 py-3 m-0 font-mono text-sm leading-relaxed overflow-x-auto text-foreground/90 whitespace-pre-wrap break-words"
                                    >
                                        {installCommands[activeOS as keyof typeof installCommands]}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Footer info */}
                        <div className="flex flex-col sm:flex-row sm:justify-between w-full mt-4 text-sm text-muted-foreground">
                            {/* <div className="mb-2 sm:mb-0">
                                Release: <a href="https://github.com/HelixDB/helix-db/releases" className="text-primary hover:underline transition-colors">v0.16.32</a> | Mar 17, 2025
                            </div>
                            <div>Apache 2.0 Open Source</div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 