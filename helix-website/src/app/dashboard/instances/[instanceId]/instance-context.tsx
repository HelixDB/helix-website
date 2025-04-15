"use client";
import { createContext, useContext } from "react";
import { useInstance } from "@/hooks/useInstances";

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