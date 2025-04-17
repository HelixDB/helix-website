"use client";
import { useParams } from "next/navigation";
import { InstanceHeader } from "@/app/dashboard/components/InstanceHeader";
import { InstanceSidebar } from "@/app/dashboard/components/sidebars/InstanceSidebar";
import { useInstance } from "@/hooks/useInstances";
import { useAuth } from "@/app/dashboard/components/auth-wrapper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { InstanceContext } from "./instance-context";

export default function InstanceLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const instanceId = params.instanceId as string;
    const { user } = useAuth();
    const instanceData = useInstance(user?.userId ?? null, instanceId);

    useEffect(() => {
        if (instanceData.status === 'succeeded' && !instanceData.instance) {
            toast.error("Instance not found or access denied");
            router.push("/dashboard/instances");
        }
    }, [instanceData.instance, instanceData.status, router]);

    return (
        <InstanceContext.Provider value={instanceData}>
            <div className="flex flex-col h-screen overflow-hidden">
                <InstanceHeader />
                <div className="flex flex-1 overflow-hidden">
                    {/* <InstanceSidebar instanceId={instanceId} /> */}
                    {/* Main content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </InstanceContext.Provider>
    );
}
