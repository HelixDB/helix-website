"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { executeQuery, init } from "./api";
import { PlayIcon, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "next-themes";
import Image from "next/image";
import { WavyBackground } from "@/components/ui/wavy-background";
import ForceGraph2D from "react-force-graph-2d";
import { v4 as uuidv4 } from "uuid";
import { Edge, GraphVisualizer, Node } from "@/components/ui/graph-visualizer";
type QueryFiles = "users.hx" | "followers.hx" | "follows.hx";

export function Logo() {
  const { theme } = useTheme();

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
  );
}

export default function Home() {
  const { theme, systemTheme } = useTheme();
  const id = useRef(uuidv4());
  const currentTheme = theme === "system" ? systemTheme : theme;
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
  AddE<Follows>()::From(user1)::To(user2)
  RETURN user1, user2`,
    "followers.hx": `QUERY getFollowers() =>
  followers <- V<User>({Name:"Bob"})::In<Follows>
  RETURN followers`,
    "follows.hx": `QUERY getFollows() =>
  user <- V<User>({Name: "Alice"})
  follows <- user::Out<Follows>
  RETURN user, follows`,
  };

  const [activeQuery, setActiveQuery] = useState<QueryFiles>("users.hx");
  const [query, setQuery] = useState(queries[activeQuery]);
  const [output, setOutput] = useState("// Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"terminal" | "graph">(
    "terminal"
  );
  const [graphData, setGraphData] = useState<{
    nodes: Array<Node>;
    edges: Array<Edge>;
  }>();
  const [graphWidth, setGraphWidth] = useState(800);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initHandler() {
      try {
        await init(id.current);
      } catch (err) {
        console.error("Error initializing handler:", err);
      }
    }

    initHandler();
  }, []);

  useEffect(() => {
    const updateGraphWidth = () => {
      if (graphContainerRef.current) {
        setGraphWidth(graphContainerRef.current.offsetWidth);
      }
    };

    updateGraphWidth();
    window.addEventListener("resize", updateGraphWidth);
    return () => window.removeEventListener("resize", updateGraphWidth);
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
      const result = await executeQuery(id.current, activeQuery, query, schema);
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

        Object.entries(links).forEach(([key, value]) => {
          if (value && typeof value === "object" && "from_node" in value) {
            let edge: Edge = {
              id: String(value.id),
              source: String(value.from_node),
              target: String(value.to_node),
              label: value.label,
            };

            if ("properties" in value) {
              Object.entries(value.properties).forEach(
                ([propKey, propValue]) => {
                  edge[propKey] = propValue;
                }
              );
            }

            edges.push(edge);
          } 
        });

        Object.entries(g_nodes).forEach(([key, value]) => {
          if (value && typeof value === "object" && "id" in value) {
            let node: Node = {
              id: String(value.id),
              label: value.label,
            };

            if ("properties" in value) {
              Object.entries(value.properties).forEach(
                ([propKey, propValue]) => {
                  node[propKey] = propValue;
                }
              );
            }

            nodes.push(node);
          }
        })

        console.log(nodes, edges);
        setGraphData({ nodes, edges });
      }
    } catch (err: any) {
      const errorOutput = `[${new Date().toLocaleTimeString()}] Error running query: ${
        err.message
      }\n\n`;
      setOutput((prev) => prev + "\n" + errorOutput);
    } finally {
      setIsLoading(false);
    }
  };

  // const loadSampleData = () => {
  //   setGraphData();
  // };

  return (
    <main className="justify-center">
      <WavyBackground
        className="min-h-screen w-full"
        backgroundFill={currentTheme === "dark" ? "#000000" : "#ffffff"}
      >
        <div
          style={{ maxWidth: "1280px" }}
          className="w-full mx-auto p-4 sm:p-8"
        >
          <div className="flex items-center w-full justify-between mb-6">
            <Logo />
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView("terminal")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                  activeView === "terminal"
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
                onClick={() => {
                  setActiveView("graph");
                  // loadSampleData();
                }}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                  activeView === "graph"
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
                <a
                  href="https://github.com/HelixDB/helix-db"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                    <div
                      className=""
                      style={{
                        background:
                          currentTheme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.5)",
                      }}
                    >
                      <CodeEditor
                        value={schema}
                        onChange={(e) => setSchema(e.target.value)}
                        placeholder="Enter your schema here..."
                        style={{ resize: "none", background: "transparent" }}
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
                            className={`px-3 py-2 text-sm font-medium border-r relative ${
                              activeQuery === filename
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
                        background:
                          currentTheme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.5)",
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
                <div
                  className="border rounded-none "
                  style={{
                    background:
                      currentTheme === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                    output.log
                  </div>
                  <pre className="p-4 font-mono text-sm overflow-auto max-h-[300px]">
                    {output}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-none overflow-hidden ">
              <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                Graph Visualization
              </div>
              <GraphVisualizer
                data={{
                  nodes: graphData?.nodes || [],
                  links: graphData?.edges || [],
                }}
                height={800}
                width={2048}
                currentTheme={currentTheme}
              />
            </div>
          )}
        </div>
      </WavyBackground>
    </main>
  );
}
