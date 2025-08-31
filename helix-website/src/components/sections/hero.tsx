"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Github } from "lucide-react";
import { HeroPill } from "@/components/ui/hero-pill";
import { Graph } from "./graph";
import { motion } from "framer-motion";
import { getGithubStars, formatNumber } from "@/lib/github";

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
    const [stars, setStars] = React.useState<number | null>(null);

    React.useEffect(() => {
        getGithubStars().then(setStars);
    }, []);

    return (
        <motion.div
            className="min-h-screen py-12 sm:py-16 flex items-center relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Absolute positioned graph behind everything */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <Graph />
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
                    <motion.div
                        className="flex flex-col relative w-full col-span-1 sm:col-span-2"
                        variants={containerVariants}
                    >
                        {/* Radial gradient underlay for better contrast with the graph */}
                        <motion.div className="absolute top-0 left-0 right-0 bottom-0 rounded-full -z-10 blur-2xl bg-background/70 opacity-60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
                        />
                        <motion.div
                            className="flex flex-col sm:flex-row sm:space-x-4"
                            variants={pillVariants}
                        >
                            {/* Y Combinator Badge */}
                            <motion.div
                                className="flex items-center gap-2 mb-4 sm:mb-6 bg-[#FF5733]/10 dark:bg-[#FF5733]/5 w-fit px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#FF5733]/20 cursor-pointer"

                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                onClick={() => window.open('https://www.ycombinator.com/companies/helixdb', '_blank')}
                            >
                                <img
                                    src="/yc-logo.png"
                                    alt="Y Combinator Logo"
                                    className="w-4 sm:w-5 h-4 sm:h-5"
                                />
                                <span className="text-xs sm:text-sm font-medium text-[#FF5733] dark:text-[#FF5733]/90">
                                    Backed by Y Combinator
                                </span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 mb-4 sm:mb-6 bg-[#76b900]/10 dark:bg-[#76b900]/5 w-fit px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#76b900]/20"

                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <img
                                    src="/nvidia.png"
                                    alt="Nvidia Logo"
                                    className="h-4 sm:h-5"
                                />
                                <span className="text-xs sm:text-sm font-medium text-[#76b900] dark:text-[#76b900]/90">
                                    Backed by NVIDIA
                                </span>
                            </motion.div>

                            {/* <HeroPill
                                className="w-min mb-6"
                                href="https://github.com/HelixDB/helix-db"
                                label="Vector types available!"
                                announcement="🎉 New"
                                isExternal
                            /> */}
                        </motion.div>

                        <motion.h1
                            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
                            variants={headingVariants}
                        >
                            The Fastest <span className="iridescent-text drop-shadow-lg drop-shadow-primary/20 [text-shadow:_0_0_30px_rgb(0_0_0/_20%)]">Graph-Vector</span> Database <br />Built to Scale
                        </motion.h1>

                        <motion.p
                            className="text-base sm:text-xl text-foreground bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-6 sm:mb-8 sm:mr-16 leading-relaxed px-2 sm:px-0 max-w-2xl"
                            variants={paragraphVariants}
                        >
                            Feed your agents more relevant context with the fastest and most scalable graph-vector database, built in Rust.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
                            <motion.div
                                className="flex flex-col w-full sm:w-auto order-2 sm:order-1"
                                variants={buttonVariants}
                                custom={1.2}
                            >
                                <Button
                                    size="lg"
                                    className="px-6 sm:px-8 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl lg:text-2xl flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-200"
                                    asChild
                                >
                                    <a
                                        href="https://github.com/HelixDB/helix-db"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                                        <span>Star on GitHub</span>
                                        {stars !== null && (
                                            <span className="ml-1">
                                                ({formatNumber(stars)})
                                            </span>
                                        )}
                                    </a>
                                </Button>
                                <span className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                                    Takes 2 seconds 🙏
                                </span>
                            </motion.div>

                            <motion.div
                                variants={buttonVariants}
                                custom={1.5}
                                className="w-full sm:w-auto order-1 sm:order-2"
                            >
                                <Button
                                    className="px-6 sm:px-8 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-0 w-full sm:w-auto border-white/10 hover:bg-white/5 hover:scale-105 transition-all duration-200"
                                    variant="secondary"
                                ><a
                                    href="https://docs.helix-db.com"
                                    className="flex items-center gap-3 sm:gap-4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                        <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
                                        <span>View Docs</span>
                                    </a>
                                </Button>
                            </motion.div>


                        </div>

                    </motion.div>

                    {/* Empty column that the graph will appear behind */}
                    <div className="hidden lg:block col-span-11"></div>
                </div>
            </div>
        </motion.div>
    )
} 