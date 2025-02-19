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
    content: string;
}

export default function QueriesPage({ params }: { params: Promise<{ instanceId: string }> }) {
    const resolvedParams = use(params);
    const [userID, setUserID] = useState<string | null>(null);
    const [queries, setQueries] = useState<Query[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const user = await getCurrentUser();
            if (user) {
                setUserID(user.userId);
                try {
                    const queries = await API.getQueries(user.userId, resolvedParams.instanceId);
                    setQueries(queries);
                } catch (error) {
                    console.error('Error fetching queries:', error);
                    setQueries([]);
                }
            }
            setIsLoading(false);
        }
        fetchData();
    }, [resolvedParams.instanceId]);

    const handleCreateQuery = async () => {
        const query: Query = {
            id: `query-${Date.now()}`,
            content: editingContent
        };
        setQueries([...queries, query]);
        setSelectedQuery(query);
        setIsCreating(false);
        await handleSaveQueries([...queries, query]);
    };

    const handleUpdateQuery = async () => {
        if (!selectedQuery) return;

        const updatedQuery = {
            ...selectedQuery,
            content: editingContent
        };

        const updatedQueries = queries.map((q) =>
            q.id === selectedQuery.id ? updatedQuery : q
        );
        setQueries(updatedQueries);
        setSelectedQuery(updatedQuery);
        await handleSaveQueries(updatedQueries);
    };

    const handleSaveQueries = async (queriesToSave: Query[]) => {
        setIsSaving(true);
        try {
            if (!userID) {
                throw new Error("User ID is required");
            }
            await API.pushQueries(userID, resolvedParams.instanceId, queriesToSave);
        } catch (error) {
            console.error('Error saving queries:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteQuery = async (queryId: string) => {
        const updatedQueries = queries.filter((q) => q.id !== queryId);
        setQueries(updatedQueries);
        if (selectedQuery?.id === queryId) {
            setSelectedQuery(null);
            setEditingContent("");
        }
        await handleSaveQueries(updatedQueries);
    };

    const startNewQuery = () => {
        setIsCreating(true);
        setSelectedQuery(null);
        setEditingContent("");
    };

    const selectQuery = (query: Query) => {
        setSelectedQuery(query);
        setEditingContent(query.content);
        setIsCreating(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl flex border rounded-lg my-8 mx-auto bg-background">
                {/* Sidebar */}
                <div className="w-64 border-r rounded-l-lg">
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
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            queries.map((query) => (
                                <button
                                    key={query.id}
                                    onClick={() => selectQuery(query)}
                                    className={cn(
                                        "w-full text-left mb-2 rounded-md px-4 py-3 flex items-center gap-2 hover:bg-muted/50 transition-colors",
                                        selectedQuery?.id === query.id && "bg-muted hover:bg-muted"
                                    )}
                                >
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <div className="truncate">
                                        <div className="font-medium truncate">Query {query.id}</div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden rounded-r-lg">
                    <div className="border-b p-4 flex justify-between items-center">
                        <div className="flex-1 gap-2">
                            <div className="text-lg font-medium">
                                {selectedQuery ? `Query ${selectedQuery.id}` : "New Query"}
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
                                disabled={!editingContent || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
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