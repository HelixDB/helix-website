"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { executeQuery } from "./api";
import { PlayIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
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
    <main className="min-h-screen p-4 sm:p-8 bg-background">
      <div className="flex mx-auto items-center justify-between mb-6 max-w-5xl">
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground">HelixDB Explorer</h1>
        <ThemeToggle />
      </div>

      <div className="max-w-5xl mx-auto">

        <div className="space-y-2">
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
                <div className="border border-b-0">
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
        <div className="flex justify-end">
          <Button
            onClick={handleRun}
            disabled={isLoading}
            className="gap-2 rounded-none "
          >
            <PlayIcon className="w-4 h-4" />
            Run Query
          </Button>
        </div>

        <div className="space-y-2 mt-6">
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
    </main >
  );
}
