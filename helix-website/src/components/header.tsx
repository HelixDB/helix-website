"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, CreditCard, Star, Github, PhoneCall, Calendar } from "lucide-react"
import { Button } from "./ui/button"
import { Logo } from "./ui/logo"
import { AuthModal } from "./ui/auth-modal"
import { getCurrentUser } from "@/lib/amplify-functions"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { signOut } from "aws-amplify/auth"
import { SocialLinks } from "./ui/social-links"
import { formatNumber } from "@/lib/github"
import { getGithubStars } from "@/lib/github"

export function Header() {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        getGithubStars().then(setStars);
    }, []);

    const router = useRouter()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const user = await getCurrentUser()
            setIsAuthenticated(!!user)
            setUserEmail(user?.username || null)
        } catch (err) {
            setIsAuthenticated(false)
            setUserEmail(null)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            setIsAuthenticated(false)
            setUserEmail(null)
            router.push("/")
        } catch (err) {
            console.error("Error signing out:", err)
        }
    }

    return (
        <header className="fixed top-0 z-50 w-full mx-auto border-b border-border/40 dark:border-white/10 bg-background/70  backdrop-blur-md">
            <div className="max-w-8xl mx-auto px-4 sm:px-8">
                <div className="flex items-center w-full justify-between py-2 relative">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Logo />
                        <span className="hidden text-xl font-bold sm:inline-block">
                            HelixDB
                        </span>
                    </Link>

                    {/* Absolutely centered social links */}
                    <div className="hidden md:block absolute left-0 right-0 mx-auto w-fit">
                        <SocialLinks />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* {isAuthenticated ? (

                            <Link href="/dashboard" className="cursor-pointer ">
                                <Button variant="secondary" size="sm">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </Button>
                            </Link>


                        ) : (
                            <Button
                                variant="secondary"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Sign Up
                            </Button>
                        )} */}

                        <a
                            href="https://github.com/HelixDB/helix-db"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row items-center hover:text-yellow-300"
                        >
                            <Github className="w-4 h-4" />
                            {stars !== null && (
                                <span className="ml-2">
                                    {formatNumber(stars)}
                                </span>
                            )}
                        </a>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="sm:flex items-center gap-2 border border-white/10 hover:bg-white/5"
                            asChild
                        >
                            <a
                                href="https://docs.helix-db.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Docs
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            className="sm:flex items-center gap-2 "
                        >
                            <a
                                href="https://cal.com/helix-db/30min"
                                className="flex items-center gap-4"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Book a Call</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false)
                    checkAuthStatus()
                }}
            />
        </header>
    )
} 