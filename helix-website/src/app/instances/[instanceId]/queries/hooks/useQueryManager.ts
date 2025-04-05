import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import API, { Query } from "@/app/api";
import { getCurrentUser } from "@/amplify-functions";
import { PopupState } from "../components/ConfirmationPopup";
import { useRouter, useSearchParams } from "next/navigation";

export function useQueryManager(instanceId: string) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userID, setUserID] = useState<string | null>(null);
    const [clusterId, setClusterId] = useState<string | null>(null);
    const [queries, _setQueries] = useState<Query[]>([]);
    const [region, setRegion] = useState<string | null>(null);
    const [originalQueries, setOriginalQueries] = useState<Query[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [deletedQueries, setDeletedQueries] = useState<Set<string>>(new Set());
    const [editingContent, _setEditingContent] = useState("");
    const [editingName, setEditingName] = useState<string | null>(null);
    const [isPushing, setIsPushing] = useState(false);
    const [popup, setPopup] = useState<PopupState | null>(null);
    const [instanceName, setInstanceName] = useState<string | null>(null);
    const [pushError, setPushError] = useState<string | null>(null);
    // Computed states
    const hasUnsavedChanges = Boolean(selectedQuery && (
        editingContent !== selectedQuery.content ||
        (editingName !== null && editingName !== selectedQuery.name)
    ));

    const hasUnpushedChanges = (queries !== null && queries?.length === 0) ? false : queries?.some(query => {
        const isDeleted = deletedQueries.has(query.id);
        const originalQuery = originalQueries?.find(q => q.id === query.id);
        const isNew = !originalQuery;
        const hasChanges = originalQuery && JSON.stringify(query) !== JSON.stringify(originalQuery);
        return !isDeleted && (isNew || hasChanges);
    }) || deletedQueries.size > 0;

    // Load initial data
    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            if (!user) return;

            setUserID(user.userId);
            console.log("Fetching data for instanceId:", instanceId);
            const [apiQueries, resources] = await Promise.all([
                API.getQueries(user.userId, instanceId),
                API.getUserResources(user.userId, "")
            ]);

            _setQueries(apiQueries.queries);
            setOriginalQueries(JSON.parse(JSON.stringify(apiQueries.queries)));
            
            console.log("Resources:", resources);
            // Find the instance with matching instanceId and set its cluster_id
            const instance = resources.find(resource => {
                console.log("Comparing", resource.instance_id, "with", instanceId);
                return resource.instance_id === instanceId;
            });
            
            if (instance) {
                console.log("Found instance:", instance);
                setClusterId(instance.cluster_id);
                setInstanceName(instance.instance_name);
                setRegion(instance.instance_region);
                console.log("Setting region to:", instance.instance_region);
            } else {
                console.error("No instance found with ID:", instanceId);
            }
        };
        fetchData();
    }, [instanceId]);

    // Query management functions
    const saveQuery = async () => {
        if (!selectedQuery) return null;

        let newName = editingName ?? selectedQuery.name;
        
        const updatedQuery = {
            ...selectedQuery,
            content: editingContent,
            name: newName
        };
        
        _setQueries(queries.map(q => q.id === updatedQuery.id ? updatedQuery : q));
        setSelectedQuery(updatedQuery);
        setEditingName(null);
        setPushError(null);
        
        return { query: updatedQuery, wasAutoRenamed: false };
    };

    const doPush = async () => {
        setPushError(null);
        if (!userID || !clusterId || !instanceName || !region) {
            setPushError("Missing required data for push operation");
            return;
        }
        setIsPushing(true);
        try {
            if (queries === null) return;
            const changedQueries = queries.filter(query => {
                const isDeleted = deletedQueries.has(query.id);
                const originalQuery = originalQueries !== null ? originalQueries.find(q => q.id === query.id) : null;
                // Only include non-empty queries that have changes
                return !isDeleted && 
                       query.content.trim() !== "" && 
                       (!originalQuery || JSON.stringify(query) !== JSON.stringify(originalQuery));
            });

            if (changedQueries.length > 0) {
                console.log("Pushing queries:", { clusterId, region });
                const response = await API.pushQueries(userID, instanceId, instanceName, clusterId, region, changedQueries);
                if (response.error) {
                    throw new Error(response.error);
                }
            }

            // Add empty queries to deletedQueries
            const emptyQueries = queries.filter(q => q.content.trim() === "");
            if (emptyQueries.length > 0) {
                emptyQueries.forEach(q => deletedQueries.add(q.id));
            }

            // Handle deletions
            if (deletedQueries.size > 0) {
                const queriesToDelete = queries.filter(q => deletedQueries.has(q.id));
                if (queriesToDelete.length > 0) {
                    console.log("Deleting queries:", { clusterId, region });
                    await API.deleteQueries(userID, instanceId, clusterId, region, queriesToDelete);
                }
                _setQueries(queries.filter(q => !deletedQueries.has(q.id)));
                setDeletedQueries(new Set());
            }

            const currentQueries = queries.filter(q => !deletedQueries.has(q.id));
            setOriginalQueries(JSON.parse(JSON.stringify(currentQueries)));
        } catch (error) {
            setPushError(error instanceof Error ? error.message : "Failed to push changes");
            return;
        } finally {
            setIsPushing(false);
        }
    };

    const createQuery = () => {
        let name = "untitled-query";
        
        // Check for duplicate names
        if (queries !== null) {
            const existingNames = new Set(queries
                .filter(q => !deletedQueries.has(q.id))
                .map(q => q.name));

            if (existingNames.has(name)) {
                // Find a unique name by appending a number
                let counter = 1;
                let baseName = name;
                while (existingNames.has(name)) {
                    name = `${baseName}-${counter}`;
                    counter++;
                }
            }
        }

        const newQuery: Query = {
            id: uuidv4(),
            name,
            content: ""
        };
        if (queries === null) _setQueries([newQuery]);
        else _setQueries([...queries, newQuery]);
        setSelectedQuery(newQuery);
        _setEditingContent("");
        setEditingName(null);
    };

    const selectQuery = (query: Query) => {
        setSelectedQuery(query);
        _setEditingContent(query.content);
        setEditingName(null);
    };

    const clearQueryFromUrl = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('queryId');
        router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    };

    const deleteQuery = (queryId: string) => {
        setDeletedQueries(new Set([...deletedQueries, queryId]));
        if (selectedQuery?.id === queryId) {
            setSelectedQuery(null);
            _setEditingContent("");
            setEditingName(null);
            clearQueryFromUrl();
        }
    };

    const recoverQuery = (queryId: string) => {
        setDeletedQueries(prev => {
            const next = new Set(prev);
            next.delete(queryId);
            return next;
        });
        setPopup(null);
    };

    const setEditingContent = (content: string) => {
        _setEditingContent(content);
    };

    const setQueries = (newQueries: Query[]) => {
        _setQueries(newQueries);
    };

    return {
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
        clusterId,
        instanceName,
        pushError,
        actions: {
            setEditingContent,
            setEditingName,
            setPopup,
            saveQuery,
            doPush,
            createQuery,
            selectQuery,
            deleteQuery,
            recoverQuery
        }
    };
}

export default useQueryManager; 