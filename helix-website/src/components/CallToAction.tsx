'use client';

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function CallToAction() {
    const handleGetStarted = () => {
        window.open('https://cal.com/helix-db', '_blank');
    };

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
            <div className="container relative mx-auto px-4">
                <div className="text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                        Start your project today
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="px-8 py-6 text-lg border-white/10 hover:bg-white/5 w-full sm:w-auto"
                                onClick={handleGetStarted}
                            >
                                Book Demo
                            </Button>
                        </div>

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
            </div>
        </section>
    );
} 