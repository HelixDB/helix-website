"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cloud, ArrowUpRight } from "lucide-react";

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
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Enhanced Cloud illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center lg:justify-start order-2 lg:order-1 hidden lg:block "
                    >
                        <div className="relative ml-auto">
                            {/* Main cloud container */}
                            <div className="w-80 h-80 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full flex items-center justify-center shadow-2xl shadow-primary/10 border border-primary/10">
                                <div className="w-48 h-48 bg-gradient-to-br from-primary/25 to-primary/10 rounded-full flex items-center justify-center shadow-xl">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/15 rounded-full flex items-center justify-center">
                                        <Cloud className="w-12 h-12 text-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/20 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-primary/40 to-primary/25 rounded-full animate-pulse delay-1000 shadow-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                            <div className="absolute top-1/4 -left-8 w-6 h-6 bg-gradient-to-br from-primary/35 to-primary/20 rounded-full animate-pulse delay-500 shadow-md flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            </div>
                            <div className="absolute bottom-1/4 -right-4 w-10 h-10 bg-gradient-to-br from-primary/25 to-primary/15 rounded-full animate-pulse delay-700 shadow-lg flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                            </div>

                            {/* Subtle background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl scale-150 -z-10"></div>
                        </div>
                    </motion.div>

                    {/* Right side - Enhanced Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-left order-1 lg:order-2"
                    >
                        <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                                Coming Soon
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 leading-tight pb-2">
                            Managed Cloud Service
                        </h2>
                        <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
                            Focus on building while we handle the infrastructure.
                            Our fully managed HelixDB service takes care of scaling,
                            maintenance, and security so you can concentrate on what matters most.
                        </p>

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
                            <p className="text-sm text-muted-foreground ">
                                Be the first to know when we launch
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
} 