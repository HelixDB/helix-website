"use client";
import React, { useEffect, useState } from "react";
import { executeQuery } from "./api";

const CodeEditor = () => {
  const [schemaCode, setSchemaCode] = useState(
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

  const initialQueries: Record<string, string> = {
    addUsers: `QUERY addUsers() =>
	user1 <- AddV<User>({Name: "Alice", Age: 30})
	user2 <- AddV<User>({Name: "Bob", Age: 25})
	AddE<Follows>(user1, user2, {Since: 1.0})
	RETURN user1, user2`,
    getFollowers: `QUERY getFollowers() =>
	followers <- V<User>({Name:"Bob"})::In<Follows>
	RETURN followers`,
    getFollows: `QUERY getFollows() =>
	user <- V<User>({Name: "Alice"})
 	follows <- user::Out<Follows>
	RETURN user, follows`,
  };

  const [queries, setQueries] = useState(initialQueries);
  const [output, setOutput] = useState("// Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (queryName: string, value: string) => {
    setQueries((prev) => ({
      ...prev,
      [queryName]: value,
    }));
  };

  const handleRun = async (queryName: string) => {
    setIsLoading(true);
    try {
      const result = await executeQuery(queryName, queries[queryName]);
      const newOutput = `[${new Date().toLocaleTimeString()}] Running ${queryName}...\n\nResult:\n${JSON.stringify(result, null, 2)}\n\n`;
      setOutput(prev => prev + "\n" + newOutput);
    } catch (err: any) {
      const errorOutput = `[${new Date().toLocaleTimeString()}] Error running ${queryName}: ${err.message}\n\n`;
      setOutput(prev => prev + "\n" + errorOutput);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div
          className="grid grid-cols-4 gap-4 mb-4"
          style={{ minHeight: "calc(60vh - 2rem)" }}
        >
          {/* Schema Editor - Takes up 1/4 of the width */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center py-2">
              <h2 className="text-gray-200 font-mono">schema.hx</h2>
            </div>
            <textarea
              value={schemaCode}
              onChange={(e) => setSchemaCode(e.target.value)}
              className="flex-grow bg-gray-700 text-gray-100 p-4 rounded font-mono
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Queries Section - Takes up 3/4 of the width */}
          <div className="col-span-3 space-y-4">
            {Object.entries(queries).map(([queryName, queryContent]) => (
              <div key={queryName} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-gray-200 font-mono">{`${queryName}.hx`}</h2>
                  <button
                    onClick={() => handleRun(queryName)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded
                      font-mono transition-colors duration-200"
                  >
                    Run
                  </button>
                </div>
                <textarea
                  value={queryContent}
                  onChange={(e) => handleQueryChange(queryName, e.target.value)}
                  className="w-full h-48 bg-gray-700 text-gray-100 p-4 rounded font-mono
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Unified Output Terminal */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-gray-200 font-mono">Output Terminal</h2>
          </div>
          <pre
            className="w-full h-64 bg-gray-700 text-gray-100 p-4 rounded font-mono
            overflow-auto whitespace-pre-wrap"
          >
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
