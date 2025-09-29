import React from "react";
import { motion } from "framer-motion";
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from "next-themes";
import { Zap, Shield, Brain, DollarSign, CheckCircle, ArrowRight } from "lucide-react";

const featureCards = [
    {
        title: "Hybrid Query Traversals",
        icon: <Brain className="w-8 h-8 text-primary" />,
        description: "Seamlessly combine vector similarity search with graph traversals in a single, powerful query. No more complex joins or multiple database calls.",
        code: `QUERY findSimilarFriends(userID: String, queryVec: Vector) =>
      similar <- V<User>::VectorSearch(queryVec, topK: 5)
      friends <- similar::Out<Friends>
      RETURN friends::{ ID, name, similarityScore }`,
        codeLang: "typescript",
        benefits: [
            "Single query for complex operations",
            "Native vector + graph integration",
            "Intuitive syntax design"
        ]
    },
    {
        title: "Type-Safety",
        icon: <Shield className="w-8 h-8 text-primary" />,
        description: "Advanced static analysis provides real-time feedback, autocomplete, and error detection. Write queries with confidence.",
        code: `// ❌ Compile-time error detection
user_nodes <- N<User>(node_id)::Out<Know>
// Error: 'Know' is not a valid edge type

old_users <- user_nodes::WHERE(_::{ag}:EQ("60"))
// Error: 'ag' is not a field of node 'User'

// ✅ Intelligent autocomplete  
user_nodes::WHERE(_::{<Ctrl+Space>}
// Suggestions: id, name, age, email, createdAt...`,
        codeLang: "typescript",

    },
    {
        title: "High Speeds",
        icon: <Zap className="w-8 h-8 text-primary" />,
        description: "Optimized for both vector similarity and graph traversal workloads with industry-leading performance metrics.",

    },
    {
        title: "Lower Costs",
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        description: "Eliminate the complexity and cost of maintaining separate vector and graph databases. One unified solution.",
    }
];

// Clean SVG Graph Component
const GraphVisualization = () => {
    return (
        <div className="flex flex-col justify-center w-full h-full p-4 min-w-[300px]">
            <svg width="100%" height="100%" viewBox="0 0 320 240" className="overflow-visible  min-h-[200px]">
                {/* Grey edges - structured network connections */}
                <line x1="60" y1="60" x2="120" y2="80" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="60" y1="60" x2="80" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="60" y1="60" x2="40" y2="100" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="120" y1="80" x2="180" y2="60" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="120" y1="80" x2="140" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="120" y1="80" x2="100" y2="140" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="120" y1="80" x2="160" y2="40" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="80" y1="120" x2="140" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="80" y1="120" x2="100" y2="140" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="80" y1="120" x2="60" y2="180" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="80" y1="120" x2="40" y2="100" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="140" y1="120" x2="180" y2="60" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="140" y1="120" x2="200" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="140" y1="120" x2="160" y2="160" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="140" y1="120" x2="120" y2="200" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="100" y1="140" x2="160" y2="160" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="100" y1="140" x2="60" y2="180" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="100" y1="140" x2="120" y2="200" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="180" y1="60" x2="240" y2="80" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="180" y1="60" x2="200" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="180" y1="60" x2="160" y2="40" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="180" y1="60" x2="220" y2="40" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="200" y1="120" x2="240" y2="80" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="200" y1="120" x2="260" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="200" y1="120" x2="220" y2="160" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="200" y1="120" x2="280" y2="100" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="160" y1="160" x2="220" y2="160" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="160" y1="160" x2="180" y2="200" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="240" y1="80" x2="260" y2="120" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="240" y1="80" x2="280" y2="100" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="240" y1="80" x2="220" y2="40" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="260" y1="120" x2="220" y2="160" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="260" y1="120" x2="280" y2="100" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="260" y1="120" x2="300" y2="140" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="220" y1="160" x2="180" y2="200" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="220" y1="160" x2="260" y2="180" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="40" y1="100" x2="20" y2="140" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="60" y1="180" x2="120" y2="200" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="60" y1="180" x2="20" y2="140" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="120" y1="200" x2="180" y2="200" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="180" y1="200" x2="260" y2="180" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="280" y1="100" x2="300" y2="140" stroke="#374151" strokeWidth="2" opacity="0.4" />
                <line x1="300" y1="140" x2="260" y2="180" stroke="#374151" strokeWidth="2" opacity="0.4" />

                {/* Animated edges - highlighted during animation */}
                {/* First vector (60,60) to all its neighbors */}
                <line x1="60" y1="60" x2="120" y2="80" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;1;1;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </line>
                <line x1="60" y1="60" x2="80" y2="120" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;1;1;0;0;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </line>
                <line x1="60" y1="60" x2="40" y2="100" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;1;1;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </line>

                {/* Second vector (100,140) to all its neighbors */}
                <line x1="100" y1="140" x2="140" y2="120" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;1;1;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </line>
                <line x1="100" y1="140" x2="160" y2="160" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;1;1;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </line>
                <line x1="100" y1="140" x2="60" y2="180" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;1;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </line>

                {/* Third vector (180,60) to all its neighbors */}
                <line x1="180" y1="60" x2="200" y2="120" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;1;0" dur="20s" repeatCount="indefinite" />
                </line>
                <line x1="180" y1="60" x2="240" y2="80" stroke="#FF6A00" strokeWidth="3" opacity="0">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1" dur="20s" repeatCount="indefinite" />
                </line>

                {/* Grey squares (vectors) - positioned as part of network */}
                <rect x="166" y="46" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="206" y="146" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="46" y="166" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="146" y="26" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="206" y="26" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="26" y="86" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="106" y="186" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="166" y="186" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="246" y="166" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="286" y="126" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="6" y="126" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />

                {/* Static grey squares that will be animated */}
                <rect x="46" y="46" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="86" y="126" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />
                <rect x="166" y="46" width="28" height="28" fill="#374151" rx="4" opacity="0.4" />

                {/* Animated vector squares - cycle through different ones */}
                <rect x="46" y="46" width="28" height="28" fill="#FF6A00" rx="4" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-lg">
                    <animate attributeName="opacity" values="0;1;1;1;1;1;1;1;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </rect>
                <rect x="86" y="126" width="28" height="28" fill="#FF6A00" rx="4" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-lg">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;1;1;1;1;1;1;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </rect>
                <rect x="166" y="46" width="28" height="28" fill="#FF6A00" rx="4" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-lg">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;1;1" dur="20s" repeatCount="indefinite" />
                </rect>

                {/* Grey circles (nodes) - positioned as part of network */}
                <circle cx="100" cy="140" r="11" fill="#374151" opacity="0.4" />
                <circle cx="280" cy="100" r="11" fill="#374151" opacity="0.4" />
                <circle cx="120" cy="200" r="11" fill="#374151" opacity="0.4" />
                <circle cx="180" cy="200" r="11" fill="#374151" opacity="0.4" />
                <circle cx="260" cy="180" r="11" fill="#374151" opacity="0.4" />
                <circle cx="300" cy="140" r="11" fill="#374151" opacity="0.4" />
                <circle cx="20" cy="140" r="11" fill="#374151" opacity="0.4" />
                <circle cx="80" cy="40" r="11" fill="#374151" opacity="0.4" />
                <circle cx="300" cy="60" r="11" fill="#374151" opacity="0.4" />
                <circle cx="20" cy="60" r="11" fill="#374151" opacity="0.4" />
                <circle cx="160" cy="220" r="11" fill="#374151" opacity="0.4" />
                <circle cx="260" cy="120" r="11" fill="#374151" opacity="0.4" />

                {/* Static grey circles that will be animated */}
                <circle cx="120" cy="80" r="11" fill="#374151" opacity="0.4" />
                <circle cx="80" cy="120" r="11" fill="#374151" opacity="0.4" />
                <circle cx="40" cy="100" r="11" fill="#374151" opacity="0.4" />
                <circle cx="140" cy="120" r="11" fill="#374151" opacity="0.4" />
                <circle cx="160" cy="160" r="11" fill="#374151" opacity="0.4" />
                <circle cx="60" cy="180" r="11" fill="#374151" opacity="0.4" />
                <circle cx="200" cy="120" r="11" fill="#374151" opacity="0.4" />
                <circle cx="240" cy="80" r="11" fill="#374151" opacity="0.4" />

                {/* Animated circles - first vector's neighbors */}
                <circle cx="120" cy="80" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;1;1;1;1;1;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="80" cy="120" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;1;1;1;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="40" cy="100" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;1;0;0;0;0;0;0;0;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </circle>

                {/* Animated circles - second vector's neighbors */}
                <circle cx="140" cy="120" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;1;1;1;1;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="160" cy="160" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;1;1;0;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="180" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;0;0;0;0" dur="20s" repeatCount="indefinite" />
                </circle>

                {/* Animated circles - third vector's neighbors */}
                <circle cx="200" cy="120" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;0" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="240" cy="80" r="11" fill="#FF6A00" opacity="0" stroke="#FDE68A" strokeWidth="2" className="drop-shadow-md">
                    <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1" dur="20s" repeatCount="indefinite" />
                </circle>
            </svg>

            {/* Labels */}

        </div>
    );
};

export function ComparisonSection() {
    const { theme } = useTheme();
    const codeTheme = theme === 'light' ? themes.github : themes.nightOwl;

    return (
        <motion.div
            variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
            }}
            className="min-h-[1080px] flex items-center relative py-24 bg-background"
        >
            <div className=" relative mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl px-4 sm:px-8 mx-auto grid-flow-dense">
                    {/* Hybrid Query Traversals - spans two columns on top row */}
                    <motion.div
                        className="p-4 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row min-h-[380px] col-span-1 md:col-span-2 group overflow-hidden"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex flex-col gap-6 w-full sm:w-2/3 lg:w-1/2 sm:pr-6 z-[1000] drop-shadow-xl">
                            <div className="flex items-center gap-4 sm:mb-6">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    {featureCards[0].icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-1">{featureCards[0].title}</h3>
                                </div>
                            </div>
                            {/* Left side - Code with custom highlighting */}
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="relative ">
                                    <p className="text-muted-foreground mb-4 text-base leading-relaxed sm:pr-0 pr-24 z-[1000]">{featureCards[0].description}</p>
                                    {/* Mobile graph positioned to the right of paragraph */}
                                    <div className="absolute top-0 -right-8 w-64 h-48 sm:hidden overflow-visible z-[-100] ">
                                        <div className="scale-90 origin-top-left">
                                            <GraphVisualization />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-background/90 border border-white/20 rounded-lg p-3 overflow-hidden z-[1000]">
                                    <pre className="text-xs font-mono leading-relaxed">
                                        <div className="text-cyan-400">QUERY <span className="text-emerald-400">findSimilarFriends</span><span className="text-slate-200">(userID: String, queryVec: Vector) =&gt;</span></div>
                                        <div className="mt-2">
                                            <span className="text-slate-200">similar &lt;- </span>
                                            <span className="bg-yellow-500/30 text-yellow-100 px-2 py-1 rounded">SearchV</span>
                                            <span className="text-slate-200">(queryVec, topK: 5)</span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-slate-200">friends &lt;- </span>
                                            <span className="bg-orange-500/30 text-orange-100 px-2 py-1 rounded">similar::Out&lt;Friends&gt;</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-cyan-400">RETURN</span>
                                            <span className="text-slate-200"> friends::&#123; ID, name, similarityScore &#125;</span>
                                        </div>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="w-full sm:w-1/3 lg:w-1/2 flex-col z-[0] items-center justify-center sm:pl-4 mt-6 sm:mt-0 hidden sm:flex">
                            <GraphVisualization />
                            <div className="flex  w-full mt-2 sm:flex-row flex-col space-x-4 hidden sm:flex">
                                <div className="flex items-center gap-2 flex-row">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span className="text-yellow-100 text-xs font-semibold">Vector Entry</span>
                                </div>
                                <div className="flex items-center gap-2 flex-row">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                    <span className="text-orange-100 text-xs font-semibold">Connected Node</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Type-Safety - spans two rows on the right */}
                    <motion.div
                        className="px-4 pt-4 sm:p-8 rounded-2xl border shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl flex flex-col min-h-[380px] md:row-span-2 lg:col-start-3 md:col-span-1 group"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                {featureCards[1].icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">{featureCards[1].title}</h3>

                            </div>
                        </div>

                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featureCards[1].description}</p>

                        <div className="flex-1 flex flex-col ">
                            {featureCards[1].code && featureCards[1].codeLang && (
                                <div className="flex flex-col overflow-hidden bg-black rounded-xl border border-foreground/30 shadow-[0_0_30px_rgba(255,0,0,0.1)] mb-6 w-[700px]">
                                    <p className="text-md text-foreground/90 px-4 py-2">Type Checker</p>
                                    <pre className="bg-zinc-900 flex flex-row p-4 text-sm font-mono overflow-x-auto">
                                        <code className="pr-4 select-none">
                                            {`> `}
                                        </code>
                                        <code className="text-red-400">
                                            {`helix check
❌ Checking Helix queries
error: 'Know' is not a valid edge type (in QUERY named 'get_user*)
      |--queries.hx: 16:38
16    |   user_nodes <- N<User> (node_1d):: 0ut<Know>
---> help: check the schema for valid edge types
...
`}
                                        </code>
                                    </pre>
                                </div>
                            )}

                            {/* Success deployment output */}
                            <div className="flex flex-col overflow-hidden bg-black rounded-xl border border-foreground/30 shadow-[0_0_30px_rgba(0,255,0,0.1)] w-3/2 self-end hidden md:block">
                                <p className="text-md text-foreground/90 px-4 py-2">Deploy</p>
                                <pre className="bg-zinc-900 flex flex-row p-4 text-sm font-mono overflow-x-auto">
                                    <code className="pr-4 select-none">
                                        {`> `}
                                    </code>
                                    <code className="text-green-400">
                                        {`helix deploy --local --path helixdb-cfg
✓ Compiling Helix queriesNodes(Some("User"))
Successfully compiled 2 query files
Successfully transpiled queries
Successfully wrote queries file
Successfully built Helix
Successfully started Helix instance
└── Instance ID: aafd3dc7-21cb-4073-b330-aec71e48b623
└── Port: 6969
└── Available endpoints:
    └── /get_user`}
                                    </code>
                                </pre>
                            </div>


                        </div>
                    </motion.div>

                    {/* Lower Costs - bottom left */}
                    <motion.div
                        className="p-4 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl flex flex-col min-h-[380px] group"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                {featureCards[3].icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">{featureCards[3].title}</h3>
                            </div>
                        </div>

                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featureCards[3].description}</p>

                        <div className="flex-1 flex flex-col justify-between">
                            {/* Cost Savings Visualization */}
                            <div className="space-y-6 my-auto">
                                <div className="grid grid-cols-3 gap-4 items-stretch">
                                    {/* One Database */}
                                    <div className="relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/5 rounded-xl blur-lg scale-105 -z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-emerald-500/20 aspect-square flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-emerald-500/40 h-full min-h-[80px]">
                                            <div className="text-2xl font-bold text-emerald-400 mb-2">1</div>
                                            <div className="text-xs text-emerald-300 leading-tight">Database</div>
                                        </div>
                                    </div>

                                    {/* One Cloud */}
                                    <div className="relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-blue-500/5 rounded-xl blur-lg scale-105 -z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-blue-500/20 aspect-square flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-blue-500/40 h-full min-h-[80px]">
                                            <div className="text-2xl font-bold text-blue-400 mb-2">1</div>
                                            <div className="text-xs text-blue-300 leading-tight">Cloud</div>
                                        </div>
                                    </div>

                                    {/* 50% Less Data */}
                                    <div className="relative group h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-purple-500/5 rounded-xl blur-lg scale-105 -z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-purple-500/20 aspect-square flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-purple-500/40 h-full min-h-[80px]">
                                            <div className="text-2xl font-bold text-purple-400 mb-2">50%</div>
                                            <div className="text-xs text-purple-300 leading-tight">Less Data</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* High Speeds - bottom center */}
                    <motion.div
                        className="p-4 sm:p-8 rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl flex shadow-[0_0_30px_rgba(0,0,0,0.5)] flex-col min-h-[380px] lg:col-start-2 group"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                {featureCards[2].icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">{featureCards[2].title}</h3>
                            </div>
                        </div>

                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featureCards[2].description}</p>

                        <div className="flex-1 flex flex-col justify-between">
                            {/* Speed Visualization */}
                            <div className="space-y-4 ">


                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/5 rounded-xl blur-lg scale-105 -z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-emerald-500/20 aspect-square flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-emerald-500/40">
                                            <div className="text-lg font-bold text-emerald-400 mb-2">~2ms</div>
                                            <div className="text-xs text-muted-foreground leading-tight">Vector Similarity Search</div>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-cyan-500/5 rounded-xl blur-lg scale-105 -z-10 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-cyan-500/20 aspect-square flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-cyan-500/40">
                                            <div className="text-lg font-bold text-cyan-400 mb-2">Sub 1ms</div>
                                            <div className="text-xs text-muted-foreground leading-tight">Graph Traversals</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
} 