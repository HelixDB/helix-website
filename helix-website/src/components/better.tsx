import React from "react";
import OrbitingCircles from "@/components/magicui/orbiting-circles";

export function Better() {
    return (
        <div className="min-h-screen flex items-center relative py-24">
            {/* Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute inset-0 bg-background dark:bg-black"></div>
                <div className="absolute inset-0 bg-grid-small-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center max-w-8xl mx-auto">
                    {/* Left column - text content */}
                    <div className="flex flex-col max-w-2xl relative">
                        <div className="absolute -inset-10 bg-gradient-radial from-background/95 dark:from-black/95 via-background/70 dark:via-black/70 to-transparent rounded-3xl -z-10 blur-sm"></div>

                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6">
                            Better by Design
                        </h2>

                        <p className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8">
                            Stop juggling multiple databases. HelixDB unifies graph and vector capabilities in a single, powerful database that speeds up your development process.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <svg className="w-7 h-7 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Simplified Architecture</h3>
                                    <p className="text-muted-foreground">One database to handle both graph relationships and vector embeddings. No more complex integrations.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <svg className="w-7 h-7 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Faster Development</h3>
                                    <p className="text-muted-foreground">Write queries that combine graph traversal and vector similarity in a single operation.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <svg className="w-7 h-7 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Built-in Security</h3>
                                    <p className="text-muted-foreground">Unified authentication and access control. No need to secure multiple systems.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - animated infographic */}
                    <div className="relative flex h-[600px] w-full flex-col items-center justify-center">
                        <OrbitingCircles />
                    </div>
                </div>
            </div>
        </div>
    );
} 