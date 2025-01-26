"use client"

import Link from "next/link"
import { Github } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { Logo } from "./ui/logo"

export function Header() {
    return (
        <header className="relative top-0 z-50 w-full backdrop-blur-xl mx-auto px-4 sm:px-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex items-center w-full justify-between py-6">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Logo />
                        <span className="hidden font-bold sm:inline-block">
                            HelixDB
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="text-neutral-500">
                            <a
                                href="https://helix.mintlify.app/introduction"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Docs
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
} 