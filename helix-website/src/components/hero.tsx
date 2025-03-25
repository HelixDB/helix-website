"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { HeroPill } from "@/components/ui/hero-pill";
import { Graph } from "./graph";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            duration: 0.5
        }
    }
};

const pillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3
        }
    }
};

const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.6
        }
    }
};

const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.9
        }
    }
};

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: custom
        }
    })
};

export function Hero() {
    return (
        <motion.div
            className="min-h-[100vh] flex items-center relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Absolute positioned graph behind everything */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                <Graph />
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="flex flex-col max-w-2xl relative"
                        variants={containerVariants}
                    >
                        {/* Radial gradient underlay for better contrast with the graph */}
                        <div className="absolute -inset-10 bg-gradient-radial from-background/95 via-background/70 to-transparent rounded-3xl -z-10 blur-sm"></div>
                        <motion.div
                            className="flex flex-row space-x-4"
                            variants={pillVariants}
                        >
                            {/* Y Combinator Badge */}
                            <motion.div
                                className="flex items-center gap-2 mb-6 bg-[#FF5733]/10 dark:bg-[#FF5733]/5 w-fit px-3 py-1.5 rounded-full border border-[#FF5733]/20"

                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <img
                                    src="/yc-logo.png"
                                    alt="Y Combinator Logo"
                                    className="w-5 h-5"
                                />
                                <span className="text-sm font-medium text-[#FF5733] dark:text-[#FF5733]/90">
                                    Backed by Y Combinator
                                </span>
                            </motion.div>
                            <HeroPill
                                className="w-min mb-6"
                                href="https://github.com/HelixDB/helix-db"
                                label="Vector types available!"
                                announcement="🎉 New"
                                isExternal
                            />
                        </motion.div>

                        <motion.h1
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6"
                            variants={headingVariants}
                        >
                            Build 10x Faster with the first fully native Graph-Vector Database
                        </motion.h1>

                        <motion.p
                            className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8"
                            variants={paragraphVariants}
                        >
                            Accelerate development with a unified graph and vector database, built in Rust, designed for RAG and AI applications.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.div
                                variants={buttonVariants}
                                custom={1.2}
                            >
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="px-8 py-6 text-lg border-white/10 hover:bg-white/5 mb-4 sm:mb-0 w-full"
                                    onClick={() => window.open('https://cal.com/helix-db', '_blank')}
                                >
                                    Book Demo
                                </Button>
                            </motion.div>

                            <motion.div
                                className="flex flex-col"
                                variants={buttonVariants}
                                custom={1.5}
                            >
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
                                        <Star className="w-5 h-5" />
                                        <span>Star on GitHub</span>
                                    </a>
                                </Button>
                                <span className="text-muted-foreground mt-1 text-center italic mt-2">only takes 3 seconds 🙏🏻</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Empty column that the graph will appear behind */}
                    <div className="hidden lg:block"></div>
                </div>
            </div>
        </motion.div>
    )
} 