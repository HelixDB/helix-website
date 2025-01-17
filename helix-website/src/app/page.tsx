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

  const queries = {
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

  const [activeQuery, setActiveQuery] = useState("users.hx");
  const [query, setQuery] = useState(queries[activeQuery]);
  const [output, setOutput] = useState("// Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleTabClick = (tab: string) => {
    setActiveQuery(tab);
    setQuery(queries[tab]);
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
    } catch (err: any) {
      const errorOutput = `[${new Date().toLocaleTimeString()}] Error running query: ${err.message}\n\n`;
      setOutput((prev) => prev + "\n" + errorOutput);
    } finally {
      setIsLoading(false);
    }
  };

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

                <div>
                  <div className="border border-b-0">
                    <div className="px-3 py-2 text-sm font-medium bg-muted/50">
                      schema.hx
                    </div>
                  </div>
                  <CodeEditor
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    placeholder="Enter your schema here..."
                    style={{ resize: 'none' }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="">
                    <div className="border border-b-0 bg-muted/50">
                      <div className="flex ">
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
                    <CodeEditor
                      value={query}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      placeholder="Enter your query here..."
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-4">
              <Button
                onClick={handleRun}
                disabled={isLoading}
                className="gap-2 rounded-none "
              >
                <PlayIcon className="w-4 h-4" />
                Run Query
              </Button>
            </div>

            <div className="space-y-2">
              <div className="border rounded-none overflow-hidden bg-card">
                <div className="border-b px-3 py-2 text-sm font-medium bg-muted/50">
                  output.log
                </div>
                <pre className="p-4 font-mono text-sm overflow-auto min-h-[200px] max-h-[400px]">
                  {output}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </WavyBackground>
    </main>
  );
}
