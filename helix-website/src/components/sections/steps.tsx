import React from 'react';
import { Terminal, Code2, Rocket } from 'lucide-react';

export function Steps() {
    return (
        <div className="relative">
            <div className="w-full">
                <div className="relative bg-muted/[0.8] dark:bg-background/30 backdrop-blur-md border border-gray-200/10 dark:border-gray-800/20 shadow-xl py-16 overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-purple-500/[0.03] to-pink-500/[0.03] dark:from-blue-400/[0.05] dark:via-purple-400/[0.05] dark:to-pink-400/[0.05] animate-gradient-slow bg-gradient-size"></div>

                    <div className="px-4 md:px-8 py-8 drop-shadow-lg relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                            Get Started in Minutes
                        </h2>

                        <p className="text-center text-muted-foreground mb-6 mt-2">
                            Helix is a simple, powerful, and open-source built in Rust.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-0 max-w-4xl mx-auto relative items-stretch">
                            {/* Step 1 */}
                            <div className="relative group">
                                <div className="[.dark_&]:bg-gray-900/60  backdrop-blur-md rounded-lg p-3 border border-gray-200/20 dark:border-gray-800/30 h-full transition-all duration-300 hover:border-primary/20 drop-shadow-xl hover:scale-105">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center relative shrink-0"
                                            style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-sm"></div>
                                            <Terminal className="w-4 h-4 text-primary relative z-10" />
                                        </div>
                                        <h3 className="text-sm font-semibold">1. Install Helix</h3>
                                    </div>
                                    <div className="bg-muted/30 [.dark_&]:bg-black/30 rounded px-2 py-1 font-mono text-xs mb-1.5 overflow-x-auto">
                                        <code className="text-foreground/90">npm install @helix/client</code>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-tight">Get started with our client library.</p>
                                </div>
                            </div>

                            {/* Arrow 1 */}
                            <div className="hidden md:flex items-center justify-center w-8">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/20">
                                    <path d="M5 12h14m-7-7l7 7-7 7" />
                                </svg>
                            </div>

                            {/* Step 2 */}
                            <div className="relative group">
                                <div className="[.dark_&]:bg-gray-900/60 bg-white backdrop-blur-md rounded-lg p-3 border border-gray-200/20 dark:border-gray-800/30 h-full transition-all duration-300 hover:border-primary/20 drop-shadow-xl hover:scale-105">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center relative shrink-0"
                                            style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-sm"></div>
                                            <Code2 className="w-4 h-4 text-primary relative z-10" />
                                        </div>
                                        <h3 className="text-sm font-semibold">2. Write Queries</h3>
                                    </div>
                                    <div className="bg-muted/30 [.dark_&]:bg-black/30 rounded px-2 py-1 font-mono text-xs mb-1.5 overflow-x-auto">
                                        <code className="text-foreground/90">client.search("machine learning")</code>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-tight">Write powerful vector search queries.</p>
                                </div>
                            </div>

                            {/* Arrow 2 */}
                            <div className="hidden md:flex items-center justify-center w-8">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/20">
                                    <path d="M5 12h14m-7-7l7 7-7 7" />
                                </svg>
                            </div>

                            {/* Step 3 */}
                            <div className="relative group">
                                <div className="[.dark_&]:bg-gray-900/60 bg-white backdrop-blur-md rounded-lg p-3 border border-gray-200/20 dark:border-gray-800/30 h-full transition-all duration-300 hover:border-primary/20 drop-shadow-xl hover:scale-105">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center relative shrink-0"
                                            style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-sm"></div>
                                            <Rocket className="w-4 h-4 text-primary relative z-10" />
                                        </div>
                                        <h3 className="text-sm font-semibold">3. Deploy</h3>
                                    </div>
                                    <div className="bg-muted/30 [.dark_&]:bg-black/30 rounded px-2 py-1 font-mono text-xs mb-1.5 overflow-x-auto">
                                        <code className="text-foreground/90">helix deploy --production</code>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-tight">Deploy and scale instantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 