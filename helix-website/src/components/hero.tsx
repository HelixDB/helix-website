"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { HeroPill } from "@/components/ui/hero-pill";
import { Graph } from "./graph";

export function Hero() {
    return (
        <div className="min-h-screen flex items-center relative">
            {/* Absolute positioned graph behind everything */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                <Graph />
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col max-w-2xl relative">
                        {/* Radial gradient underlay for better contrast with the graph */}
                        <div className="absolute -inset-10 bg-gradient-radial from-background/95 via-background/70 to-transparent rounded-3xl -z-10 blur-sm"></div>

                        <HeroPill
                            className="w-min mb-6"
                            href="https://github.com/HelixDB/helix-db"
                            label="Vector types available!"
                            announcement="🎉 New"
                            isExternal
                        /><h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6">
                            Build 10x Faster with the first fully native Graph-Vector Database
                        </h1>

                        <p className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80  mb-8">
                            Accelerate development with a unified graph and vector database designed for modern AI applications.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="px-8 py-6 text-lg border-white/10 hover:bg-white/5 mb-4 sm:mb-0"
                                onClick={() => window.open('https://calendly.com/helix-db/new-meeting', '_blank')}
                            >
                                Book Demo
                            </Button>

                            <div className="flex flex-col">
                                <Button
                                    size="lg"
                                    className="px-8 py-6 text-lg flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                                    asChild
                                >
                                    <a
                                        href="https://github.com/HelixDB/helix-db"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Star className="w-5 h-5" />
                                        <span>Star on GitHub</span>
                                    </a>
                                </Button>
                                <span className="text-muted-foreground mt-1 text-center italic mt-2">only takes 3 seconds 🙏🏻</span>
                            </div>
                        </div>
                    </div>

                    {/* Empty column that the graph will appear behind */}
                    <div className="hidden lg:block"></div>
                </div>
            </div>
        </div>
    )
} 