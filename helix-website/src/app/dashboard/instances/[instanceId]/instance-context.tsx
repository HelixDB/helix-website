"use client";
import { createContext, useContext, ReactNode } from "react";
import { useInstance } from "@/hooks/useInstances";
import { useAuth } from "@/app/dashboard/components/auth-wrapper";

// Create context for instance data
export const InstanceContext = createContext<ReturnType<typeof useInstance> | null>(null);

// Custom hook to use instance data
export function useInstanceData() {
    const context = useContext(InstanceContext);
    if (!context) {
        throw new Error("useInstanceData must be used within an InstanceProvider");
    }
    return context;
}

// Provider component
export function InstanceProvider({
    children,
    instanceId
}: {
    children: ReactNode;
    instanceId: string;
}) {
    const { user } = useAuth();
    const instanceData = useInstance(user?.userId ?? null, instanceId);

    return (
        <InstanceContext.Provider value={instanceData}>
            {children}
        </InstanceContext.Provider>
    );
} 