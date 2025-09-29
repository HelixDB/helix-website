"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cloud, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function CloudServiceSection() {
    return (
        <motion.div
            variants={fadeInUp}
            className="py-16 flex items-center justify-center"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
                    {/* Left side - Full Card with cloud visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="order-2 lg:order-1 hidden lg:block w-full"
                    >
                        <Card className="relative h-full p-8 border-foreground/20 bg-background/50 backdrop-blur-sm shadow-[inset_0_0_60px_rgba(255,255,255,0.05)] overflow-hidden">
                            {/* Animated background grid */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                            </div>

                            {/* Central cloud icon */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <Cloud className="w-32 h-32 text-orange-400/20" />
                                    <div className="absolute inset-0 blur-3xl bg-foreground/10 rounded-full"></div>
                                </div>
                            </div>

                            {/* Floating cloud elements */}
                            <motion.div
                                className="absolute top-12 left-12"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Cloud className="w-8 h-8 text-orange-400/30" />
                            </motion.div>

                            <motion.div
                                className="absolute top-20 right-16"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            >
                                <Cloud className="w-6 h-6 text-orange-400/25" />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-20 left-20"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <Cloud className="w-10 h-10 text-orange-400/35" />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-16 right-12"
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            >
                                <Cloud className="w-7 h-7 text-orange-400/20" />
                            </motion.div>

                            {/* Status indicators */}
                            <div className="absolute top-8 left-8 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-foreground/50">Active</span>
                            </div>

                            {/* Mock metrics */}
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-foreground/50">Uptime</span>
                                        <span className="text-xs text-foreground/70 font-mono">99.99%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-foreground/50">Response Time</span>
                                        <span className="text-xs text-foreground/70 font-mono">&lt;10ms</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-foreground/50">Auto-scaling</span>
                                        <span className="text-xs text-green-400">Enabled</span>
                                    </div>
                                </div>
                            </div>

                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32">
                                <div className="absolute top-4 right-4 w-24 h-24 border-t border-r border-foreground/10 rounded-tr-3xl"></div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right side - Enhanced Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-left order-1 lg:order-2 w-full"
                    >
                        <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                                Coming Soon
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 leading-tight pb-2">
                            Managed Cloud Service
                        </h2>
                        {/* Enhanced feature list */}
                        <ul className="space-y-3 mb-10 text-muted-foreground">
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>Automatic scaling to handle traffic spikes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>24/7 expert support and monitoring</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span>Enterprise-grade security and compliance</span>
                            </li>
                        </ul>

                        {/* Enhanced CTA button */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl  hover:shadow-2xl  transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
                                asChild
                            >
                                <a
                                    href="/waitlist"
                                    className="flex items-center justify-center gap-3"
                                >
                                    <Cloud className="w-5 h-5" />
                                    <span className="font-semibold">Join Waitlist</span>
                                </a>
                            </Button>
                            <p className="text-sm text-muted-foreground hidden sm:block">
                                Be the first to know when we launch
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
} 