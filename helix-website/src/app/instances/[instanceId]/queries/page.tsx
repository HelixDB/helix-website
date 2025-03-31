"use client";

import { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Query } from "@/app/api";
import { useRouter, useSearchParams } from "next/navigation";
import { QueryIcon } from "./components/QueryIcon";
import { StatusLegend } from "./components/StatusLegend";
import { ConfirmationPopup } from "./components/ConfirmationPopup";
import { QueryEditor } from "./components/QueryEditor";
import { useQueryManager } from "./hooks/useQueryManager";

interface PageProps {
    params: Promise<{ instanceId: string }>;
}

export default function QueriesPage({ params }: PageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resolvedParams = use(params);
    const {
        queries,
        selectedQuery,
        editingContent,
        editingName,
        isPushing,
        popup,
        hasUnsavedChanges,
        hasUnpushedChanges,
        deletedQueries,
        originalQueries,
        actions,
        instanceName
    } = useQueryManager(resolvedParams.instanceId);

    // Load selected query from URL on initial load
    useEffect(() => {
        const queryId = searchParams.get('queryId');
        if (queries !== null && queryId && queries?.length > 0) {
            const query = queries.find(q => q.id === queryId);
            if (query && !deletedQueries.has(query.id)) {
                actions.selectQuery(query);
            }
        }
    }, [queries, searchParams]);

    const handlePushChanges = async () => {
        if (hasUnsavedChanges) {
            actions.setPopup({
                type: 'save',
                action: 'push',
                onConfirm: async () => {
                    actions.setPopup(null);
                    await actions.saveQuery();
                    actions.doPush();
                },
                onCancel: () => {
                    actions.setPopup(null);
                    actions.doPush();
                }
            });
            return;
        }
        actions.doPush();
    };

    const handleCreateQuery = () => {
        if (hasUnsavedChanges) {
            actions.setPopup({
                type: 'save',
                action: 'new',
                onConfirm: async () => {
                    actions.setPopup(null);
                    await actions.saveQuery();
                    actions.createQuery();
                },
                onCancel: () => {
                    actions.setPopup(null);
                    actions.createQuery();
                }
            });
            return;
        }
        actions.createQuery();
    };

    const handleSelectQuery = (query: Query) => {
        if (hasUnsavedChanges) {
            actions.setPopup({
                type: 'save',
                action: 'switch',
                onConfirm: async () => {
                    actions.setPopup(null);
                    await actions.saveQuery();
                    actions.selectQuery(query);
                    updateQueryInUrl(query.id);
                },
                onCancel: () => {
                    actions.setPopup(null);
                    actions.selectQuery(query);
                    updateQueryInUrl(query.id);
                }
            });
            return;
        }
        actions.selectQuery(query);
        updateQueryInUrl(query.id);
    };

    const updateQueryInUrl = (queryId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('queryId', queryId);
        router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-background p-8">
            {/* Header */}
            <div className="flex justify-between items-center mt-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.replace("/dashboard")}
                        className="flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {selectedQuery && (
                        <div className="text-sm text-muted-foreground font-mono">
                            https://api.helix-db.com/{instanceName?.toLowerCase()}/{selectedQuery.name}
                        </div>
                    )}
                </div>
                <StatusLegend />
            </div>

            {/* Main Content */}
            <div className="mx-auto mt-4 max-w-7xl h-[65vh] flex flex-row rounded-lg bg-background space-x-4">
                {/* Sidebar */}
                <div className="w-64 flex flex-col h-full">
                    <Button
                        className="w-full rounded-xl shadow-md mb-4"
                        onClick={handlePushChanges}
                        disabled={!hasUnpushedChanges || isPushing}
                    >
                        {isPushing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Pushing...
                            </>
                        ) : hasUnpushedChanges ? (
                            'Push Changes'
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                All Changes Synced
                            </>
                        )}
                    </Button>

                    <div className="flex-1 overflow-y-auto px-2 pt-2 pb-16 rounded-2xl bg-muted/50">
                        <button
                            onClick={handleCreateQuery}
                            className="w-full text-left mb-2 rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-foreground/10 bg-foreground/5"
                        >
                            <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-medium">New Query</span>
                        </button>

                        {queries !== null && queries.map((query) => (
                            <button
                                key={query.id}
                                onClick={() => {
                                    if (deletedQueries.has(query.id)) {
                                        actions.setPopup({
                                            type: 'recover',
                                            queryId: query.id,
                                            action: 'switch',
                                            onConfirm: () => actions.recoverQuery(query.id),
                                            onCancel: () => actions.setPopup(null)
                                        });
                                    } else if (selectedQuery?.id == query.id) { }
                                    else
                                        handleSelectQuery(query);
                                }}
                                className={cn(
                                    "w-full text-left mb-2 rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-foreground/[0.025]",
                                    selectedQuery?.id === query.id && "bg-foreground/5",
                                    deletedQueries.has(query.id) && "opacity-50"
                                )}
                            >
                                <QueryIcon
                                    query={query}
                                    selectedQuery={selectedQuery}
                                    hasUnsavedChanges={hasUnsavedChanges}
                                    deletedQueries={deletedQueries}
                                    originalQueries={originalQueries}
                                />
                                <span className="font-medium truncate">{query.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <QueryEditor
                    selectedQuery={selectedQuery}
                    editingName={editingName}
                    editingContent={editingContent}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onNameChange={actions.setEditingName}
                    onContentChange={actions.setEditingContent}
                    onSave={actions.saveQuery}
                    onDelete={actions.deleteQuery}
                    onStartEditingName={actions.setEditingName}
                />
            </div>

            {popup && (
                <ConfirmationPopup
                    popup={popup}
                    onCancel={popup.onCancel}
                    onConfirm={popup.onConfirm}
                />
            )}
        </div>
    );
} 