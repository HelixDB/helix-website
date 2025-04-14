"use client";

import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QueryEditor } from "@/app/dashboard/components/QueryEditor";
import { Loader2, RotateCcw, Trash } from "lucide-react";
import {
    selectQueries,
    selectQueriesStatus,
    selectActiveQueryId,
    selectActiveQueryEdit,
    setActiveQuery,
    updateQueryContent,
    revertQueryChanges,
    pushQuery,
    deleteQueryThunk,
    selectInstanceById,
    fetchQueries
} from "@/store/features/instancesSlice";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { getCurrentUser } from "@/lib/amplify-functions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function QueryEditorPage({ params }: { params: Promise<{ instanceId: string, queryId: string }> }) {
    const resolvedParams = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const queries = useSelector(selectQueries);
    const status = useSelector(selectQueriesStatus);
    const activeQueryId = useSelector(selectActiveQueryId);
    const activeQueryEdit = useSelector(selectActiveQueryEdit);
    const instance = useSelector((state: RootState) => selectInstanceById(state, resolvedParams.instanceId));

    useEffect(() => {
        if (queries.length > 0) {
            const query = queries.find(q => q.id === resolvedParams.queryId);
            if (query) {
                dispatch(setActiveQuery(query.id));
            } else if (resolvedParams.queryId === 'new') {
                const newQuery = {
                    id: uuidv4(),
                    name: 'new_query',
                    content: 'QUERY new_query =>\n    RETURN NONE'
                };
                dispatch(setActiveQuery(newQuery.id));
            }
        }
    }, [queries, resolvedParams.queryId, dispatch]);

    if (status === 'loading' || !queries || !activeQueryEdit) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const handleContentChange = (content: string) => {
        if (activeQueryId) {
            dispatch(updateQueryContent({ id: activeQueryId, content }));
        }
    };

    const handleSave = async () => {
        if (activeQueryId && activeQueryEdit && instance) {
            try {
                setIsSaving(true);
                const user = await getCurrentUser();
                if (!user) {
                    toast.error("No user found", {
                        description: "Please try logging in again."
                    });
                    return;
                }

                // Don't save if content is empty
                if (activeQueryEdit.content.trim() === "") {
                    toast.error("Cannot save empty query");
                    return;
                }

                // Only save if there are actual changes
                if (!activeQueryEdit.hasUnsavedChanges) {
                    toast("No changes to save");
                    return;
                }

                const result = await dispatch(pushQuery({
                    userId: user.userId,
                    instanceId: resolvedParams.instanceId,
                    instanceName: instance.instance_name,
                    clusterId: instance.cluster_id,
                    region: instance.instance_region,
                    query: {
                        id: activeQueryId,
                        name: activeQueryEdit.name,
                        content: activeQueryEdit.content
                    }
                })).unwrap();

                if (result.error) {
                    toast.error("Error saving query", {
                        description: result.error
                    });
                } else {
                    // Refetch queries to ensure we have the latest state
                    await dispatch(fetchQueries({
                        userId: user.userId,
                        instanceId: resolvedParams.instanceId
                    }));
                    toast.success("Query saved successfully");
                }
            } catch (error) {
                toast.error("Failed to save query", {
                    description: error instanceof Error ? error.message : "Unknown error occurred"
                });
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleDelete = async () => {
        if (activeQueryId && activeQueryEdit && instance) {
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
                    query: {
                        id: activeQueryId,
                        name: activeQueryEdit.name,
                        content: activeQueryEdit.content
                    }
                })).unwrap();

                if (result.error) {
                    toast.error("Error deleting query", {
                        description: result.error
                    });
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
            }
        }
    };

    const handleRevert = () => {
        if (activeQueryId) {
            dispatch(revertQueryChanges(activeQueryId));
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden p-6">
            <div className="flex flex-row justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {activeQueryEdit.name}
                    </h1>

                    <p className="text-sm text-muted-foreground h-6 mt-1">
                        {activeQueryEdit.hasUnsavedChanges && ("You have unsaved changes")}
                    </p>

                </div>
                <div className="flex justify-end space-x-2 mb-4">
                    {activeQueryEdit.hasUnsavedChanges && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className=""
                                onClick={handleRevert}
                                disabled={isSaving || isDeleting}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Revert Changes
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className=""
                                onClick={handleSave}
                                disabled={isSaving || isDeleting}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Commit Changes'
                                )}
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className=" bg-red-500/20 hover:bg-red-500/50 text-white"
                        disabled={isSaving || isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash className="w-4 h-4" />

                            </>
                        )}
                    </Button>
                </div>
            </div>

            <QueryEditor
                content={activeQueryEdit.content}
                hasUnsavedChanges={activeQueryEdit.hasUnsavedChanges}
                onContentChange={handleContentChange}
                onSave={handleSave}
                isSaving={isSaving}
                isDeleting={isDeleting}
            />
        </div>
    );
}
