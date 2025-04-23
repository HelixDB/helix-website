"use client";
import { createContext, useContext, ReactNode, useEffect } from "react";
import { useInstance } from "@/hooks/useInstances";
import { useAuth } from "@/app/dashboard/components/auth-wrapper";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const router = useRouter();
    const instanceData = useInstance(user?.userId ?? null, instanceId);

    useEffect(() => {
        // Check if we have finished loading and the instance doesn't exist
        if (instanceData.status === 'succeeded' && !instanceData.instance) {
            toast.error("Instance not found");
            router.push('/dashboard/instances');
        }
    }, [instanceData.status, instanceData.instance, router]);

    return (
        <InstanceContext.Provider value={instanceData}>
            {children}
        </InstanceContext.Provider>
    );
} 