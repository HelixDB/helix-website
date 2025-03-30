'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            duration: 0.3,
            when: "beforeChildren"
        }
    }
};

const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: index * 0.05
        }
    })
};

const cardContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15
        }
    }
};

const useCases = [
    {
        title: "Code Documentation",
        description: "Effectively search your documentation from your codebase to help AI agents.",
        icon: "📚",
    },
    {
        title: "Semantic Search",
        description: "Find relevant information across your entire database using natural language.",
        icon: "🔍",
    },
    {
        title: "Code Based Indexing",
        description: "Store the context of your code alongside distinct relationships (such asfile structure & dependencies).",
        icon: "👀",
    },
    {
        title: "Knowledge Base",
        description: "Create and maintain a searchable knowledge base from your technical documentation.",
        icon: "💡",
    },
    {
        title: "AI Coding Agents",
        description: "Retrieve the most relevant code snippets from your codebase to help AI agents.",
        icon: "🤖",
    },
    {
        title: "Vector & Graph RAG",
        description: "Build traditional Graph or Vector RAG. Utilize vectors and graphs independently.",
        icon: "🏃🏻",
    },
    {
        title: "Hybrid RAG",
        description: "Combine Vector and Graph RAG to create a more powerful and accurate retrieval system.",
        icon: "🔍🏃🏻",
    },
    {
        title: "Part Lookup",
        description: "Find the most relevant parts of a product from your database and other compatible parts.",
        icon: "🏗️",
    },
];

const UseCaseCard = ({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: string;
}) => {
    return (
        <motion.figure
            className="h-full shadow-lg rounded-2xl bg-muted p-4 cursor-default transition-all duration-300"
            whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <motion.div
                className="flex flex-col gap-2 h-full"
                variants={cardContentVariants}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">
                        {icon}
                    </span>
                    <h3 className="text-sm font-medium dark:text-white">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </motion.div>
        </motion.figure>
    );
};

const UseCases = () => {
    return (
        <section className="py-20 relative bg-gradient-to-b from-neutral-100/5 via-neutral-100/10 to-transparent dark:from-neutral-900/5 dark:via-neutral-900/10 dark:to-transparent">
            <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.h2
                    className="text-4xl font-bold mb-4"
                    variants={headerVariants}
                >
                    Use Cases
                </motion.h2>
                <motion.p
                    className="text-xl max-w-2xl mx-auto"
                    variants={headerVariants}
                >
                    Discover how Helix can be used in a wide range of use cases.
                </motion.p>
            </motion.div>

            <motion.div
                className="flex w-full flex-col items-center justify-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4"
                    variants={containerVariants}
                >
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={useCase.title}
                            variants={cardVariants}
                            custom={index}
                            className="h-full"
                        >
                            <UseCaseCard {...useCase} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default UseCases; 