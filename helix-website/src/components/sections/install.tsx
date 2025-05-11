"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CodeEditor } from "../ui/code-editor";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            duration: 0.5
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const codeBlockVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.4
        }
    }
};

export function Install() {
    const [activeOS, setActiveOS] = useState("unix");
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
        unix: `$ curl -sSL "https://install.helix-db.com" | bash\n\n$ helix install`,
        windows: `Coming soon...`
    };

    const fileNames = {
        unix: "Unix",
        windows: "Windows"
    };

    return (
        <div className="min-h-[90vh]  flex items-center relative py-24">
            {/* Background */}

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center max-w-8xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Left column - text content */}
                    <div className="flex flex-col max-w-2xl relative">
                        <div className="absolute -inset-10 bg-gradient-radial from-background/95 dark:from-black/95 via-background/70 dark:via-black/70 to-transparent rounded-3xl -z-10 blur-sm"></div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6"
                        >
                            Installation
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8"
                        >
                            HelixDB is production-ready on Unix and completely open-source. Start writing your queries and deploying code in minutes.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button
                                size="lg"
                                variant="secondary"
                                className="px-8 py-6 text-lg border-white/10 hover:bg-white/5 mb-4 sm:mb-0"
                                asChild
                            >
                                <Link href="https://docs.helix-db.com/introduction">Docs</Link>
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
                                    <span>GitHub Guide</span>
                                </a>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right column - code display */}
                    <motion.div
                        className="relative"
                        variants={codeBlockVariants}
                    >
                        <div className="rounded-lg overflow-hidden shadow-lg flex flex-col">
                            <motion.div
                                className="bg-muted/50 flex-none flex items-center"
                                variants={itemVariants}
                            >
                                {Object.entries(fileNames).map(([os, fileName]) => (
                                    <motion.button
                                        key={os}
                                        onClick={() => setActiveOS(os)}
                                        className={`px-3 py-2 text-sm font-medium border-r border-border/20 relative 
                                            ${activeOS === os
                                                ? "text-foreground bg-background mb-[2px]"
                                                : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {fileName}
                                    </motion.button>
                                ))}

                                {/* Copy button */}
                                <motion.div
                                    className="ml-auto"
                                    variants={itemVariants}
                                >
                                    <motion.button
                                        className="text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors flex flex-row items-center justify-center rounded-md mr-2"
                                        onClick={() => copyToClipboard(installCommands[activeOS as keyof typeof installCommands])}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {copied ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center"
                                            >
                                                <Check className="h-4 w-4 mr-2 ml-2 py-0.5 text-green-500" />
                                                <span className="mr-2">Copied!</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center"
                                            >
                                                <Copy className="h-4 w-4 mr-2 ml-2 py-0.5" />
                                                <span className="mr-2">Copy</span>
                                            </motion.div>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="grid transition-[height] duration-300 ease-in-out overflow-hidden"
                                style={{
                                    background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                                }}
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="[grid-area:1/1]"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <pre
                                        ref={preRef}
                                        className="w-full px-4 pt-3 pb-16 m-0 font-mono text-sm leading-relaxed overflow-x-auto text-foreground/90 whitespace-pre-wrap break-words"
                                    >
                                        {installCommands[activeOS as keyof typeof installCommands]}
                                    </pre>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Footer info */}
                        <motion.div
                            className="flex flex-col sm:flex-row sm:justify-between w-full mt-4 text-sm text-muted-foreground"
                            variants={itemVariants}
                        >
                            {/* <div className="mb-2 sm:mb-0">
                                Release: <a href="https://github.com/HelixDB/helix-db/releases" className="text-primary hover:underline transition-colors">v0.16.32</a> | Mar 17, 2025
                            </div>
                            <div>Apache 2.0 Open Source</div> */}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
} 