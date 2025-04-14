"use client";
import { useParams, useRouter } from "next/navigation";
import { useInstance } from "@/hooks/useInstances";
import { useAuth } from "@/app/dashboard/components/auth-wrapper";
import { useEffect } from "react";
import { toast } from "sonner";

export default function QueriesPage() {
    const router = useRouter();
    const params = useParams();
    const instanceId = params.instanceId as string;
    const { user } = useAuth();
    const { instance, status } = useInstance(user?.userId ?? null, instanceId);

    useEffect(() => {
        if (status === 'succeeded' && !instance) {
            toast.error("Instance not found or access denied");
            router.push("/dashboard/instances");
        }
    }, [instance, status, router]);

    if (!instance) {
        return null;
    }

    return (
        <main className="flex-1 overflow-y-auto">
            <h1>Queries</h1>
        </main>
    );
}
