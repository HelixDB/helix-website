"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/amplify-functions";
import { AuthModal } from "@/components/ui/auth-modal";
import { motion } from "framer-motion";

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

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.7
        }
    }
};

const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.2
        }
    }
};

const codeBlockVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.4
        }
    }
};

const buttonGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.6
        }
    }
};

const dotVariants = {
    hidden: { scale: 0 },
    visible: (delay: number) => ({
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay
        }
    })
};

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
        window.open('https://calendly.com/helix-db/new-meeting', '_blank');
    };

    return (
        <section className="relative py-16 h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.8 }}
                        className="relative"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-2xl mx-auto bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                            The Ultimate Graph-Vector Database
                        </h1>
                    </motion.div>
                    <motion.p
                        variants={descriptionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.8 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        We combine the power of graph databases with vector types natively to build RAG applications easily.
                    </motion.p>
                </div>

                <motion.div
                    variants={codeBlockVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.8 }}
                    className="max-w-xl mx-auto shadow-lg overflow-hidden rounded-lg"
                >
                    <div
                        className="rounded-lg overflow-hidden"
                        style={{
                            background:
                                currentTheme === "dark"
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(255,255,255,0.5)",
                        }}
                    >
                        <div

                            className="px-4 py-2 bg-muted/50 flex items-center"
                        >
                            <div className="flex space-x-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        custom={0.7 + i * 0.1}
                                        variants={dotVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`w-3 h-3 rounded-full ${i === 0 ? "bg-red-500" : i === 1 ? "bg-yellow-500" : "bg-green-500"
                                            }`}
                                    />
                                ))}
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
                </motion.div>

                <motion.div
                    variants={buttonGroupVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.8 }}
                    className="text-center mt-12"
                >
                    <div className="flex gap-4 justify-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 17
                            }}
                        >
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6"
                                onClick={handleGetStarted}
                            >
                                Book Demo
                            </Button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 17
                            }}
                        >
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
                        </motion.div>
                    </div>
                </motion.div>
            </div >
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false);
                    checkAuthStatus();
                }}
            />
        </section >
    );
}
