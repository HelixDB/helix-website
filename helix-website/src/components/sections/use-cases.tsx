'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
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

const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: index * 0.03
        }
    })
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -30,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

const useCases = [
    {
        title: "Legal Research Assistant",
        description: "Link legal cases, statutes, and expert commentary. Retrieve relevant precedents with contextual awareness.",
        icon: "⚖️",
        helixBest: {
            graphUse: "Case-to-case citations, legal topic hierarchy, statute relationships, and judicial precedent networks",
            vectorUse: "Semantic similarity of legal text and case facts, natural language legal queries, and contextual document retrieval",
            whyHelix: "Native traversal of both legal relationships and vector relevance makes graph RAG seamless. Query complex legal precedents while understanding both citation networks and semantic similarity of case facts in a single system."
        }
    },
    {
        title: "Financial Intelligence Engine",
        description: "Model entities, transactions, and market events to uncover hidden patterns or risks.",
        icon: "💼",
        helixBest: {
            graphUse: "Entity relationships, ownership trees, fund flows, transaction chains, and corporate hierarchies",
            vectorUse: "Semantic analysis of news, filings, analyst reports, and market sentiment from unstructured financial data",
            whyHelix: "Avoid stitching multiple systems—analyze structured and unstructured financial data together. Investigate complex ownership structures while simultaneously analyzing market sentiment and news impact in real-time."
        }
    },
    {
        title: "Codebase Q&A Assistant",
        description: "Answer questions about a complex codebase using linked documentation, issues, and code history.",
        icon: "🧑‍💻",
        helixBest: {
            graphUse: "Link functions, files, doc references, commit history, dependency graphs, and API relationships",
            vectorUse: "Embeddings of comments, README files, user questions, code documentation, and natural language queries",
            whyHelix: "Developers can query both structure and meaning of their codebase using a single API. Understand code architecture through dependency graphs while finding semantically relevant documentation and examples."
        }
    },
    {
        title: "Sales & Market Research Copilot",
        description: "Map target companies, competitors, and relevant people. Discover similar firms or prospects via semantic signals.",
        icon: "🕵️‍♂️",
        helixBest: {
            graphUse: "Company org charts, industry links, competitive landscapes, partnership networks, and executive connections",
            vectorUse: "Compare job posts, site content, product descriptions, company communications, and market positioning",
            whyHelix: "Enables deep research with less tooling overhead—ideal for B2B growth teams. Navigate industry relationships while discovering semantically similar companies and prospects through content analysis."
        }
    },
    {
        title: "Enterprise Knowledge Search",
        description: "Unified internal search across documents, tools, and teams with context preservation.",
        icon: "🏢",
        helixBest: {
            graphUse: "Organizational structure, document linkage, team dependencies, project relationships, and workflow connections",
            vectorUse: "Semantic search over emails, PDFs, Confluence, Slack messages, and cross-platform content discovery",
            whyHelix: "Cuts the glue code; one query language for both document retrieval and knowledge graphs. Search across all company knowledge while understanding organizational context and team relationships."
        }
    },
    {
        title: "AI Tutor with Custom Curriculum",
        description: "Offer personalized tutoring based on a student's learning graph and subject understanding.",
        icon: "📚",
        helixBest: {
            graphUse: "Curriculum roadmap, skill dependencies, performance history, learning path optimization, and prerequisite tracking",
            vectorUse: "Query semantically similar explanations, problems, learning resources, and adaptive content matching",
            whyHelix: "Enables adaptive tutoring systems with minimal orchestration. Navigate learning dependencies while finding the most relevant educational content based on student needs and learning patterns."
        }
    },
    {
        title: "Memory Layers for LLM Agents",
        description: "Build persistent memory across interactions for personalized assistants or agents.",
        icon: "🧠",
        helixBest: {
            graphUse: "Threaded memory, context windows, task graphs, conversation history, and relationship tracking",
            vectorUse: "Retrieve relevant past thoughts, questions, decisions, and semantic similarity of previous interactions",
            whyHelix: "Ideal for structured + semantic agent memory in production environments. Maintain conversation threads and task relationships while retrieving semantically relevant past interactions and decisions."
        }
    },
    {
        title: "Personalized AI Doctor",
        description: "Assist patients with knowledge that understands medical history, conditions, and new research.",
        icon: "🩺",
        helixBest: {
            graphUse: "Patient records, symptom-diagnosis-treatment relationships, drug interactions, and medical condition networks",
            vectorUse: "Retrieve semantically relevant medical literature, guidelines, research papers, and treatment protocols",
            whyHelix: "Enables AI tools that reason over health data, not just recall it. Navigate complex medical relationships while finding the most relevant research and treatment options based on patient-specific factors."
        }
    },
    {
        title: "Drug Discovery Explorer",
        description: "Search chemical compounds, interactions, and papers while navigating research graphs.",
        icon: "🧪",
        helixBest: {
            graphUse: "Compound-pathway-disease connections, molecular interactions, research collaboration networks, and clinical trial relationships",
            vectorUse: "Semantic search across biomedical papers, patents, research abstracts, and scientific literature",
            whyHelix: "Great fit for scientific research needing explainability + discovery. Traverse molecular pathways and research networks while finding semantically similar compounds and relevant scientific literature."
        }
    },
    {
        title: "Social Graph + Feed Optimization",
        description: "Model users, friends, communities and personalize feeds with semantic relevance.",
        icon: "📱",
        helixBest: {
            graphUse: "Friendships, follows, community graphs, social influence networks, and engagement patterns",
            vectorUse: "Feed embedding, text/media similarity, content preferences, and behavioral pattern analysis",
            whyHelix: "Run complex personalization queries without syncing graph and vector systems. Understand social relationships while delivering content based on semantic preferences and engagement patterns."
        }
    },
    {
        title: "Recommendation Engines",
        description: "Suggest products, content, or connections using both relational and behavioral signals.",
        icon: "🎯",
        helixBest: {
            graphUse: "User-item interactions, tags, co-purchase graphs, product relationships, and collaborative filtering networks",
            vectorUse: "User preference embeddings, product descriptions, content similarity, and behavioral pattern matching",
            whyHelix: "Powerfully mixes collaborative and content-based filtering in a single system. Navigate user-item relationship graphs while finding semantically similar products and content preferences."
        }
    },
    {
        title: "Fraud Detection & Risk Graphs",
        description: "Catch fraud by modeling entity networks and detecting anomalies with semantic input.",
        icon: "🛡️",
        helixBest: {
            graphUse: "Transaction chains, shared IPs/devices/accounts, entity networks, and suspicious relationship patterns",
            vectorUse: "Similarity in transaction metadata, messages, behavior patterns, and anomaly detection in unstructured data",
            whyHelix: "Enables investigators to query anomalies without silos. Traverse complex entity relationships while detecting semantic similarities in fraudulent behavior patterns and transaction metadata."
        }
    },
    {
        title: "Access Control & Entitlements",
        description: "Implement fine-grained access control where permissions depend on graph relationships.",
        icon: "🔐",
        helixBest: {
            graphUse: "Role hierarchies, team memberships, resource access links, organizational structure, and permission inheritance",
            vectorUse: "Semantic classification of resource types, request intents, contextual access patterns, and intelligent permission matching",
            whyHelix: "Simplifies ACL evaluation logic while enabling intelligent permissions. Navigate complex organizational hierarchies while understanding the semantic context of access requests and resource classifications."
        }
    },
    {
        title: "Agentic NPCs in Video Games",
        description: "Create intelligent NPCs with persistent memory, dynamic relationships, and contextual reactions to player actions and world events.",
        icon: "🎮",
        helixBest: {
            graphUse: "Character relationship networks, faction hierarchies, quest dependencies, world state connections, and social influence patterns between NPCs and players",
            vectorUse: "Semantic understanding of dialogue context, emotional state analysis, behavioral pattern matching, and contextual reaction generation based on stimuli",
            whyHelix: "Enables truly intelligent NPCs that remember past interactions while understanding context. Navigate complex character relationships and faction dynamics while generating contextually appropriate responses and behaviors in real-time."
        }
    },
    {
        title: "Customer Support Copilot",
        description: "Intelligent support assistant that understands customer history, product relationships, and provides contextual solutions with escalation awareness.",
        icon: "🎧",
        helixBest: {
            graphUse: "Customer interaction history, product dependency trees, support ticket relationships, escalation pathways, and team expertise networks",
            vectorUse: "Semantic similarity of support queries, solution matching from knowledge base, sentiment analysis of customer communications, and contextual response generation",
            whyHelix: "Provides comprehensive customer context while finding the most relevant solutions. Navigate customer relationship history and product complexities while delivering semantically appropriate responses and escalation recommendations."
        }
    },
    {
        title: "Code Indexing & Retrieval",
        description: "Store chunked code in tree structures mapping function calls, dependencies, and imports for semantic and structured retrieval by code reviewers and coding agents.",
        icon: "🌳",
        helixBest: {
            graphUse: "Function call hierarchies, dependency trees, import relationships, file structure mapping, class inheritance chains, and module interconnections",
            vectorUse: "Semantic embeddings of code chunks, natural language code descriptions, similar pattern matching, and contextual code search across repositories",
            whyHelix: "Enables both structural code navigation and semantic code discovery in one system. Traverse dependency graphs while finding semantically similar code patterns, making code review and agent-assisted development more efficient and comprehensive."
        }
    },
];

const UseCaseButton = ({
    title,
    icon,
    isSelected,
    onClick,
    index
}: {
    title: string;
    icon: string;
    isSelected: boolean;
    onClick: () => void;
    index: number;
}) => {
    return (
        <motion.button
            className={cn(
                "group relative p-5 w-full rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden",
                "hover:scale-[1.02] hover:shadow-xl",
                isSelected
                    ? "border-primary bg-gradient-to-br from-primary/20 to-primary/5 "
                    : "border-border border-white/10 bg-muted/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80"
            )}
            onClick={onClick}
            variants={buttonVariants}
            custom={index}
        >
            {/* Gradient overlay for selected state */}
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl" />
            )}

            <div className="relative flex items-center gap-4">
                <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                    isSelected
                        ? "bg-primary/20 shadow-lg"
                        : "bg-muted/50 group-hover:bg-primary/10"
                )}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        "font-bold text-base leading-tight transition-colors duration-300 tracking-tight",
                        isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}>
                        {title}
                    </h3>
                </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
                <motion.div
                    className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            )}
        </motion.button>
    );
};

const DetailCard = ({ useCase }: { useCase: typeof useCases[0] }) => {
    return (
        <motion.div
            className=" border border-border rounded-3xl p-8 shadow-2xl shadow-black/10 max-w-7xl mx-auto backdrop-blur-sm border-white/10 bg-muted/30 backdrop-blur-sm shadow-2xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
        >
            {/* Header */}
            <div className="flex items-start gap-6 mb-8 pb-6 border-b border-border/50">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
                    <span className="text-4xl">{useCase.icon}</span>
                </div>
                <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {useCase.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{useCase.description}</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Graph Use */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded bg-blue-500/60" />
                        </div>
                        <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Graph Use</h4>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30">
                        <p className="text-muted-foreground leading-relaxed">{useCase.helixBest.graphUse}</p>
                    </div>
                </div>

                {/* Vector Use */}
                <div className="space-y-4 ">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded bg-purple-500/60" />
                        </div>
                        <h4 className="text-xl font-semibold text-purple-600 dark:text-purple-400">Vector Use</h4>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 rounded-2xl p-6 border border-purple-200/30 dark:border-purple-800/30">
                        <p className="text-muted-foreground leading-relaxed">{useCase.helixBest.vectorUse}</p>
                    </div>
                </div>
            </div>

            {/* Why Helix */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded bg-primary/80" />
                    </div>
                    <h4 className="text-xl font-semibold text-primary">Why Helix</h4>
                </div>
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 relative overflow-hidden">

                    <p className="text-foreground leading-relaxed font-medium">{useCase.helixBest.whyHelix}</p>
                </div>
            </div>
        </motion.div>
    );
};

const UseCases = () => {
    const [selectedUseCase, setSelectedUseCase] = useState<number>(0);
    const [showAll, setShowAll] = useState<boolean>(false);

    const hasMoreItems = useCases.length > 6;

    return (
        <section className="min-h-[1080px] relative py-24 ">

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2
                        className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
                        variants={headerVariants}
                    >
                        Use Cases
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground leading-relaxed"
                        variants={headerVariants}
                    >
                        Discover how Helix's hybrid graph-vector architecture transforms complex data challenges across industries
                    </motion.p>
                </motion.div>

                <div
                    className="flex w-full flex-col items-center justify-center px-4 max-w-7xl mx-auto"
                >
                    {/* Grid of Use Case Buttons */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-16"
                    >
                        {/* Show 3 items on xs screens */}
                        <div className="contents sm:hidden">
                            {(showAll ? useCases : useCases.slice(0, 3)).map((useCase, index) => (
                                <motion.div
                                    key={useCase.title}
                                    variants={buttonVariants}
                                    custom={index}
                                >
                                    <UseCaseButton
                                        title={useCase.title}
                                        icon={useCase.icon}
                                        isSelected={selectedUseCase === index}
                                        onClick={() => setSelectedUseCase(index)}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Show 6 items on sm screens */}
                        <div className="contents hidden sm:contents lg:hidden">
                            {(showAll ? useCases : useCases.slice(0, 6)).map((useCase, index) => (
                                <motion.div
                                    key={useCase.title}
                                    variants={buttonVariants}
                                    custom={index}
                                >
                                    <UseCaseButton
                                        title={useCase.title}
                                        icon={useCase.icon}
                                        isSelected={selectedUseCase === index}
                                        onClick={() => setSelectedUseCase(index)}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Show all items on large screens and above */}
                        <div className="contents hidden lg:contents">
                            {useCases.map((useCase, index) => (
                                <motion.div
                                    key={useCase.title}
                                    variants={buttonVariants}
                                    custom={index}
                                >
                                    <UseCaseButton
                                        title={useCase.title}
                                        icon={useCase.icon}
                                        isSelected={selectedUseCase === index}
                                        onClick={() => setSelectedUseCase(index)}
                                        index={index}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* See More Button - Only show on smaller screens when there are more items */}
                    {hasMoreItems && !showAll && (
                        <motion.div
                            className="flex justify-center mb-16 lg:hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                onClick={() => setShowAll(true)}
                                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary font-semibold hover:from-primary/20 hover:to-primary/10 hover:border-primary/30 transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>See More Use Cases</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Detailed Card */}
                    <DetailCard useCase={useCases[selectedUseCase]} />
                </div>
            </div>
        </section>
    );
};

export default UseCases; 