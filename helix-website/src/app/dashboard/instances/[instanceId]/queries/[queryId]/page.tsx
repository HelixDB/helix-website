"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Loader2, RotateCcw, Trash, Save, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { AppDispatch, RootState } from "@/store/store";
import {
    deleteQueryThunk,
    selectInstanceById,
    selectQueries,
    fetchQueries,
} from "@/store/features/instancesSlice";

import { getCurrentUser } from "@/lib/amplify-functions";
import API from "@/app/api";
import { toSnakeCase } from "@/lib/utils";

import { QueryEditor } from "@/app/dashboard/components/QueryEditor";
import { ConfirmDialog } from "@/app/dashboard/components/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface Query {
    id: string;
    name: string;
    content: string;
}

export default function QueryEditorPage({ params }: { params: Promise<{ instanceId: string, queryId: string }> }) {
    const resolvedParams = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [localContent, setLocalContent] = useState("");
    const [hasLocalChanges, setHasLocalChanges] = useState(false);
    const [query, setQuery] = useState<Query | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingQueries, setIsFetchingQueries] = useState(false);
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const instance = useSelector((state: RootState) =>
        selectInstanceById(state, resolvedParams.instanceId)
    );
    const queries = useSelector((state: RootState) => selectQueries(state));

    // Save original router.push so we can use it even after we override it
    const originalPushRef = useRef(router.push);

    // --- Load query on mount or param change ---
    useEffect(() => {
        const loadQuery = async () => {
            if (resolvedParams.queryId === 'new') {
                const newQuery = {
                    id: uuidv4(),
                    name: 'new_query',
                    content: 'QUERY newQuery () =>\n    RETURN NONE'
                };
                setQuery(newQuery);
                setLocalContent(newQuery.content);
                setIsLoading(false);
                setHasLocalChanges(false); // Changed this line - new queries start without unsaved changes
            } else {
                const foundQuery = queries.find((q: Query) => q.id === resolvedParams.queryId);

                if (foundQuery) {
                    setQuery(foundQuery);
                    setLocalContent(foundQuery.content);
                    setIsLoading(false);
                } else if (!isFetchingQueries && queries.length === 0) {
                    // If we don't have any queries yet, fetch them first
                    try {
                        setIsFetchingQueries(true);
                        const user = await getCurrentUser();
                        if (user) {
                            await dispatch(fetchQueries({
                                userId: user.userId,
                                instanceId: resolvedParams.instanceId
                            })).unwrap();
                        }
                    } catch (error) {
                        console.error('Failed to fetch queries:', error);
                        toast.error("Failed to fetch queries");
                        router.push(`/dashboard/instances/${resolvedParams.instanceId}/queries`);
                    } finally {
                        setIsFetchingQueries(false);
                    }
                } else if (!isFetchingQueries) {
                    // If we have queries but didn't find the one we're looking for
                    toast.error("Query not found");
                    router.push(`/dashboard/instances/${resolvedParams.instanceId}/queries`);
                }
            }
        };

        loadQuery();
    }, [resolvedParams.instanceId, resolvedParams.queryId, queries, router, dispatch, isFetchingQueries]);

    // --- Warn on browser refresh/tab close ---
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasLocalChanges) {
                const message = "You have unsaved changes.";
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasLocalChanges]);

    // --- Intercept router.push and show confirmation if needed ---
    useEffect(() => {
        const originalPush = router.push;
        originalPushRef.current = originalPush;

        const customPush = (url: string) => {
            if (hasLocalChanges) {
                setPendingUrl(url);
                setShowUnsavedDialog(true);
            } else {
                originalPush(url);
            }
        };

        // @ts-ignore override router.push
        router.push = customPush;

        return () => {
            // @ts-ignore restore router.push
            router.push = originalPush;
        };
    }, [hasLocalChanges, router]);

    const extractQueryName = (content: string): string | null => {
        const match = content.match(/QUERY\s+(\w+)\s*\(/);
        return match ? match[1] : null;
    };

    // --- Content editing logic ---
    const handleContentChange = (content: string) => {
        setLocalContent(content);

        // Update query name whenever the query definition changes
        if (query) {
            const queryName = extractQueryName(content);
            if (queryName) {
                try {
                    const snakeCaseName = toSnakeCase(queryName);
                    setQuery({
                        ...query,
                        name: snakeCaseName
                    });
                } catch (error) {
                    // If toSnakeCase throws an error, we don't update the name
                    console.warn('Failed to convert query name to snake case:', error);
                }
            }
        }

        // Only mark as having changes if the content is different from the initial state
        if (resolvedParams.queryId === 'new') {
            const initialContent = 'QUERY newQuery () =>\n    RETURN NONE';
            setHasLocalChanges(content !== initialContent);
        } else {
            setHasLocalChanges(content !== query?.content);
        }
    };

    const handleRevert = () => {
        if (query) {
            setLocalContent(query.content);
            setHasLocalChanges(false);

            // Execute any pending navigation
            if (pendingUrl) {
                originalPushRef.current(pendingUrl);
                setPendingUrl(null);
            }
        }
    };

    const handleSave = async () => {
        if (!query || !instance) return;
        if (localContent.trim() === "") {
            toast.error("Cannot save empty query");
            return;
        }
        if (!hasLocalChanges) {
            toast("No changes to save");
            return;
        }

        // Extract query name from content
        const queryName = extractQueryName(localContent);
        if (!queryName) {
            toast.error("Invalid query format", {
                description: "Query must start with 'QUERY name ()'"
            });
            return;
        }

        // Check for duplicate names
        const isDuplicateName = queries.some(q =>
            q.id !== query.id && // Exclude current query when checking
            extractQueryName(q.content) === queryName
        );

        if (isDuplicateName) {
            toast.error("Duplicate query name", {
                description: `A query named '${queryName}' already exists`
            });
            return;
        }

        try {
            setIsSaving(true);
            const user = await getCurrentUser();
            if (!user) {
                toast.error("No user found", {
                    description: "Please try logging in again."
                });
                return;
            }

            const updatedQuery = {
                ...query,
                content: localContent
            };

            await API.pushQuery(
                user.userId,
                resolvedParams.instanceId,
                instance.instance_name,
                instance.cluster_id,
                instance.instance_region,
                updatedQuery
            );

            // After successful save, update local state
            setQuery(updatedQuery);
            setHasLocalChanges(false);

            // Fetch latest queries to update Redux store
            await dispatch(fetchQueries({
                userId: user.userId,
                instanceId: resolvedParams.instanceId
            }));

            // If this was a new query, replace the URL and update local state from Redux
            if (resolvedParams.queryId === 'new') {
                router.push(`/dashboard/instances/${resolvedParams.instanceId}/queries/${updatedQuery.id}`);

                // Find the newly created query in Redux and update local state
                const savedQuery = queries.find(q => q.id === updatedQuery.id);
                if (savedQuery) {
                    setQuery(savedQuery);
                    setLocalContent(savedQuery.content);
                }
            } else {
                toast.success("Query saved successfully");
            }

            if (pendingUrl) {
                originalPushRef.current(pendingUrl);
                setPendingUrl(null);
            }
        } catch (error) {
            toast.error("Failed to save query", {
                description: error instanceof Error ? error.message : "Unknown error occurred"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (hasLocalChanges) {
            setShowDeleteDialog(true);
            return;
        }
        await performDelete();
    };

    const performDelete = async () => {
        if (!query || !instance) return;
        try {
            setIsDeleting(true);
            const user = await getCurrentUser();
            if (!user) {
                toast.error("No user found", {
                    description: "Please try logging in again."
                });
                return;
            }

            const result = await dispatch(deleteQueryThunk({
                userId: user.userId,
                instanceId: resolvedParams.instanceId,
                instanceName: instance.instance_name,
                clusterId: instance.cluster_id,
                region: instance.instance_region,
                query
            })).unwrap();

            if (result.error) {
                toast.error("Error deleting query", { description: result.error });
            } else {
                await dispatch(fetchQueries({
                    userId: user.userId,
                    instanceId: resolvedParams.instanceId
                }));
                router.push(`/dashboard/instances/${resolvedParams.instanceId}/queries`);
                toast.success("Query deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete query", {
                description: error instanceof Error ? error.message : "Unknown error occurred"
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleConfirmNavigation = useCallback(() => {
        setShowUnsavedDialog(false);
        if (pendingUrl) {
            originalPushRef.current(pendingUrl);
            setPendingUrl(null);
        }
    }, [pendingUrl]);

    const handleCancelNavigation = useCallback(() => {
        setShowUnsavedDialog(false);
        setPendingUrl(null);
    }, []);

    const handleCopyEndpoint = (endpoint: string) => {
        navigator.clipboard.writeText(endpoint);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    if (isLoading || !query || !instance) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-screen overflow-hidden p-6">
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Save
                            className={`w-5 h-5 ${hasLocalChanges || resolvedParams.queryId === 'new'
                                ? "text-orange-500"
                                : "text-green-500"
                                }`}
                        />
                        <div>
                            <h1 className="text-2xl font-semibold">{query.name}</h1>
                            {resolvedParams.queryId !== 'new' && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-muted-foreground font-medium text-sm hidden md:block">Endpoint:</span>
                                    <code className="px-2 py-0.5 rounded text-muted-foreground bg-background font-mono text-xs whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-[300px] max-w-[150px]">
                                        {instance?.api_endpoint}/{query.name}
                                    </code>
                                    <button
                                        onClick={() => handleCopyEndpoint(`${instance?.api_endpoint}/${query.name}`)}
                                        className="p-1 hover:bg-muted rounded-md transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copiedEndpoint === `${instance?.api_endpoint}/${query.name}` ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end mt-auto space-x-2">

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving || isDeleting || !hasLocalChanges}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deploying...
                                </>
                            ) : 'Commit Changes'}
                        </Button><Button
                            variant="outline"
                            size="sm"
                            onClick={handleRevert}
                            disabled={isSaving || isDeleting || !hasLocalChanges}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="bg-red-500/20 hover:bg-red-500/50 text-white"
                            disabled={isSaving || isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                </>
                            ) : (
                                <Trash className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>

                <QueryEditor
                    content={localContent}
                    hasUnsavedChanges={hasLocalChanges}
                    onContentChange={handleContentChange}
                    onSave={handleSave}
                    isSaving={isSaving}
                    isDeleting={isDeleting}
                />
            </div>

            <ConfirmDialog
                isOpen={showUnsavedDialog}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
                confirmText="Leave"
                cancelText="Stay"
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onConfirm={performDelete}
                onCancel={() => setShowDeleteDialog(false)}
                title="Delete Query"
                description="You have unsaved changes. Are you sure you want to delete this query? Your changes will be lost."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
}
