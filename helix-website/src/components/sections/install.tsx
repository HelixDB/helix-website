"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, Download, InfinityIcon, ListStart, Code, Terminal, Hammer, Upload, Cloud, Search, FolderSearch2, ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { CodeEditor } from "../ui/code-editor";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    description: string;
    alignRight?: boolean;
}

const SectionHeader = ({ icon: Icon, title, description, alignRight = false }: SectionHeaderProps) => (
    <div className={`space-y-4 col-span-1 ${alignRight ? 'text-end' : ''}`}>
        <Icon className={`w-8 h-8 transition-transform ${alignRight ? 'ml-auto' : ''}`} />
        <p className="text-2xl font-bold">{title}</p>
        <p className="text-md text-foreground/50">{description}</p>
    </div>
);

interface CodeBlockProps {
    title: string;
    code: string;
    lineNumbers?: string;
    color?: 'green' | 'orange' | 'yellow' | 'cyan';
    description?: string;
    showPrompt?: boolean;
    additionalCode?: {
        code: string;
        description?: string;
    };
}

const CodeBlock = ({
    title,
    code,
    lineNumbers,
    color = 'green',
    description,
    showPrompt = true,
    additionalCode
}: CodeBlockProps) => {
    const colorClasses = {
        green: 'text-green-400',
        orange: 'text-orange-400',
        yellow: 'text-yellow-300',
        cyan: 'text-cyan-400'
    };

    const shadowColors = {
        green: 'rgba(0,255,0,0.1)',
        orange: 'rgba(255,165,0,0.1)',
        yellow: 'rgba(255,255,0,0.1)',
        cyan: 'rgba(0,255,255,0.1)'
    };

    return (
        <div className="flex flex-col overflow-hidden bg-black rounded-xl border border-foreground/30 shadow-[0_0_30px_rgba(0,255,0,0.1)]" style={{ boxShadow: `0 0 30px ${shadowColors[color]}` }}>
            <p className="text-md text-foreground/90 px-4 py-2">{title}</p>
            <pre className="bg-zinc-900 flex flex-row p-4 text-sm font-mono overflow-x-auto">
                {lineNumbers && (
                    <code className="pr-4 select-none text-foreground/50">
                        {lineNumbers}
                    </code>
                )}
                {showPrompt && !lineNumbers && (
                    <code className="pr-4 select-none">
                        {`> `}
                    </code>
                )}
                <code className={colorClasses[color]}>
                    {code}
                </code>
            </pre>
            {description && (
                <p className="text-md text-foreground/50 px-4 py-2">
                    {description}
                </p>
            )}
            {additionalCode && (
                <>
                    {additionalCode.description && (
                        <p className="text-md text-foreground/50 px-4 py-2">
                            {additionalCode.description}
                        </p>
                    )}
                    <pre className="bg-zinc-900 flex flex-row p-4 text-sm font-mono overflow-x-auto">
                        {lineNumbers && (
                            <code className="pr-4 select-none text-foreground/50">
                                {lineNumbers}
                            </code>
                        )}
                        {showPrompt && !lineNumbers && (
                            <code className="pr-4 select-none">
                                {`> `}
                            </code>
                        )}
                        <code className={colorClasses[color]}>
                            {additionalCode.code}
                        </code>
                    </pre>
                </>
            )}
        </div>
    );
};

interface SectionLayoutProps {
    header: React.ReactNode;
    content: React.ReactNode;
}

const SectionLayout = ({ header, content }: SectionLayoutProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 p-8">
        {header}
        {content}
    </div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            duration: 0.5
        }
    }
};


export function Install() {
    const [activeOS, setActiveOS] = useState("unix");
    const [copied, setCopied] = useState(false);
    const [height, setHeight] = useState("auto");
    const [activeStep, setActiveStep] = useState(0);
    const [timerDuration, setTimerDuration] = useState(8000);
    const [cycleCount, setCycleCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const { theme } = useTheme();

    const steps = [
        { icon: Download, text: "Install", title: "Terminal", color: "green", code: "$ curl -sSL \"https://install.helix-db.com\" | bash\n$ helix install\n" },
        { icon: Hammer, text: "Build", title: "queries.hx", color: "orange", code: "$ helix init --path\n\n" },
        { icon: Cloud, text: "Deploy", title: "POST localhost:6969", color: "cyan", code: "curl -X POST http://localhost:6969 -H \n\n" }
    ];

    // Auto-rotation effect


    // On click, set active step, reset cycle, and slow timer
    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setTimerDuration(12000);
        setCycleCount(0);
    };

    useEffect(() => {
        if (!preRef.current) return;

        const updateHeight = () => {
            if (preRef.current) {
                setHeight(`${preRef.current.scrollHeight}px`);
            }
        };

        // Create a ResizeObserver to watch for content size changes
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(preRef.current);

        // Initial height measurement
        updateHeight();

        return () => {
            if (preRef.current) {
                resizeObserver.unobserve(preRef.current);
            }
        };
    }, [activeOS]); // Re-run when OS changes to ensure proper observation

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const installCommands = {
        unix: `$ curl -sSL "https://install.helix-db.com" | bash\n\n$ helix install`,
        windows: `Coming soon...`
    };

    const fileNames = {
        unix: "Unix",
        windows: "Windows"
    };

    return (
        <div className=" flex  relative py-48">
            <div className="container mx-auto px-4 sm:px-8 relative z-10">

                <div className="flex  justify-between mb-8">
                    <h2 className="text-5xl font-bold drop-shadow-lg">Getting Started</h2>
                    <Button
                        variant="secondary"
                        className="flex text-lg items-center hover:bg-secondary/80 gap-2 py-6 px-6"
                        size="lg"
                        asChild
                    >
                        <a href="/docs">
                            <span>Docs</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </Button>
                </div>
                <motion.div
                    className="grid grid-cols-3 gap-8 lg:gap-8 items-center max-w-8xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map(({ icon: Icon, text, title, color, code }, index) => (
                        <Card
                            key={text}
                            onClick={() => handleStepClick(index)}
                            className={`relative overflow-hidden cursor-pointer col-span-1 p-8 group space-y-4 transition-all duration-1000 hover:opacity-100 select-none ${index === activeStep
                                ? "shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] shadow-white/5"
                                : "border-transparent opacity-30"
                                }`}
                        >
                            <div className="space-y-4">
                                <Icon className="w-8 h-8 group-hover:scale-[1.2] transition-transform" />
                                <p className="text-xl md:text-2xl font-bold">{text}</p>
                            </div>
                            <div className={`hidden md:block z-[-1] absolute transition duration-1000 bottom-[-25px] left-1/2 group-hover:scale-[1.05]`}>
                                <CodeBlock
                                    title={title}
                                    code={code}
                                    color={color as "cyan" | "green" | "orange" | "yellow"}
                                />
                            </div>
                        </Card>

                    ))}
                    <AnimatePresence mode="wait">
                        <motion.div
                            className="col-span-3"
                            key={activeStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Card className="col-span-3 border-foreground/20 shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] shadow-white/5 transition-height ease-in-out duration-1000">
                                {[
                                    <InstallDisplay key="install" />,
                                    <BuildDisplay key="build" />,
                                    <DeployDisplay key="deploy" />
                                ][activeStep]}
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div >
    );
}

const InstallDisplay = () => {
    return (
        <SectionLayout
            header={
                <SectionHeader
                    icon={Download}
                    title="Install HelixDB"
                    description="Get started with HelixDB in minutes, install the CLI and then install the database."
                />
            }
            content={
                <>
                    <div className="col-span-1 lg:col-span-2">
                        <CodeBlock
                            title="Terminal"
                            code={`$ curl -sSL "https://install.helix-db.com" | bash\n`}
                            additionalCode={{
                                code: "$ helix install",
                            }}
                            color="green"
                        />
                    </div>
                    <div className="col-span-1 lg:col-span-2 order-last md:order-none">
                        <CodeBlock
                            title="Terminal"
                            code="helix init --path"
                            color="green"
                            additionalCode={{
                                code: "helix init --path <path-here>",
                                description: "If you want to define the directory then:"
                            }}
                        />
                    </div>
                    <div className="col-span-1 ">
                        <SectionHeader
                            icon={Terminal}
                            title="Initialize Project"
                            description="Now that the Helix CLI and HelixDB are installed on your device, initialize a project."
                        />
                    </div>
                </>
            }
        />
    );
};

const BuildDisplay = () => {
    return (
        <SectionLayout
            header={
                <SectionHeader
                    icon={Hammer}
                    title="Define Schema"
                    description="Once you have initialized a project, you can start defining your database schema. Define your nodes and vectors, and then the relationship edges between them."
                />
            }
            content={
                <>
                    <div className="col-span-1">
                        <CodeBlock
                            title="schema.hx"
                            code={`N::User { \n    name: String \n    email: String \n}\n\nV::Post { \n    title: String \n    content: String \n}\n`}
                            lineNumbers={`1 \n2 \n3 \n4 \n5 \n6 \n7 \n8 \n9 `}
                            color="orange"
                            description="Here you can define your node, vector, and edge types."
                        />
                    </div>
                    <div className="col-span-1 hidden lg:block">
                        <CodeBlock
                            title="schema.hx"
                            code={`E::Follows { \n    From: User \n    To: User \n    Properties: { date: String }\n}\n\nE::Posted { \n    From: User \n...`}
                            lineNumbers={`10 \n12 \n13 \n14 \n15 \n16 \n17 \n18 \n19 `}
                            color="orange"
                            description="Here you can define your node, vector, and edge types."
                        />
                    </div>
                    <div className="col-span-1 lg:col-span-2 order-last lg:order-none">
                        <CodeBlock
                            title="queries.hx"
                            code={`QUERY similarity(vector: [F32]) =>\n    res <- SearchV(vector, 5)\n    RETURN res\n\nQUERY getPostsUser(postId: String) =>\n    posts <- N<User>::Out<Posted>\n    RETURN posts`}
                            lineNumbers={`1 \n2 \n3 \n4 \n5 \n6 \n7`}
                            color="orange"
                            description="This is where you define how your database can be queried."
                        />
                    </div>
                    <div className="col-span-1 ">
                        <SectionHeader
                            icon={FolderSearch2}
                            title="Write Queries"
                            description="Once you have initialized a project, you can start defining your database schema and writing queries."
                        />
                    </div>
                </>
            }
        />
    );
};

const DeployDisplay = () => {
    return (
        <SectionLayout
            header={
                <SectionHeader
                    icon={Cloud}
                    title="Deploy Project"
                    description="Once you have built your project, you can deploy it locally."
                />
            }
            content={
                <>
                    <div className="col-span-2">
                        <CodeBlock
                            title="Terminal"
                            code="helix deploy"
                            color="cyan"
                            description="This will deploy your project to your localhost."
                        />
                    </div>
                    <div className="col-span-2 order-last md:order-none">
                        <CodeBlock
                            title="POST localhost:6969/get_posts"
                            code={`{\n    "id": "550e8400-e29b-41d4-a716-446655440000"\n}`}
                            lineNumbers={`1 \n2 \n3`}
                            color="cyan"
                            additionalCode={{
                                code: `{\n    "posts": [\n        {"id": "123", "content": "Hello world!", "author": "alice"},\n        {"id": "456", "content": "Another post", "author": "bob"}\n    ]\n}`,
                                description: "Returns:"
                            }}
                        />
                    </div>
                    <SectionHeader
                        icon={ArrowDownUp}
                        title="Call API"
                        description="Once you have deployed your project, you can query your database by calling the corresponding API endpoints."

                    />
                </>
            }
        />
    );
};

