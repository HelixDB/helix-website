"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import API from "@/app/api";
import { PlayIcon } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Edge, Node } from "@/components/ui/graph-visualizer";

const GraphVisualizer = dynamic(
    () => import("./graph-visualizer").then((module) => module.default),
    { ssr: false }
);

type QueryFiles = "users.hx" | "followers.hx" | "follows.hx";

interface SandboxProps {
    initialSchema?: string;
    initialQueries?: Record<QueryFiles, string>;
    className?: string;
}

export function Sandbox({
    initialSchema = `V::User {
  Name: String,
  Age: Integer
}

E::Follows {
  From: User,
  To: User,
  Properties {
    Since: Float
  }
}`,
    initialQueries = {
        "users.hx": `QUERY addUsers() =>
  user1 <- AddV<User>({Name: "Alice", Age: 30})
  user2 <- AddV<User>({Name: "Bob", Age: 25})
  AddE<Follows>()::From(user1)::To(user2)
  RETURN user1, user2`,
        "followers.hx": `QUERY getFollowers() =>
  followers <- V<User>()::In<Follows>
  RETURN followers`,
        "follows.hx": `QUERY getFollows() =>
  user <- V<User>()::WHERE(_::Props(Age)::GT(26))
  follows <- user::Out<Follows>
  RETURN user, follows`,
    },
    className = "",
}: SandboxProps) {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === "system" ? systemTheme : theme;
    const [mounted, setMounted] = useState(false);
    const [schema, setSchema] = useState(initialSchema);
    const [activeQuery, setActiveQuery] = useState<QueryFiles>("users.hx");
    const [query, setQuery] = useState(initialQueries[activeQuery]);
    const [output, setOutput] = useState("// Output will appear here...");
    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState<"terminal" | "graph">("terminal");
    const [graphData, setGraphData] = useState<{
        nodes: Array<Node>;
        edges: Array<Edge>;
    }>();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleQueryChange = (value: string) => {
        setQuery(value);
    };

    const handleTabClick = (tab: string) => {
        if (tab in initialQueries) {
            setActiveQuery(tab as QueryFiles);
            setQuery(initialQueries[tab as QueryFiles]);
        }
    };

    const handleRun = async () => {
        setIsLoading(true);
        try {
            const result = await API.executeQuery(activeQuery, query, schema);
            const query_res = result.result;
            const new_graph_data = result.newGraphData;

            const newOutput = `[${new Date().toLocaleTimeString()}] Running ${activeQuery}...\n\nResult:\n${JSON.stringify(
                query_res,
                null,
                2
            )}\n\n`;
            setOutput((prev) => prev + "\n" + newOutput);

            if (new_graph_data && typeof new_graph_data === "object") {
                const nodes: Array<Node> = [];
                const edges: Array<Edge> = [];

                let links = new_graph_data.links;
                let g_nodes = new_graph_data.nodes;

                Object.entries(links).forEach(([_, value]) => {
                    if (value) {
                        let edge: Edge = {
                            id: String(value.id),
                            source: String(value.from_node),
                            target: String(value.to_node),
                            label: value.label,
                        };

                        if (value.properties) {
                            Object.entries(value.properties).forEach(([propKey, propValue]) => {
                                edge[propKey] = propValue;
                            });
                        }

                        edges.push(edge);
                    }
                });

                Object.entries(g_nodes).forEach(([_, value]) => {
                    if (value) {
                        let node: Node = {
                            id: String(value.id),
                            label: value.label || "",
                        };

                        if (value.properties) {
                            Object.entries(value.properties).forEach(([propKey, propValue]) => {
                                node[propKey] = propValue;
                            });
                        }

                        nodes.push(node);
                    }
                });

                setGraphData({ nodes, edges });
            }
        } catch (err: any) {
            const errorOutput = `[${new Date().toLocaleTimeString()}] Error running query: ${err.message}\n\n`;
            setOutput((prev) => prev + "\n" + errorOutput);
        } finally {
            setIsLoading(false);
        }
    };

    const bgColor = currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

    return (
        <div className={className}>
            <div className="">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-muted/50">
                            <button className="px-3 py-2 text-sm font-medium border-r relative text-foreground bg-background mb-[2px]">
                                schema.hx
                            </button>
                        </div>
                        <div
                            className=""
                            style={{
                                background: bgColor,
                            }}
                        >
                            <CodeEditor
                                isEditable={false}
                                value={schema}
                                onChange={(e) => setSchema(e.target.value)}
                                placeholder="Enter your schema here..."
                                style={{ resize: "none", background: "transparent" }}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-muted/50">
                            <div className="flex">
                                {Object.keys(initialQueries).map((filename) => (
                                    <button
                                        key={filename}
                                        onClick={() => handleTabClick(filename)}
                                        className={`px-3 py-2 text-sm font-medium border-r relative ${activeQuery === filename
                                            ? "text-foreground bg-background mb-[2px]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                            }`}
                                    >
                                        {filename}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div
                            className=""
                            style={{
                                background: bgColor,
                            }}
                        >
                            <CodeEditor
                                value={query}
                                onChange={(e) => handleQueryChange(e.target.value)}
                                placeholder="Enter your query here..."
                                style={{ resize: "none", background: "transparent" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center gap-2 my-4 py-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveView("terminal")}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${activeView === "terminal"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <svg
                            className="-ms-0.5 me-1.5 opacity-60"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="4 17 10 11 4 5"></polyline>
                            <line x1="12" y1="19" x2="20" y2="19"></line>
                        </svg>
                        Terminal
                    </button>
                    <button
                        onClick={() => setActiveView("graph")}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${activeView === "graph"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <svg
                            className="-ms-0.5 me-1.5 opacity-60"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Graph
                    </button>
                </div>
                <Button onClick={handleRun} disabled={isLoading} className="gap-2">
                    <PlayIcon className="w-4 h-4" />
                    Run Query
                </Button>
            </div>

            <div className="space-y-4">
                <div
                    className="rounded-lg overflow-hidden shadow-lg"
                    style={{
                        background: bgColor,
                    }}
                >
                    <div className="px-3 py-2 text-sm font-medium bg-muted/50">
                        output.log
                    </div>

                    {activeView === "terminal" ? (
                        <pre className="p-4 font-mono text-sm overflow-auto h-[500px]">
                            {output}
                        </pre>
                    ) : (
                        <div className="h-[500px] w-full">
                            <GraphVisualizer
                                data={{
                                    nodes: graphData?.nodes || [],
                                    links: graphData?.edges || [],
                                }}
                                currentTheme={currentTheme}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 