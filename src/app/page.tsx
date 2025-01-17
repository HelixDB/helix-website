"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { executeQuery } from "./api";
import { PlayIcon, GithubIcon, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import Image from "next/image";
import { WavyBackground } from "@/components/ui/wavy-background";
import { GraphVisualizer } from "@/components/ui/graph-visualizer";

export function Logo() {
    const { theme } = useTheme()

    return (
        <div className="relative h-12 w-12">
            <Image
                src={theme === "dark" ? "/dark-helix.png" : "/light-helix.png"}
                alt="HelixDB Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}

export default function Home() {
    const { theme, systemTheme } = useTheme()

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const [schema, setSchema] = useState(
        `V::User {
  Name: String,
  Age: Integer
}

E::Follows {
  From: User,
  To: User,
  Properties {
    Since: Float
  }
}`
    );

    const [graphData, setGraphData] = useState<{
        nodes: Array<{ id: string; name: string; val: number }>;
        links: Array<{ source: string; target: string }>;
    }>({
        nodes: [],
        links: []
    });

    // ... existing code ...

    const handleRun = async () => {
        setIsLoading(true);
        try {
            const result = await executeQuery(activeQuery, query, schema);
            const newOutput = `[${new Date().toLocaleTimeString()}] Running ${activeQuery}...\n\nResult:\n${JSON.stringify(
                result,
                null,
                2
            )}\n\n`;
            setOutput((prev) => prev + "\n" + newOutput);

            // Update graph data if result contains nodes and edges
            if (result && typeof result === 'object') {
                const nodes: Array<{ id: string; name: string; val: number }> = [];
                const links: Array<{ source: string; target: string }> = [];

                // Extract nodes and edges from the result
                Object.entries(result).forEach(([key, value]) => {
                    if (value && typeof value === 'object' && 'id' in value) {
                        nodes.push({
                            id: String(value.id),
                            name: String(value.Name || value.id),
                            val: 1
                        });
                    }
                });

                // Add links if we have multiple nodes
                if (nodes.length >= 2) {
                    links.push({
                        source: nodes[0].id,
                        target: nodes[1].id
                    });
                }

                setGraphData({ nodes, links });
            }
        } catch (err: any) {
            const errorOutput = `[${new Date().toLocaleTimeString()}] Error running query: ${err.message}\n\n`;
            setOutput((prev) => prev + "\n" + errorOutput);
        } finally {
            setIsLoading(false);
        }
    };

    // ... existing code ...

    return (
        <main className="justify-center">
            <WavyBackground className="min-h-screen w-full" backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}>
                <div className="max-w-5xl mx-auto p-4 sm:p-8">
                    <div className="flex items-center w-full justify-between mb-6">
                        <Logo />
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button variant="outline" size="icon" asChild>
                                <a href="https://github.com/HelixDB/helix-db" target="_blank" rel="noopener noreferrer">
                                    <Github className="h-4 w-4 text-neutral-500" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto">
                        <div className="w-full">
                            <div className="grid md:grid-cols-2 gap-6">
                // ... existing code ...
                            </div>
                        </div>
                        <div className="flex justify-end my-4">
                            <Button
                                onClick={handleRun}
                                disabled={isLoading}
                                className="gap-2 rounded-none"
                            >
                                <PlayIcon className="w-4 h-4" />
                                Run Query
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-none overflow-hidden bg-card">
                                <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                                    output.log
                                </div>
                                <pre className="p-4 font-mono text-sm overflow-auto min-h-[200px] max-h-[400px]">
                                    {output}
                                </pre>
                            </div>

                            {graphData.nodes.length > 0 && (
                                <div className="border rounded-none overflow-hidden bg-card">
                                    <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                                        Graph Visualization
                                    </div>
                                    <div className="p-4">
                                        <GraphVisualizer data={graphData} className="w-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </WavyBackground>
        </main>
    );
}
