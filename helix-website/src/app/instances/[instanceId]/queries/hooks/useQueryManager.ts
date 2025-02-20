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
    const [queries, setQueries] = useState<Query[]>([]);
    const [originalQueries, setOriginalQueries] = useState<Query[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
    const [deletedQueries, setDeletedQueries] = useState<Set<string>>(new Set());
    const [editingContent, setEditingContent] = useState("");
    const [editingName, setEditingName] = useState<string | null>(null);
    const [isPushing, setIsPushing] = useState(false);
    const [popup, setPopup] = useState<PopupState | null>(null);

    // Computed states
    const hasUnsavedChanges = Boolean(selectedQuery && (
        editingContent !== selectedQuery.content ||
        (editingName !== null && editingName !== selectedQuery.name)
    ));

    const hasUnpushedChanges = queries.some(query => {
        const isDeleted = deletedQueries.has(query.id);
        const originalQuery = originalQueries.find(q => q.id === query.id);
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
            const [apiQueries] = await Promise.all([
                API.getQueries(user.userId, instanceId),
                API.getUserResources(user.userId, "")
            ]);

            setQueries(apiQueries.queries);
            setOriginalQueries(JSON.parse(JSON.stringify(apiQueries.queries)));
        };
        fetchData();
    }, [instanceId]);

    // Query management functions
    const saveQuery = async () => {
        if (!selectedQuery) return;

        const updatedQuery = {
            ...selectedQuery,
            content: editingContent,
            name: editingName ?? selectedQuery.name
        };

        setQueries(queries.map(q => q.id === updatedQuery.id ? updatedQuery : q));
        setSelectedQuery(updatedQuery);
        setEditingName(null);
        return updatedQuery;
    };

    const doPush = async () => {
        if (!userID) return;
        setIsPushing(true);

        try {
            const changedQueries = queries.filter(query => {
                const isDeleted = deletedQueries.has(query.id);
                const originalQuery = originalQueries.find(q => q.id === query.id);
                return !isDeleted && (!originalQuery || JSON.stringify(query) !== JSON.stringify(originalQuery));
            });

            if (changedQueries.length > 0) {
                await API.pushQueries(userID, instanceId, changedQueries);
            }

            if (deletedQueries.size > 0) {
                const queriesToDelete = queries.filter(q => deletedQueries.has(q.id));
                if (queriesToDelete.length > 0) {
                    await API.deleteQueries(userID, instanceId, queriesToDelete);
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
        const newQuery: Query = {
            id: uuidv4(),
            name: `Untitled Query`,
            content: ""
        };
        setQueries([...queries, newQuery]);
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