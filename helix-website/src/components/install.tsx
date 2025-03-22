"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Install() {
    const [activeOS, setActiveOS] = useState("linux");
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const installCommands = {
        linux: "curl -Lo helix.zip https://github.com/HelixDB/helix-db/releases/latest/download/helix-linux-x64.zip && \nunzip helix.zip && ./helix version",
        macos: "curl -Lo helix.zip https://github.com/HelixDB/helix-db/releases/latest/download/helix-mac-x64.zip && \nunzip helix.zip && ./helix version",
        windows: "curl.exe -Lo helix.zip https://github.com/HelixDB/helix-db/releases/latest/download/helix-win-x64.zip\nExpand-Archive -Path helix.zip -DestinationPath .\nhelix.exe version"
    };

    return (
        <div className="min-h-screen flex items-center relative">
            {/* Absolute positioned background behind everything */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute inset-0 bg-background dark:bg-black"></div>
                <div className="absolute inset-0 bg-grid-small-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col max-w-2xl relative">
                        {/* Radial gradient underlay for better contrast */}
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
                                <Link href="/docs/getting-started">
                                    Get Started
                                </Link>
                            </Button>

                            <div className="flex flex-col">
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
                    </div>

                    <div className="relative">
                        {/* Subtle glow behind the code block */}
                        <div className="absolute -inset-10 bg-gradient-radial from-primary/5 via-transparent to-transparent -z-10 blur-xl opacity-70"></div>

                        <Tabs defaultValue="linux" value={activeOS} onValueChange={setActiveOS} className="w-full">
                            <TabsList className="border-b border-border/30 w-full justify-start bg-transparent p-0 h-auto mb-2">
                                <TabsTrigger
                                    value="linux"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent h-12 px-8 rounded-none hover:text-primary transition-colors"
                                >
                                    Linux
                                </TabsTrigger>
                                <TabsTrigger
                                    value="macos"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent h-12 px-8 rounded-none text-muted-foreground hover:text-primary transition-colors"
                                >
                                    macOS
                                </TabsTrigger>
                                <TabsTrigger
                                    value="windows"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent h-12 px-8 rounded-none text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Windows
                                </TabsTrigger>
                            </TabsList>

                            {["linux", "macos", "windows"].map((os) => (
                                <TabsContent key={os} value={os} className="w-full mt-0">
                                    <div className="relative rounded-lg bg-black/70 border border-white/10 overflow-hidden shadow-xl backdrop-blur-sm">
                                        <pre className="p-6 overflow-x-auto text-foreground/90">
                                            <code className="text-base font-mono leading-relaxed">
                                                {installCommands[os as keyof typeof installCommands]}
                                            </code>
                                        </pre>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-3 right-3 text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
                                            onClick={() => copyToClipboard(installCommands[os as keyof typeof installCommands])}
                                        >
                                            <Copy className={`h-5 w-5 ${copied ? 'text-green-500' : ''}`} />
                                            <span className="sr-only">Copy to clipboard</span>
                                        </Button>
                                    </div>

                                    <div className="flex justify-between w-full mt-4 text-sm text-muted-foreground">
                                        <div>
                                            Release: <a href="https://github.com/HelixDB/helix-db/releases" className="text-primary hover:underline transition-colors">v0.16.32</a> | Mar 17, 2025
                                        </div>
                                        <div>Apache 2.0 Open Source</div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
} 