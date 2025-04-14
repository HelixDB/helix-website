"use client";

import { use } from "react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { selectQueriesStatus, selectQueriesError, selectInstanceById } from "@/store/features/instancesSlice";

export default function QueriesPage({ params }: { params: Promise<{ instanceId: string }> }) {
    const resolvedParams = use(params);
    const status = useSelector(selectQueriesStatus);
    const error = useSelector(selectQueriesError);
    const instance = useSelector((state: RootState) => selectInstanceById(state, resolvedParams.instanceId));

    if (status === 'loading') {
        return (
            <main className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 overflow-y-auto p-6">
                <div className="text-center text-destructive py-8">
                    Error loading instance: {error}
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">{instance?.instance_name}</h1>
                {instance?.api_endpoint && (
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                        {instance.api_endpoint}
                    </p>
                )}
            </div>
            <div className="text-center text-muted-foreground py-8">
                Select a query from the sidebar or create a new one to get started.
            </div>
        </main>
    );
}
