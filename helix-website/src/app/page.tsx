"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { executeQuery } from "./api";
import { PlayIcon, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import Image from "next/image";
import { WavyBackground } from "@/components/ui/wavy-background";
import ForceGraph2D from "react-force-graph-2d";
import { GraphVisualizer } from "@/components/ui/graph-visualizer";

type QueryFiles = "users.hx" | "followers.hx" | "follows.hx";

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
  const [schema, setSchema] = useState(`V::User {
  Name: String,
  Age: Integer
}

E::Follows {
  From: User,
  To: User,
  Properties {
    Since: Float
  }
}`);

  const queries: Record<QueryFiles, string> = {
    "users.hx": `QUERY addUsers() =>
  user1 <- AddV<User>({Name: "Alice", Age: 30})
  user2 <- AddV<User>({Name: "Bob", Age: 25})
  AddE<Follows>(user1, user2, {Since: 1.0})
  RETURN user1, user2`,
    "followers.hx": `QUERY getFollowers() =>
  followers <- V<User>({Name:"Bob"})::In<Follows>
  RETURN followers`,
    "follows.hx": `QUERY getFollows() =>
  user <- V<User>({Name: "Alice"})
  follows <- user::Out<Follows>
  RETURN user, follows`,
  };

  const sampleGraphData = {
    nodes: [
      { id: "1", name: "Alice", val: 1 },
      { id: "2", name: "Bob", val: 1 },
      { id: "3", name: "Charlie", val: 1 },
      { id: "4", name: "David", val: 1 },
      { id: "5", name: "Eve", val: 1 }
    ],
    links: [
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "4" },
      { source: "4", target: "5" },
      { source: "5", target: "1" },
      { source: "1", target: "3" }
    ]
  };
  const [activeQuery, setActiveQuery] = useState<QueryFiles>("users.hx");
  const [query, setQuery] = useState(queries[activeQuery]);
  const [output, setOutput] = useState("// Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"terminal" | "graph">("terminal");
  const [graphData, setGraphData] = useState<{
    nodes: Array<{ id: string; name: string; val: number }>;
    links: Array<{ source: string; target: string }>;
  }>(sampleGraphData);
  const [graphWidth, setGraphWidth] = useState(800);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateGraphWidth = () => {
      if (graphContainerRef.current) {
        setGraphWidth(graphContainerRef.current.offsetWidth);
      }
    };

    updateGraphWidth();
    window.addEventListener('resize', updateGraphWidth);
    return () => window.removeEventListener('resize', updateGraphWidth);
  }, []);


  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleTabClick = (tab: string) => {
    if (tab in queries) {
      setActiveQuery(tab as QueryFiles);
      setQuery(queries[tab as QueryFiles]);
    }
  };

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
            const node = {
              id: String(value.id),
              name: String('Name' in value ? value.Name : value.id),
              val: 1
            };
            nodes.push(node);
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

  const loadSampleData = () => {
    setGraphData(sampleGraphData);
  };

  return (
    <main className="justify-center">
      <WavyBackground className="min-h-screen w-full" backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}>
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          <div className="flex items-center w-full justify-between mb-6">
            <Logo />
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
                onClick={() => { setActiveView("graph"); loadSampleData() }}
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
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="icon" asChild>
                <a href="https://github.com/HelixDB/helix-db" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 text-neutral-500" />
                </a>
              </Button>
            </div>
          </div>

          {activeView === "terminal" ? (
            <div className="mx-auto">
              <div className="w-full">
                <div className="grid md:grid-cols-2 gap-6">

                  <div className="">
                    <div className="border border-b-0 bg-muted/50">
                      <button className="px-3 py-2 text-sm font-medium border-r relative text-foreground bg-background mb-[2px]">
                        schema.hx
                      </button>
                    </div>
                    <div className="border" style={{ background: currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)" }}>
                      <CodeEditor
                        value={schema}
                        onChange={(e) => setSchema(e.target.value)}
                        placeholder="Enter your schema here..."
                        style={{ resize: 'none', background: 'transparent' }}
                      />
                    </div>
                  </div>

                  <div className="">
                    <div className="border border-b-0 bg-muted/50">
                      <div className="flex">
                        {Object.keys(queries).map((filename) => (
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
                    <div className="border" style={{ background: currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)" }}>
                      <CodeEditor
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        placeholder="Enter your query here..."
                        style={{ resize: 'none', background: 'transparent' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-2 my-4">


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

                <div className="border rounded-none overflow-hidden " style={{ background: currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)" }}>
                  <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                    output.log
                  </div>
                  <pre className="p-4 font-mono text-sm overflow-auto">
                    {output}
                  </pre>
                </div>

              </div>
            </div>) : (
            <div className="border rounded-none overflow-hidden bg-background/50 ">
              <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                Graph Visualization
              </div>
              <div>
                <ForceGraph2D
                  graphData={graphData}
                  nodeLabel="name"
                  nodeColor="#3b82f6"
                  linkColor="red"
                  backgroundColor={currentTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)"}
                  height={600}
                />
              </div>
            </div>
          )}
        </div>
      </WavyBackground>
    </main>
  );
}
