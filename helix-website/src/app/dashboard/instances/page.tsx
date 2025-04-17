"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/amplify-functions";
import { AuthUser } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { Header } from "../components/Header";
import { Sidebar } from "../components/sidebars/Sidebar";
import { InstanceCard, SkeletonCard } from "../components/InstanceCard";
import { useInstances } from "@/hooks/useInstances";

export default function InstancesPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    router.push("/");
                    return;
                }
                setUser(currentUser);
            } catch (err) {
                console.error("Error fetching user:", err);
                router.push("/");
            }
        };

        getUser();
    }, [router]);

    const { instances, status } = useInstances(user?.userId ?? null);
    const loading = status === 'loading' || status === 'idle';

    return (
        <div className="flex flex-col h-screen text-white">
            <Header />
            <main className="flex-1 flex flex-row">
                <Sidebar />
                <div className="flex-1">
                    <div className="p-6">
                        <div className="space-y-4 mb-6">
                            <Button
                                variant="default"
                                size="sm"
                                className="text-xs h-8"
                                disabled={instances?.length >= 1}
                                onClick={() => router.push("/dashboard/instances/create-instance")}
                            >
                                Create Instance
                            </Button>
                            <h1 className="text-2xl font-semibold text-foreground">Your Instances</h1>
                        </div>

                        {loading ? (
                            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <SkeletonCard />
                            </div>
                        ) : instances && instances.length > 0 ? (
                            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {instances.map((instance, index) => (
                                    <InstanceCard key={instance.instance_id || index} instance={instance} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-16">
                                <p className="text-foreground/80">No instances found</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 