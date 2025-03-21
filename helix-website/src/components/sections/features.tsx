"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Cloud, Code2, Zap, ArrowDownUp, Brain, Network, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
    {
        title: "Single Database Solution",
        description:
            "No more managing two databases for Hybrid RAG. One unified solution for all your needs.",
        icon: Cloud,
    },
    {
        title: "Enhanced Performance",
        description:
            "Faster, more efficient AI applications with native graph-vector operations.",
        icon: Zap,
    },
    {
        title: "Future-Proof Architecture",
        description:
            "Start with one type, scale to both without migration. Grow at your own pace.",
        icon: ArrowDownUp,
    }
];

// Animated demo components for each use case
const HybridRAGDemo = () => {
    const [step, setStep] = useState(0);
    const nodes = [
        { x: 40, y: 35, z: 0, size: 4 },
        { x: 80, y: 35, z: 20, size: 6 },
        { x: 60, y: 65, z: 40, size: 5 },
        { x: 40, y: 65, z: 60, size: 3 },
    ];

    useEffect(() => {
        // Only run animation if the device is not a mobile device
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % nodes.length);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const currentNodeIndex = step;
    const nextNodeIndex = (currentNodeIndex + 1) % nodes.length;

    const currentNode = nodes[currentNodeIndex];
    const nextNode = nodes[nextNodeIndex];

    // Apply perspective transform based on Z
    const transformNode = (node: typeof nodes[0]) => {
        const scale = 1 - node.z / 200; // Perspective scale
        const x = node.x;
        const y = node.y - (node.z * 0.3); // Move up as z increases
        return { x, y, scale };
    };

    return (
        <div className="h-32 bg-primary/5 rounded-lg p-2 mb-4 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <marker
                        id="hybridDot"
                        viewBox="0 0 2 2"
                        refX="1"
                        refY="1"
                        markerWidth="2"
                        markerHeight="2">
                        <circle cx="1" cy="1" r="1" className="fill-primary/30" />
                    </marker>
                </defs>
                <g>
                    {/* Draw grid lines */}
                    {[0, 1, 2, 3].map((i) => (
                        <React.Fragment key={`grid-${i}`}>
                            <line
                                x1={30 + i * 20}
                                y1={25}
                                x2={30 + i * 20 - 15}
                                y2={75}
                                className="stroke-primary/5"
                                strokeWidth="0.5"
                            />
                            <line
                                x1={30}
                                y1={25 + i * 15}
                                x2={90}
                                y2={25 + i * 15 - 10}
                                className="stroke-primary/5"
                                strokeWidth="0.5"
                            />
                        </React.Fragment>
                    ))}

                    {/* Draw nodes with perspective */}
                    {nodes.map((node, i) => {
                        const { x, y, scale } = transformNode(node);
                        return (
                            <g key={i} style={{ transform: `scale(${scale})`, transformOrigin: `${x}px ${y}px` }}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={node.size}
                                    className={`${i === currentNodeIndex ? 'fill-primary' : 'fill-primary/20'}`}
                                />
                                {/* Add depth circle */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={node.size * 0.6}
                                    className={`${i === currentNodeIndex ? 'fill-primary/30' : 'fill-primary/10'}`}
                                />
                            </g>
                        );
                    })}

                    {/* Animated dotted line */}
                    <motion.line
                        x1={transformNode(currentNode).x}
                        y1={transformNode(currentNode).y}
                        x2={transformNode(currentNode).x}
                        y2={transformNode(currentNode).y}
                        animate={{
                            x2: transformNode(nextNode).x,
                            y2: transformNode(nextNode).y
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            restDelta: 0.001
                        }}
                        stroke="currentColor"
                        className="stroke-primary/40"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        markerStart="url(#hybridDot)"
                        markerMid="url(#hybridDot)"
                        markerEnd="url(#hybridDot)"
                    />

                    {/* Moving dot */}
                    <motion.circle
                        initial={false}
                        animate={{
                            cx: [transformNode(currentNode).x, transformNode(nextNode).x],
                            cy: [transformNode(currentNode).y, transformNode(nextNode).y],
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "linear",
                            times: [0, 1],
                        }}
                        r="2"
                        className="fill-primary"
                    />
                </g>
            </svg>
        </div>
    );
};

const GraphDemo = () => {
    const [nodes, setNodes] = useState([
        { x: 30, y: 30, phase: 0 },
        { x: 90, y: 30, phase: 1 },
        { x: 60, y: 70, phase: 2 },
        { x: 30, y: 70, phase: 3 },
        { x: 90, y: 70, phase: 4 },
        { x: 60, y: 30, phase: 5 },
    ]);

    useEffect(() => {
        // Only run animation if the device is not a mobile device
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        let animationFrame: number | undefined;
        let startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;

            setNodes(nodes.map((node, i) => {
                const angle = (elapsed * 0.001 + node.phase * Math.PI / 3);
                const radius = 5;
                const newX = node.x + Math.cos(angle) * radius;
                const newY = node.y + Math.sin(angle * 2) * radius;
                // Remove random movement for better performance
                return {
                    ...node,
                    x: Math.max(15, Math.min(105, newX)),
                    y: Math.max(15, Math.min(85, newY)),
                };
            }));

            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    return (
        <div className="h-32 bg-primary/5 rounded-lg p-2 mb-4 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet">
                <g>
                    {/* Draw edges first */}
                    {nodes.map((node, i) => (
                        nodes.map((target, j) => (
                            i < j && (
                                <motion.line
                                    key={`${i}-${j}`}
                                    x1={node.x}
                                    y1={node.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke="currentColor"
                                    className="text-primary/15"
                                    strokeWidth="0.7"
                                    initial={false}
                                    animate={{ x1: node.x, y1: node.y, x2: target.x, y2: target.y }}
                                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                                />
                            )
                        ))
                    ))}
                    {/* Draw nodes on top */}
                    {nodes.map((node, i) => (
                        <motion.circle
                            key={`node-${i}`}
                            cx={node.x}
                            cy={node.y}
                            r="2.5"
                            className="fill-primary"
                            initial={false}
                            animate={{ cx: node.x, cy: node.y }}
                            transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
};

const VectorDemo = () => {
    const [step, setStep] = useState(0);
    const points = [
        { x: 20, y: 50 },
        { x: 100, y: 30 },
        { x: 60, y: 70 },
    ];

    useEffect(() => {
        // Only run animation if the device is not a mobile device
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % (points.length * 3));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentPointIndex = Math.floor(step / 3);
    const nextPointIndex = (currentPointIndex + 1) % points.length;
    const subStep = step % 3;

    const currentPoint = points[currentPointIndex];
    const nextPoint = points[nextPointIndex];

    // Calculate rotation angle based on direction
    const getRotation = (from: { x: number, y: number }, to: { x: number, y: number }) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        return (Math.atan2(dy, dx) * 180) / Math.PI;
    };

    const rotation = getRotation(
        subStep === 2 ? currentPoint : points[(currentPointIndex + points.length - 1) % points.length],
        subStep === 2 ? nextPoint : currentPoint
    );

    return (
        <div className="h-32 bg-primary/5 rounded-lg p-2 mb-4 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <marker
                        id="dot"
                        viewBox="0 0 2 2"
                        refX="1"
                        refY="1"
                        markerWidth="2"
                        markerHeight="2">
                        <circle cx="1" cy="1" r="1" className="fill-primary/30" />
                    </marker>
                </defs>
                <g>
                    {/* Draw target points */}
                    {points.map((point, i) => (
                        <circle
                            key={i}
                            cx={point.x}
                            cy={point.y}
                            r="2"
                            className={`${i === currentPointIndex ? 'fill-primary' : 'fill-primary/20'}`}
                        />
                    ))}

                    {/* Draw dotted trail */}
                    {subStep === 2 && (
                        <motion.line
                            x1={currentPoint.x}
                            y1={currentPoint.y}
                            x2={currentPoint.x}
                            y2={currentPoint.y}
                            animate={{
                                x2: nextPoint.x,
                                y2: nextPoint.y
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                            }}
                            stroke="none"
                            className="stroke-primary/30"
                            strokeWidth="1"
                            markerMid="url(#dot)"
                            markerEnd="url(#dot)"
                            strokeDasharray="1 3"
                        />
                    )}

                    {/* Animated arrow/dot */}
                    <motion.g
                        initial={false}
                        animate={{
                            x: subStep === 2 ? nextPoint.x : currentPoint.x,
                            y: subStep === 2 ? nextPoint.y : currentPoint.y,
                            scale: subStep === 1 ? 0.2 : 1,
                            rotate: rotation,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        }}
                    >
                        <motion.path
                            d="M-6,-4 L6,0 L-6,4 L-3,0 Z"
                            className="fill-primary"
                            animate={{
                                opacity: subStep === 1 ? 0 : 1
                            }}
                        />
                        <motion.circle
                            cx="0"
                            cy="0"
                            r="3"
                            className="fill-primary"
                            animate={{
                                opacity: subStep === 1 ? 1 : 0
                            }}
                        />
                    </motion.g>
                </g>
            </svg>
        </div>
    );
};

const UnifiedDemo = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        // Only run animation if the device is not a mobile device
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const cylinders = [
        { x: 25, y: 50, gradientId: "cylinderGradient1" },
        { x: 60, y: 50, gradientId: "cylinderGradient2" },
        { x: 95, y: 50, gradientId: "cylinderGradient3" }
    ];

    const stackedPositions = [
        { x: 60, y: 30 },
        { x: 60, y: 50 },
        { x: 60, y: 70 }
    ];

    return (
        <div className="h-32 bg-primary/5 rounded-lg p-4 mb-4 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="cylinderGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="cylinderGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="cylinderGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                </defs>
                {cylinders.map((cylinder, i) => (
                    <motion.g
                        key={i}
                        initial={false}
                        animate={{
                            x: active === 2 ? stackedPositions[i].x : cylinder.x,
                            y: active === 2 ? stackedPositions[i].y : cylinder.y,
                            scale: 1
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                    >
                        {/* Cylinder top ellipse */}
                        <motion.ellipse
                            cx={0}
                            cy={0}
                            rx={16}
                            ry={6}
                            fill={`url(#${cylinder.gradientId})`}
                            fillOpacity={0.2}
                            stroke={`url(#${cylinder.gradientId})`}
                            strokeWidth="1"
                            animate={{
                                opacity: active === 2 ? 1 : 0.6
                            }}
                        />
                        {/* Cylinder body */}
                        <motion.rect
                            x={-16}
                            y={0}
                            width={32}
                            height={12}
                            fill={`url(#${cylinder.gradientId})`}
                            fillOpacity={0.3}
                            stroke={`url(#${cylinder.gradientId})`}
                            strokeWidth="1"
                            animate={{
                                opacity: active === 2 ? 1 : 0.6
                            }}
                        />
                        {/* Cylinder bottom ellipse */}
                        <motion.ellipse
                            cx={0}
                            cy={12}
                            rx={16}
                            ry={6}
                            fill={`url(#${cylinder.gradientId})`}
                            fillOpacity={0.1}
                            stroke={`url(#${cylinder.gradientId})`}
                            strokeWidth="1"
                            animate={{
                                opacity: active === 2 ? 1 : 0.6
                            }}
                        />
                    </motion.g>
                ))}
            </svg>
        </div>
    );
};

const useCases = [
    {
        title: "Hybrid RAG",
        description: "For AI/LLM developers needing contextual retrieval.",
        icon: Brain,
        Demo: HybridRAGDemo,
    },
    {
        title: "Graph-Only",
        description: "For fraud detection, recommendation systems, and knowledge graphs.",
        icon: Network,
        Demo: GraphDemo,
    },
    {
        title: "Vector-Only",
        description: "For semantic search, embeddings, and image/audio retrieval.",
        icon: Search,
        Demo: VectorDemo,
    },
    {
        title: "Unified Database for Teams",
        description: "Reduce learning curve, work with one DB across projects.",
        icon: Users,
        Demo: UnifiedDemo,
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.3
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
            stiffness: 100,
            damping: 15
        }
    }
};

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
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

export function FeaturesSection() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/50" />
            <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-primary/[0.01]" />
            <div className="container relative mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={titleVariants}
                    className="text-center mb-16 max-w-7xl mx-auto"
                >
                    <div className="relative inline-block">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent 
                        [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 
                        to-primary/80">                            Why Use Helix?
                        </h2>

                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`p-6 rounded-xl border border-white/5 bg-muted/10 ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                                }`}
                            whileHover={{
                                scale: 1.02,
                                transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                }}
                                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                                style={{
                                    background: `linear-gradient(135deg, 
                                        rgba(99, 102, 241, 0.1) 0%,
                                        rgba(139, 92, 246, 0.1) 100%)`
                                }}
                            >
                                <feature.icon className="w-7 h-7 text-primary" />
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-muted">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
                >
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="p-6 rounded-xl backdrop-blur-sm border border-white/5 bg-muted/10"
                            style={{
                                transform: "translateZ(0)",
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden"
                            }}
                            whileHover={{
                                scale: 1.02,
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                    delay: index * 0.1 + 0.3
                                }}
                                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                                style={{
                                    background: `linear-gradient(135deg, 
                                        rgba(99, 102, 241, 0.1) 0%,
                                        rgba(139, 92, 246, 0.1) 100%)`
                                }}
                            >
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-sm" />
                                <useCase.icon className="w-7 h-7 text-primary" />
                            </motion.div>
                            <useCase.Demo />
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                {useCase.title}
                            </h3>
                            <p className="text-muted">{useCase.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 