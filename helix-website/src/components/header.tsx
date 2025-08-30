"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Github, Calendar, BookOpen, FileText } from "lucide-react"
import { Button } from "./ui/button"
import { Logo } from "./ui/logo"
import { formatNumber } from "@/lib/github"
import { getGithubStars } from "@/lib/github"

export function Header() {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        getGithubStars().then(setStars);
    }, []);


    return (
        <header className="fixed top-0 z-50 w-full mx-auto border-b border-border/40 dark:border-white/10 bg-background/70  backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex items-center w-full justify-between py-2 relative">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Logo />
                        <span className="hidden text-xl font-bold sm:inline-block">
                            HelixDB
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Docs Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-white/5"
                            asChild
                        >
                            <a
                                href="https://docs.helix-db.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <BookOpen className="w-4 h-4 hidden sm:inline" />
                                <span>Docs</span>
                            </a>
                        </Button>

                        {/* Blog Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-white/5"
                            asChild
                        >
                            <Link href="/blog">
                                <FileText className="w-4 h-4 hidden sm:inline" />
                                <span>Blog</span>
                            </Link>
                        </Button>

                        {/* Get a Demo Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-white/5"
                            asChild
                        >
                            <a
                                href="https://cal.com/helix-db/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Calendar className="w-4 h-4 hidden sm:inline" />
                                <span>Demo</span>
                            </a>
                        </Button>

                        {/* GitHub Button - Primary CTA */}
                        <Button
                            size="sm"
                            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-yellow-400 hover:to-yellow-500 hover:scale-110 transition-all duration-200"
                            asChild
                        >
                            <a
                                href="https://github.com/HelixDB/helix-db"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-4 h-4" />
                                {stars !== null && (
                                    <span>
                                        {formatNumber(stars)}
                                    </span>
                                )}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
} 