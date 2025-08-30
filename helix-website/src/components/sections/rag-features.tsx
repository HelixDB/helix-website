import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function RAGFeatures() {
    return (
        <div className="min-h-screen flex items-center relative py-24 bg-gradient-to-b from-transparent via-neutral-100/10 to-neutral-100/5 dark:via-neutral-900/10 dark:to-neutral-900/5">
            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center max-w-7xl mx-auto">
                    {/* Left column - text content */}
                    <div className="flex flex-col max-w-2xl relative">
                        <div className="absolute -inset-10 bg-gradient-radial from-background/95 dark:from-black/95 via-background/70 dark:via-black/70 to-transparent rounded-3xl -z-10 blur-sm"></div>

                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6 leading-tight py-1">
                            Supercharged RAG
                        </h2>

                        <p className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80 mb-8">
                            Combine the power of vector similarity with graph relationships for more accurate and contextual AI responses.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <svg className="w-7 h-7 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Hybrid Search</h3>
                                    <p className="text-muted-foreground">Combine semantic similarity with graph traversal to find the most relevant information across your knowledge base.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <svg className="w-7 h-7 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Contextual Relationships</h3>
                                    <p className="text-muted-foreground">Maintain connections between documents, versions, and related content for more accurate responses.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)" }}>
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm"></div>
                                    <svg className="w-7 h-7 text-primary relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Automatic Syncing</h3>
                                    <p className="text-muted-foreground">Vector embeddings and graph relationships stay in sync as your knowledge base evolves.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - static graphs grid */}
                    <div className="relative flex w-full h-full flex-col justify-between">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Hybrid RAG */}
                            <div className="relative group rounded-xl bg-gradient-to-br from-background/80 to-background/40 dark:from-gray-900/80 dark:to-gray-900/40 p-6 backdrop-blur-md border border-gray-200/30 dark:border-gray-800/30 hover:border-primary/50 transition-all duration-300 shadow-lg shadow-gray-900/5 dark:shadow-black/10 hover:shadow-xl hover:shadow-primary/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)" }}>
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm"></div>
                                        <svg className="w-6 h-6 text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground relative z-10">Hybrid RAG</h3>
                                <p className="text-sm text-muted-foreground/90 relative z-10">For AI/LLM developers needing contextual retrieval.</p>
                            </div>

                            {/* Graph-Only */}
                            <div className="relative group rounded-xl bg-gradient-to-br from-background/80 to-background/40 dark:from-gray-900/80 dark:to-gray-900/40 p-6 backdrop-blur-md border border-gray-200/30 dark:border-gray-800/30 hover:border-primary/50 transition-all duration-300 shadow-lg shadow-gray-900/5 dark:shadow-black/10 hover:shadow-xl hover:shadow-primary/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)" }}>
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm"></div>
                                        <svg className="w-6 h-6 text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground relative z-10">Graph-Only</h3>
                                <p className="text-sm text-muted-foreground/90 relative z-10">For fraud detection, recommendation systems, and knowledge graphs.</p>
                            </div>

                            {/* Vector-Only */}
                            <div className="relative group rounded-xl bg-gradient-to-br from-background/80 to-background/40 dark:from-gray-900/80 dark:to-gray-900/40 p-6 backdrop-blur-md border border-gray-200/30 dark:border-gray-800/30 hover:border-primary/50 transition-all duration-300 shadow-lg shadow-gray-900/5 dark:shadow-black/10 hover:shadow-xl hover:shadow-primary/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)" }}>
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm"></div>
                                        <svg className="w-6 h-6 text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground relative z-10">Vector-Only</h3>
                                <p className="text-sm text-muted-foreground/90 relative z-10">For semantic search, embeddings, and image/audio retrieval.</p>
                            </div>

                            {/* Unified Database */}
                            <div className="relative group rounded-xl bg-gradient-to-br from-background/80 to-background/40 dark:from-gray-900/80 dark:to-gray-900/40 p-6 backdrop-blur-md border border-gray-200/30 dark:border-gray-800/30 hover:border-primary/50 transition-all duration-300 shadow-lg shadow-gray-900/5 dark:shadow-black/10 hover:shadow-xl hover:shadow-primary/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)" }}>
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm"></div>
                                        <svg className="w-6 h-6 text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground relative z-10">Unified Database for Teams</h3>
                                <p className="text-sm text-muted-foreground/90 relative z-10">Reduce learning curve, work with one DB across projects.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 