import React from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            duration: 0.2,
            when: "beforeChildren"
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 12
        }
    }
};

const codeBlockVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 12
        }
    }
};

const arrowVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 10,
            delay: 0.1
        }
    }
};

export function PrecompiledQueries() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="min-h-[80vh] flex items-center relative py-24  mb-20">
                <div className="container mx-auto px-4 sm:px-8 relative z-10">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center max-w-8xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {/* Left column - code example */}
                        <motion.div
                            className="relative flex w-full flex-col items-center justify-center order-last lg:order-first"
                            variants={containerVariants}
                        >
                            <div className="flex flex-col items-center gap-4 w-full">
                                {/* Query definition block */}
                                <motion.div
                                    className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg flex flex-col"
                                    variants={codeBlockVariants}
                                >
                                    <motion.div
                                        className="bg-muted/50 flex-none flex items-center"
                                        variants={itemVariants}
                                    >
                                        <div className="px-3 py-2 text-sm font-medium text-foreground">
                                            query.ts
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="grid transition-[height] duration-300 ease-in-out overflow-hidden bg-muted"
                                        variants={itemVariants}
                                    >
                                        <motion.div
                                            className="[grid-area:1/1]"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <pre className="w-full px-4 py-3 m-0 font-mono text-sm leading-relaxed overflow-x-auto text-foreground/90 whitespace-pre-wrap break-words">{`QUERY addUsers() =>
  user1 <- AddV<User>({Name: "Alice", Age: 30})
  user2 <- AddV<User>({Name: "Bob", Age: 25})
  AddE<Follows>::From(user1)::To(user2)
  RETURN user1, user2
  `}</pre>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>

                                {/* Arrow */}
                                <motion.div
                                    className="flex items-center justify-center w-full py-1"
                                    variants={arrowVariants}
                                >
                                    <svg className="w-8 h-8 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </motion.div>

                                {/* Generated API endpoint block */}
                                <motion.div
                                    className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg flex flex-col"
                                    variants={codeBlockVariants}
                                >
                                    <motion.div
                                        className="bg-muted/50 flex-none flex items-center"
                                        variants={itemVariants}
                                    >
                                        <div className="px-3 py-2 text-sm font-medium text-foreground">
                                            Generated API Endpoint
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="grid transition-[height] duration-300 ease-in-out overflow-hidden bg-muted"
                                        variants={itemVariants}
                                    >
                                        <motion.div
                                            className="[grid-area:1/1]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8, duration: 0.5 }}
                                        >
                                            <pre className="w-full px-4 py-3 m-0 font-mono text-sm leading-relaxed overflow-x-auto text-foreground/90 whitespace-pre-wrap break-words typing-animation">{`POST https://api.helix-db.com/project-name/addUsers
→ Returns {\n\tuser1: User,\n\tuser2: User\n  }`}</pre>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right column - text content */}
                        <motion.div
                            className="flex flex-col max-w-2xl relative order-first lg:order-last"
                            variants={containerVariants}
                        >
                            <motion.h2
                                variants={itemVariants}
                                className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-6 leading-tight py-1"
                            >
                                Lightning-Fast Queries
                            </motion.h2>

                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-transparent bg-gradient-to-r bg-clip-text from-foreground to-foreground/80"
                            >
                                Transform complex database queries into instant API endpoints. Write once, deploy as a blazing-fast microservice.
                            </motion.p>

                            <motion.p
                                variants={itemVariants}
                                className="mt-6 text-lg text-muted-foreground"
                            >
                                Simply write your queries and we build them directly into your database, and we'll automatically optimize it at build time. Your query becomes a dedicated API endpoint, eliminating parsing overhead and delivering exceptional performance.
                            </motion.p>

                            <motion.p
                                variants={itemVariants}
                                className="mt-4 text-lg text-muted-foreground"
                            >
                                With built-in caching and automatic optimization, you can be sure your queries will run at peak performance every time.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @keyframes typing {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .typing-animation {
                    animation: typing 2s steps(40, end);
                    animation-fill-mode: forwards;
                    white-space: pre-wrap;
                }
            `}</style>
        </>
    );
} 