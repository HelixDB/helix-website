"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/amplify-functions";
import { AuthModal } from "@/components/ui/auth-modal";

const codeExamples = [
    `// Define your schema
V::User {
  Name: String,
  Age: Integer
}
`,

    `// Create a new user and add followers
QUERY addUser() =>
  alice <- AddV<User>({Name: "Alice", Age: 25})
  bob <- AddV<User>({Name: "Bob", Age: 30})
  AddE<Follows>()::From(bob)::To(alice)::Props({Since: 1.5})
  RETURN alice`,

    `// Find users over 25 and their followers
QUERY findActiveUsers() =>
  users <- V<User>()::WHERE(_::Props(Age)::GT(25))
  followers <- users::In<Follows>()::WHERE(_::Props(Since)::GT(1.0))
  RETURN followers`
];

export function HeroSection() {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const user = await getCurrentUser();
            setIsAuthenticated(!!user);
        } catch (err) {
            setIsAuthenticated(false);
        }
    };

    const handleGetStarted = () => {
        if (isAuthenticated) {
            router.push("/dashboard");
        } else {
            setShowAuthModal(true);
        }
    };

    return (
        <section className="relative py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-2xl mx-auto">
                        The Graph Database For Developers
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Say goodbye to complexity, high costs, and clunky query languages. Helix
                        is designed to be fast, intuitive, and powerful.
                    </p>
                </div>

                <div className="max-w-xl mx-auto shadow-lg overflow-hidden rounded-lg">
                    <div
                        className="rounded-lg overflow-hidden"
                        style={{
                            background:
                                currentTheme === "dark"
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(255,255,255,0.5)",
                        }}
                    >
                        <div className="px-4 py-2 bg-muted/50 flex items-center">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="ml-4 text-sm font-medium">example.hx</span>
                        </div>
                        <div className="p-4 h-[200px] overflow-hidden">
                            <TypingAnimation
                                texts={codeExamples}
                                typingSpeed={30}
                                deletingSpeed={10}
                                delayBetween={3000}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <div className="flex gap-4 justify-center">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6"
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6 gap-2"
                            asChild
                        >
                            <a
                                href="https://github.com/HelixDB/helix-db"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <Github className="h-5 w-5" />
                                View on GitHub
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false);
                    checkAuthStatus();
                }}
            />
        </section>
    );
}
