"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TraditionalStackItem {
    title: string;
    description: string;
    images: Array<{
        src: string;
        alt: string;
    }>;
}

export const BetterInfographic: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    const traditionalStack: TraditionalStackItem[] = [
        {
            title: "Graph Databases",
            description: "Complex setup and maintenance",
            images: [
                { src: "/neo4j.png", alt: "Neo4j" },
                { src: "/arrango.png", alt: "ArangoDB" },
                { src: "/neptune.png", alt: "Amazon Neptune" },
            ],
        },
        {
            title: "Vector Databases",
            description: "Multiple services to manage",
            images: [
                { src: "/pinecone.png", alt: "Pinecone" },
                { src: "/qdrant.png", alt: "Qdrant" },
                { src: "/reddis.png", alt: "Redis" },
            ],
        },
        {
            title: "Cloud Infrastructure",
            description: "High operational overhead",
            images: [
                { src: "/google.png", alt: "Google Cloud" },
                { src: "/aws.png", alt: "AWS" },
                { src: "/azure.png", alt: "Azure" },
            ],
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
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
                stiffness: 120,
                damping: 15
            }
        }
    };

    const stackItemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    const helixVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 12
            }
        }
    };

    return (
        <div className="w-full py-8 relative">
            <motion.div
                className="max-w-6xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="grid grid-cols-2 gap-12 lg:gap-16">
                    {/* Traditional Setup Side */}
                    <motion.div
                        variants={containerVariants}
                        className="space-y-6"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 mb-8"
                        >
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                                Traditional Setup
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-border via-border/50 to-transparent"></div>
                        </motion.div>

                        <div className="space-y-8 max-w-sm">
                            {traditionalStack.map((category, categoryIndex) => (
                                <motion.div
                                    key={category.title}
                                    variants={stackItemVariants}
                                    className="relative group"
                                >
                                    {/* Connection line */}
                                    {categoryIndex < traditionalStack.length - 1 && (
                                        <motion.div
                                            className="absolute left-[6px] top-[24px] w-[2px] h-[calc(100%+1.5rem)] z-0"
                                            initial={{
                                                background: "linear-gradient(to bottom, transparent, transparent)",
                                                scaleY: 0
                                            }}
                                            animate={{
                                                background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4))",
                                                scaleY: 1
                                            }}
                                            transition={{
                                                delay: 0.5 + categoryIndex * 0.2,
                                                duration: 0.6,
                                                ease: "easeOut"
                                            }}
                                            style={{ transformOrigin: "top" }}
                                        />
                                    )}

                                    <div className="flex items-start gap-4 relative z-10">
                                        {/* Timeline dot */}
                                        <motion.div
                                            className="relative mt-2 flex-shrink-0"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                delay: 0.3 + categoryIndex * 0.2,
                                                type: "spring",
                                                stiffness: 200
                                            }}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-purple-500 shadow-lg" />
                                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-br from-primary to-purple-500 animate-ping opacity-30" />
                                        </motion.div>

                                        {/* Content card */}
                                        <motion.div
                                            className="flex-1 bg-card/60 backdrop-blur-sm border border-primary/10 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary/30"
                                            whileHover={{ y: -2 }}
                                        >
                                            <motion.div
                                                className="mb-4"
                                                variants={itemVariants}
                                            >
                                                <h4 className="text-lg font-semibold text-foreground mb-1">
                                                    {category.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.description}
                                                </p>
                                            </motion.div>

                                            <motion.div
                                                className="grid grid-cols-3 gap-3"
                                                variants={containerVariants}
                                            >
                                                {category.images.map((img, index) => (
                                                    <div
                                                        key={img.alt}
                                                        className="relative aspect-square bg-background/80 rounded-lg p-2  transition-all duration-300 border border-transparent bg-white/20 hover:border-primary/30"
                                                    >
                                                        <Image
                                                            src={img.src}
                                                            alt={img.alt}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Helix Side */}
                    <motion.div
                        variants={helixVariants}
                        className="relative flex flex-col"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 mb-8"
                        >
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                                Helix Setup
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-border via-border/50 to-transparent"></div>
                        </motion.div>

                        <motion.div
                            className="relative bg-card/60 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 flex-1 flex flex-col items-center justify-center group overflow-hidden"
                            whileHover={{
                                scale: 1.02
                            }}
                            transition={{ duration: 0.4 }}
                            style={{
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                            }}
                        >
                            {/* Background gradient effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Floating particles effect */}
                            <div className="absolute inset-0 overflow-hidden">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                                        animate={{
                                            x: [0, 100, 0],
                                            y: [0, -100, 0],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{
                                            duration: 3 + i,
                                            repeat: Infinity,
                                            delay: i * 0.5
                                        }}
                                        style={{
                                            left: `${20 + i * 15}%`,
                                            top: `${30 + i * 10}%`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Helix Logo */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{
                                    scale: isHovered ? 1.15 : 1,
                                    opacity: 1,
                                    rotate: isHovered ? 5 : 0
                                }}
                                transition={{
                                    duration: 0.5,
                                    type: "spring",
                                    stiffness: 150
                                }}
                                className="relative w-40 h-40 mb-6 z-10"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{
                                    filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))"
                                }}
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <Image
                                    src="/dark-helix.png"
                                    alt="Helix"
                                    fill
                                    className="object-contain hidden dark:block relative z-10"
                                />
                                <Image
                                    src="/light-helix.png"
                                    alt="Helix"
                                    fill
                                    className="object-contain block dark:hidden relative z-10"
                                />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                className="text-center max-w-sm relative z-10"
                                variants={itemVariants}
                            >
                                <motion.h4
                                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 mb-4"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    One Simple Solution
                                </motion.h4>

                                <motion.p
                                    className="text-base font-medium text-muted-foreground mb-6 leading-relaxed"
                                    variants={itemVariants}
                                >
                                    Replace your complex stack with a single platform
                                </motion.p>

                                <motion.div
                                    className="space-y-3 hidden md:block"
                                    variants={containerVariants}
                                >
                                    {[
                                        "No complex infrastructure to manage",
                                        "No multiple services to maintain",
                                        "No operational overhead"
                                    ].map((text, index) => (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            className="flex items-center gap-3 text-sm text-foreground/80 bg-background/50 rounded-lg p-3 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300"
                                            whileHover={{
                                                x: 5,
                                                backgroundColor: "rgba(99, 102, 241, 0.05)"
                                            }}
                                        >
                                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full flex-shrink-0"></div>
                                            <span>{text}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}