import React from "react";
import { BetterInfographic } from "./ui/better-animation";
import { Clock, GitPullRequestDraft, Zap } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0,
            duration: 0.2,
            when: "beforeChildren"
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
            stiffness: 150,
            damping: 12
        }
    }
};

const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 12
        }
    }
};

export function Better() {
    return (
        <div className="min-h-[80vh] flex items-center relative py-24 bg-gradient-to-b from-transparent via-neutral-100/5 to-neutral-100/10 dark:via-neutral-900/5 dark:to-neutral-900/10">
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
                            className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6 leading-tight py-1"
                        >
                            Better by Design
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8"
                        >
                            Stop juggling multiple databases. HelixDB unifies graph and vector capabilities in a single, powerful database that speeds up your development process.
                        </motion.p>

                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                        >
                            <motion.div
                                className="flex items-start gap-4"
                                variants={featureVariants}
                            >
                                <motion.div
                                    className="w-14 h-14 aspect-square rounded-lg flex items-center justify-center relative"
                                    style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <GitPullRequestDraft className="w-7 h-7 text-primary" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Simplified Architecture</h3>
                                    <p className="text-muted-foreground">One database to handle both graph relationships and vector embeddings. No more complex integrations.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start gap-4"
                                variants={featureVariants}
                            >
                                <motion.div
                                    className="w-14 h-14 aspect-square rounded-lg flex items-center justify-center relative"
                                    style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <Clock className="w-7 h-7 text-primary" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Faster Development</h3>
                                    <p className="text-muted-foreground">Write queries that combine graph traversal and vector similarity in a single operation.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-start gap-4"
                                variants={featureVariants}
                            >
                                <motion.div
                                    className="w-14 h-14 aspect-square rounded-lg flex items-center justify-center relative"
                                    style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <Zap className="w-7 h-7 text-primary" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">High Performance</h3>
                                    <p className="text-muted-foreground">Optimised in Rust, HelixDB even compiles queries into your database for speed and simplicity.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right column - animated infographic */}
                    <motion.div
                        className="relative flex w-full flex-col items-center justify-center"
                        variants={itemVariants}
                    >
                        <BetterInfographic />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
} 