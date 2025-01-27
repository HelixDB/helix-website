"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, User, LogOut, CreditCard } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { Logo } from "./ui/logo"
import { AuthModal } from "./ui/auth-modal"
import { getCurrentUser } from "@/amplify-functions"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { signOut } from "aws-amplify/auth"

export function Header() {
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
                        <Button variant="outline" className="">
                            <a
                                href="https://helix.mintlify.app/introduction"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Docs
                            </a>
                        </Button>
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className=""
                                        size="icon"
                                    >
                                        <User className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/billing" className="cursor-pointer">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            <span>Billing</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="default"
                                onClick={() => setShowAuthModal(true)}
                            >
                                Sign In
                            </Button>
                        )}
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