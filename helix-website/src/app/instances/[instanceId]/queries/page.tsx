"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Save, Trash, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import API from "@/app/api";
import { getCurrentUser } from "@/amplify-functions";
interface Query {
    id: string;
    name: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isPushed?: boolean;
}

export default function QueriesPage({ params }: { params: Promise<{ instanceId: string }> }) {
    const resolvedParams = use(params);
    const [userID, setUserID] = useState<string | null>(null);
    const [queries, setQueries] = useState<Query[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [editingName, setEditingName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isPushing, setIsPushing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            if (user) {
                setUserID(user.userId);
                try {
                    const fetchedQueries = await API.getQueries(user.userId, resolvedParams.instanceId);
                    // Transform the API response to match our Query interface
                    const transformedQueries: Query[] = fetchedQueries.map(query => ({
                        id: query.id,
                        name: query.id, // Using id as name since API doesn't provide name
                        content: query.content,
                        createdAt: new Date().toISOString(), // Default since API doesn't provide these
                        updatedAt: new Date().toISOString(),
                        isPushed: true // Queries from API are considered pushed
                    }));
                    setQueries(transformedQueries);
                } catch (error) {
                    console.error('Error fetching queries:', error);
                    // Initialize with empty array on error
                    setQueries([]);
                }
            }
        }
        fetchData();
    }, [resolvedParams.instanceId]);

    const handleCreateQuery = async () => {
        const query = {
            id: Date.now().toString(),
            name: editingName || "Untitled Query",
            content: editingContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPushed: false
        };
        setQueries([...queries, query]);
        setSelectedQuery(query);
        setIsCreating(false);
    };

    const handleUpdateQuery = async () => {
        if (!selectedQuery) return;

        const updatedQuery = {
            ...selectedQuery,
            name: editingName || "Untitled Query",
            content: editingContent,
            updatedAt: new Date().toISOString(),
            isPushed: false
        };

        const updatedQueries = queries.map((q) =>
            q.id === selectedQuery.id ? updatedQuery : q
        );
        setQueries(updatedQueries);
        setSelectedQuery(updatedQuery);
    };

    const handlePushChanges = async () => {
        setIsPushing(true);
        try {
            if (!userID) {
                throw new Error("User ID is required");
            }
            await API.pushQueries(userID, resolvedParams.instanceId, queries);

            const updatedQueries = queries.map(query => ({
                ...query,
                isPushed: true
            }));
            setQueries(updatedQueries);
            if (selectedQuery) {
                setSelectedQuery({
                    ...selectedQuery,
                    isPushed: true
                });
            }
        } finally {
            setIsPushing(false);
        }
    };

    const handleDeleteQuery = async (queryId: string) => {
        const updatedQueries = queries.filter((q) => q.id !== queryId);
        setQueries(updatedQueries);
        if (selectedQuery?.id === queryId) {
            setSelectedQuery(null);
            setEditingContent("");
            setEditingName("");
        }
    };

    const startNewQuery = () => {
        setIsCreating(true);
        setSelectedQuery(null);
        setEditingName("");
        setEditingContent("");
    };

    const selectQuery = (query: Query) => {
        setSelectedQuery(query);
        setEditingName(query.name);
        setEditingContent(query.content);
        setIsCreating(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl flex border rounded-lg my-8 mx-auto bg-background">
                {/* Sidebar */}
                <div className="w-64 border-r rounded-l-lg">
                    <div className="p-4 border-b flex flex-col gap-2">

                        <Button
                            className="w-full flex items-center justify-center"
                            onClick={handlePushChanges}
                            disabled={isPushing || queries.every(q => q.isPushed)}
                        >
                            {isPushing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Pushing...
                                </>
                            ) : (
                                'Push Changes'
                            )}
                        </Button>
                    </div>
                    <div className="overflow-y-auto px-2 py-2 h-full">
                        <button
                            onClick={startNewQuery}
                            className="w-full text-left mb-2 rounded-md px-4 py-3 flex items-center gap-2 hover:bg-muted transition-colors bg-muted/50"
                        >
                            <Plus className="w-4 h-4 text-primary" />
                            <div className="truncate">
                                <div className="font-medium truncate">New Query</div>
                            </div>
                        </button>
                        {queries.map((query) => (
                            <button
                                key={query.id}
                                onClick={() => selectQuery(query)}
                                className={cn(
                                    "w-full text-left mb-2 rounded-md px-4 py-3 flex items-center gap-2 hover:bg-muted/50 transition-colors",
                                    selectedQuery?.id === query.id && "bg-muted hover:bg-muted"
                                )}
                            >
                                <FileText className={cn(
                                    "w-4 h-4",
                                    query.isPushed ? "text-muted-foreground" : "text-primary"
                                )} />
                                <div className="truncate">
                                    <div className="font-medium truncate">{query.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(query.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden rounded-r-lg">
                    <div className="border-b p-4 flex justify-between items-center">
                        <div className="flex-1 gap-2">
                            <div className="text-lg font-medium">
                                {editingName || "Untitled Query"}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {selectedQuery && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDeleteQuery(selectedQuery.id)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                onClick={isCreating ? handleCreateQuery : handleUpdateQuery}
                                disabled={!editingContent}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <Textarea
                            value={editingContent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingContent(e.target.value)}
                            placeholder="Enter your query here..."
                            className="min-h-[60vh] font-mono resize-none bg-muted/50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 