"use client";

import React from "react";
import { Terminal, Cloud, Code2, Zap, ArrowDownUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Serverless Database",
        description:
            "Set up in minutes. We handle the infrastructure so you can focus on your product.",
        icon: Terminal,
    },
    {
        title: "Cost-Effective",
        description:
            "You only pay for what you use. No hidden fees, no overprovisioning.",
        icon: Zap,
    },
    {
        title: "Powerful Query Language",
        description:
            "Helix provides a language that's readable, type-safe, and powerful.",
        icon: Code2,
    },
    {
        title: "Easy to implement",
        description:
            "Helix automatically generates API endpoints that make it easy to implement.",
        icon: ArrowDownUp,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.3
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

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
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

export function FeaturesSection() {
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={titleVariants}
                    className="text-center mb-16"
                >
                    <div className="relative inline-block">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                            Why Use Helix?
                        </h2>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
                        A graph-vector database that puts developers first.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="p-6 rounded-xl bg-card"
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "var(--card-hover)",
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                    delay: index * 0.1 + 0.3
                                }}
                                className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                            >
                                <feature.icon className="w-6 h-6 text-primary" />
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 