import React from "react";
import { BetterInfographic } from "./better-animation";
import { Clock, DollarSign, GitPullRequestDraft, Zap } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.3,
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

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15
        }
    }
};

export function Better() {
    return (
        <div className="min-h-[1080px] flex items-center relative py-24 overflow-hidden">


            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-24 items-center max-w-8xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Left column - text content */}
                    <div className="flex flex-col lg:max-w-2xl relative col-span-5 w-full lg:col-span-2 ">


                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6 leading-tight py-1"
                        >
                            Why is RAG still so hard?
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8 leading-relaxed"
                        >
                            Most teams stitch together vector DBs, graph DBs, and custom logic. It's slow to build, hard to maintain, expensive to scale, and bottlenecks performance.
                        </motion.p>

                        <motion.div
                            className="grid grid-cols-3 gap-4 lg:grid-cols-1"
                            variants={containerVariants}
                        >
                            {/* Multiple Databases Card */}
                            <motion.div
                                className="relative group h-full"
                                variants={cardVariants}
                            >
                                <div className="bg-card/80 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-purple-300/30 h-full">
                                    <div className="flex items-start gap-4 h-full">
                                        <motion.div
                                            className="w-12 h-12 aspect-square rounded-lg flex items-center justify-center relative flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                            <GitPullRequestDraft className="w-6 h-6 text-primary" />
                                        </motion.div>
                                        <div className="flex flex-col justify-start">
                                            <h3 className="text-md md:text-lg font-semibold mb-2">Multiple Databases</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed hidden md:block">Juggle multiple databases for graph, vector, and relational data.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Multiple Servers Card */}
                            <motion.div
                                className="relative group h-full"
                                variants={cardVariants}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/5 rounded-2xl blur-xl scale-105 -z-10 opacity-60"></div>

                                <div className="bg-card/80 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-orange-500/30 h-full">
                                    <div className="flex items-start gap-4 h-full">
                                        <motion.div
                                            className="w-12 h-12 aspect-square rounded-lg flex items-center justify-center relative flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)" }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 blur-sm"></div>
                                            <Clock className="w-6 h-6 text-orange-500" />
                                        </motion.div>
                                        <div className="flex flex-col justify-start">
                                            <h3 className="text-md md:text-lg font-semibold mb-2">Multiple Servers</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed hidden md:block">Passing data between servers is slow, expensive, and hard to manage.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* High Costs Card */}
                            <motion.div
                                className="relative group h-full"
                                variants={cardVariants}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/5 rounded-2xl blur-xl scale-105 -z-10 opacity-60"></div>

                                <div className="bg-card/80 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-emerald-500/30 h-full">
                                    <div className="flex items-start gap-4 h-full">
                                        <motion.div
                                            className="w-12 h-12 aspect-square rounded-lg flex items-center justify-center relative flex-shrink-0"
                                            style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)" }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 blur-sm"></div>
                                            <DollarSign className="w-6 h-6 text-emerald-500" />
                                        </motion.div>
                                        <div className="flex flex-col justify-start">
                                            <h3 className="text-md md:text-lg font-semibold mb-2">High Costs</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed hidden md:block">Stuck paying for multiple services, extra requests, and duplicated data.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right column - animated infographic */}
                    <motion.div
                        className="relative flex w-full flex-col items-center justify-center  col-span-5 lg:col-span-3"
                        variants={itemVariants}
                    >
                        <BetterInfographic />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
} 