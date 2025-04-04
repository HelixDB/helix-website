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
    const [queries, setQueries] = useState<Query[]>([]);
    const [region, setRegion] = useState<string | null>(null);
    const [originalQueries, setOriginalQueries] = useState<Query[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [deletedQueries, setDeletedQueries] = useState<Set<string>>(new Set());
    const [editingContent, setEditingContent] = useState("");
    const [editingName, setEditingName] = useState<string | null>(null);
    const [isPushing, setIsPushing] = useState(false);
    const [popup, setPopup] = useState<PopupState | null>(null);
    const [instanceName, setInstanceName] = useState<string | null>(null);
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

            setQueries(apiQueries.queries);
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
        let wasAutoRenamed = false;
        
        // Check for duplicate names
        /* if (queries !== null) {
            const existingNames = new Set(queries
                .filter(q => q.id !== selectedQuery.id && !deletedQueries.has(q.id))
                .map(q => q.name));

            if (existingNames.has(newName)) {
                // Find a unique name by appending a number
                let counter = 1;
                let baseName = newName;
                while (existingNames.has(newName)) {
                    newName = `${baseName}-${counter}`;
                    counter++;
                }
                wasAutoRenamed = true;
            }
        } */

        const updatedQuery = {
            ...selectedQuery,
            content: editingContent,
            name: newName
        };
        
        setQueries(queries.map(q => q.id === updatedQuery.id ? updatedQuery : q));
        setSelectedQuery(updatedQuery);
        setEditingName(null);
        console.log("instac ", clusterId);

        return { query: updatedQuery, wasAutoRenamed };
    };

    const doPush = async () => {
        if (!userID || !clusterId || !instanceName || !region) {
            console.error("Missing required data:", { userID, clusterId, instanceName, region });
            return;
        }
        setIsPushing(true)
        try {
            if (queries === null) return;
            const changedQueries = queries.filter(query => {
                const isDeleted = deletedQueries.has(query.id);
                const originalQuery = originalQueries !== null ? originalQueries.find(q => q.id === query.id) : null;
                return !isDeleted && (!originalQuery || JSON.stringify(query) !== JSON.stringify(originalQuery));
            });

            if (changedQueries.length > 0) {
                console.log("Pushing queries:", { clusterId, region });
                await API.pushQueries(userID, instanceId, instanceName, clusterId, region, changedQueries);
            }

            if (deletedQueries.size > 0) {
                const queriesToDelete = queries.filter(q => deletedQueries.has(q.id));
                if (queriesToDelete.length > 0) {
                    console.log("Deleting queries:", { clusterId, region });
                    await API.deleteQueries(userID, instanceId, clusterId, region, queriesToDelete);
                }
                setQueries(queries.filter(q => !deletedQueries.has(q.id)));
                setDeletedQueries(new Set());
            }

            const currentQueries = queries.filter(q => !deletedQueries.has(q.id));
            setOriginalQueries(JSON.parse(JSON.stringify(currentQueries)));
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
        if (queries === null) setQueries([newQuery]);
        else setQueries([...queries, newQuery]);
        setSelectedQuery(newQuery);
        setEditingContent("");
        setEditingName(null);
    };

    const selectQuery = (query: Query) => {
        setSelectedQuery(query);
        setEditingContent(query.content);
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
            setEditingContent("");
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