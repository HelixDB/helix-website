"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const BetterInfographic: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    const traditionalStack = [
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
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="w-full py-6 relative">
            <div className="max-w-5xl mx-auto">
                {/* Comparison Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Complex vs Simple
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Why choose complexity when simplicity works better?
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Traditional Setup Side */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Traditional Setup
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                        </div>
                        <div className="space-y-12  max-w-[250px]">
                            {traditionalStack.map((category, categoryIndex) => (
                                <motion.div
                                    key={category.title}
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    {/* Vertical connecting line */}
                                    {categoryIndex < traditionalStack.length - 1 && (
                                        <div className="absolute left-[5px] top-[20px] w-[2px] h-[calc(100%+2.5rem)] bg-gradient-to-b from-indigo-500/50 to-purple-500/50 dark:from-indigo-400/30 dark:to-purple-400/30" />
                                    )}

                                    <div className="flex items-start gap-3 mb-3">
                                        {/* Bullet point circle */}
                                        <div className="relative mt-1.5">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400" />
                                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 animate-ping opacity-20" />
                                        </div>

                                        <div className="flex-1 ml-3">
                                            <div className="mb-3">
                                                <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                                    {category.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {category.description}
                                                </p>
                                            </div>
                                            <motion.div
                                                className="grid grid-cols-3 gap-3 relative"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {category.images.map((img, index) => (
                                                    <motion.div
                                                        key={img.alt}
                                                        whileHover={{ scale: 1.1, zIndex: 10 }}
                                                        className="relative aspect-square bg-black/10 dark:bg-white/30 rounded-lg p-3 shadow-sm transition-shadow hover:shadow-md backdrop-blur-sm"
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Helix Setup
                            </h3>
                            <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700"></div>
                        </div>
                        <motion.div
                            className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-between py-12"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Base Background Layer with 80% opacity */}
                            <div className="absolute inset-0 bg-indigo-600/80" />

                            {/* Original Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-20" />

                            {/* Background Animation Layer 1 - Moving Gradient */}
                            <motion.div
                                className="absolute inset-0 opacity-20"
                                animate={{
                                    background: [
                                        "linear-gradient(45deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
                                        "linear-gradient(190deg, #7c3aed 0%, #ec4899 50%, #4f46e5 100%)",
                                        "linear-gradient(320deg, #ec4899 0%, #4f46e5 50%, #7c3aed 100%)",
                                        "linear-gradient(45deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)",
                                    ],
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Background Animation Layer 2 - Floating Orbs */}
                            <motion.div
                                className="absolute inset-0 opacity-50"
                                animate={{
                                    background: [
                                        "radial-gradient(circle at 20% 20%, #60a5fa 0%, transparent 50%)",
                                        "radial-gradient(circle at 80% 80%, #60a5fa 0%, transparent 50%)",
                                        "radial-gradient(circle at 20% 80%, #60a5fa 0%, transparent 50%)",
                                        "radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 50%)",
                                        "radial-gradient(circle at 20% 20%, #60a5fa 0%, transparent 50%)",
                                    ],
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Background Animation Layer 3 - Subtle Pulse */}
                            <motion.div
                                className="absolute inset-0 opacity-10 mix-blend-overlay"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white" />
                            </motion.div>

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
                                    src="/helix-white.svg"
                                    alt="Helix"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>

                            <div className="text-center px-4 max-w-sm relative z-10">
                                <h4 className="text-lg font-bold text-white mb-4 mt-6">
                                    One Simple Solution
                                </h4>
                                <p className="text-sm font-medium text-white/90 mb-6">
                                    Replace your complex stack with a single platform
                                </p>
                                <ul className="text-xs text-white/80 space-y-2">
                                    <li>• No complex infrastructure to manage</li>
                                    <li>• No multiple services to maintain</li>
                                    <li>• No operational overhead</li>
                                </ul>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
