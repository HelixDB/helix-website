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
                staggerChildren: 0.15,
                delayChildren: 0.3,
                duration: 0.5,
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
                stiffness: 100,
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
                stiffness: 100,
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
                stiffness: 100,
                damping: 15,
                delay: 0.6
            }
        }
    };

    return (
        <div className="w-full py-6 relative">
            <motion.div
                className="max-w-5xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="grid grid-cols-2 gap-6">
                    {/* Traditional Setup Side */}
                    <motion.div
                        variants={containerVariants}
                        className="space-y-4"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 mb-4"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Traditional Setup
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                        </motion.div>
                        <div className="space-y-12 max-w-[250px]">
                            {traditionalStack.map((category, categoryIndex) => (
                                <motion.div
                                    key={category.title}
                                    variants={stackItemVariants}
                                    className="relative"
                                >
                                    {categoryIndex < traditionalStack.length - 1 && (
                                        <motion.div
                                            className="absolute left-[5px] top-[20px] w-[2px] h-[calc(100%+2.5rem)]"
                                            initial={{ background: "linear-gradient(to bottom, transparent, transparent)" }}
                                            animate={{
                                                background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5))",
                                            }}
                                            transition={{ delay: 0.5 + categoryIndex * 0.2, duration: 0.5 }}
                                        />
                                    )}

                                    <div className="flex items-start gap-3 mb-3">
                                        <motion.div
                                            className="relative mt-1.5"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 + categoryIndex * 0.2, type: "spring" }}
                                        >
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400" />
                                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 animate-ping opacity-20" />
                                        </motion.div>

                                        <div className="flex-1 ml-3">
                                            <motion.div
                                                className="mb-3"
                                                variants={itemVariants}
                                            >
                                                <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                                    {category.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {category.description}
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                className="grid grid-cols-3 gap-3 relative"
                                                variants={itemVariants}
                                            >
                                                {category.images.map((img, index) => (
                                                    <motion.div
                                                        key={img.alt}
                                                        whileHover={{ scale: 1.1, zIndex: 10 }}
                                                        className="relative aspect-square bg-black/10 dark:bg-white/30 rounded-lg p-3 shadow-sm transition-shadow hover:shadow-md backdrop-blur-sm"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.6 + index * 0.1 + categoryIndex * 0.2 }}
                                                    >
                                                        <Image
                                                            src={img.src}
                                                            alt={img.alt}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Helix Side */}
                    <motion.div
                        variants={helixVariants}
                        className="relative"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center space-x-4 mb-4"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Helix Setup
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                        </motion.div>
                        <motion.div
                            className="relative rounded-xl  overflow-hidden flex flex-col items-center justify-between py-6"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                        >


                            {/* Content */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0.5 }}
                                animate={{
                                    scale: isHovered ? 1.1 : 1,
                                    opacity: 1,
                                }}
                                transition={{ duration: 0.5 }}
                                className="relative w-32 h-32"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <Image
                                    src="/dark-helix.png"
                                    alt="Helix"
                                    fill
                                    className="object-contain hidden dark:block"
                                />
                                <Image
                                    src="/light-helix.png"
                                    alt="Helix"
                                    fill
                                    className="object-contain block dark:hidden"
                                />
                            </motion.div>

                            <motion.div
                                className="text-center px-4 max-w-sm relative z-10"
                                variants={itemVariants}
                            >
                                <h4 className="text-lg font-bold text-foreground mb-4 mt-6">
                                    One Simple Solution
                                </h4>
                                <p className="text-sm font-medium text-foreground/90 mb-6">
                                    Replace your complex stack with a single platform
                                </p>
                                <motion.ul
                                    className="text-xs text-foreground/80 space-y-2"
                                    variants={containerVariants}
                                >
                                    <motion.li variants={itemVariants}>• No complex infrastructure to manage</motion.li>
                                    <motion.li variants={itemVariants}>• No multiple services to maintain</motion.li>
                                    <motion.li variants={itemVariants}>• No operational overhead</motion.li>
                                </motion.ul>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}