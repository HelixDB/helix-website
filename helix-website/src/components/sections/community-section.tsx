"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Users } from "lucide-react";
import { FaDiscord } from "react-icons/fa6";
import { SocialGrid } from "@/components/ui/social-grid";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function CommunitySection() {
    return (
        <motion.div
            variants={fadeInUp}
            className="py-24 flex items-center justify-center"
        >
            <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left side - Enhanced Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-left space-y-8"
                    >
                        <div className="space-y-6 ">
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80">
                                Join Our Growing Community
                            </h2>
                            <p className="text-xl leading-relaxed text-muted-foreground max-w-lg">
                                Be part of the next generation of database technology.
                                Connect with developers and innovators building the future.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2"
                                asChild
                            >
                                <a
                                    href="https://discord.gg/2stgMPr5BD"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3"
                                >
                                    <FaDiscord className="w-5 h-5" />
                                    <span className="font-semibold">Join Discord</span>
                                </a>
                            </Button>
                            <Button
                                size="lg"
                                className="text-lg px-8 py-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl  hover:shadow-2xl  transition-all duration-300 transform hover:scale-105"
                                asChild
                            >
                                <a
                                    href="https://github.com/HelixDB/helix-db"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3"
                                >
                                    <Github className="w-5 h-5" />
                                    <span className="font-semibold">Star on GitHub</span>
                                </a>
                            </Button>
                        </div>

                    </motion.div>

                    {/* Right side - Social Grid */}
                    <SocialGrid />
                </div>
            </div>
        </motion.div>
    );
} 