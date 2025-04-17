/* "use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, CircuitBoard, Copy, Cpu, Feather, File, HardDrive, Ruler, Terminal } from "lucide-react";
import { toast } from "sonner";
import { useInstanceData } from "./layout"; */
/* 
export default function InstancePage() {
    const router = useRouter();
    const params = useParams();
    const instanceId = params.instanceId as string;
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
    const { instance } = useInstanceData();

    if (!instance) {
        return null;
    }

    const handleCopyEndpoint = async (endpoint: string) => {
        await navigator.clipboard.writeText(endpoint);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    return (
        <div className="px-[120px] py-20 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full space-x-4">
                    <h1 className="text-3xl font-semibold text-foreground">{instance.instance_name}</h1>
                    <span className="px-2 py-1 text-sm rounded-full bg-green-500/20 text-green-400">
                        Active
                    </span>
                </div>
            </div>

            <div className="space-y-16">
                <div className="flex flex-col lg:flex-row w-full gap-8">
                    <div className="flex flex-col space-y-8 w-full">
                        
                        <section>
                            <h2 className="text-xl font-semibold mb-2">Welcome to your project</h2>
                            <p className="text-foreground/60 mb-4">
                                Your instance has been deployed and is ready to start developing on
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2">Start writing your queries</h2>
                            <p className="text-foreground/60 mb-4">
                                Navigate to the queries tab, you can start defining, editing, and deploying queries.
                            </p>
                            <Button variant="outline" className="space-x-2 h-8"
                                onClick={() => router.push(`/dashboard/instances/${instanceId}/queries`)}
                            >
                                <Feather className="w-4 h-4" />
                                <span>Queries</span>
                            </Button>
                        </section>
                    </div>

                    <Card className="p-8 bg-card border-foreground/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <>
                                    <span className="text-muted-foreground font-medium">Endpoint:</span>
                                    <code className="px-2 py-0.5 rounded text-muted-foreground bg-background font-mono text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">
                                        {instance.api_endpoint}
                                    </code>
                                    <button
                                        onClick={() => handleCopyEndpoint(instance.api_endpoint || "")}
                                        className="p-1 hover:bg-muted rounded-md transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copiedEndpoint === instance.api_endpoint ? (
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                        )}
                                    </button>
                                </>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex gap-2">
                                <Cpu className="my-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        vCPUs
                                    </p>
                                    <p className="text-sm">{instance.vCPUs}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <CircuitBoard className="my-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Memory
                                    </p>
                                    <p className="text-sm">{instance.memory} GB</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <HardDrive className="my-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Volumes
                                    </p>
                                    <p className="text-sm">
                                        {instance.ebs_volumes?.length || 0}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Ruler className="my-0.5 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Type
                                    </p>
                                    <p className="capitalize text-sm">
                                        {instance.instance_size}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                {/* <section>
                    <h2 className="text-xl font-semibold mb-6">Integrating with your codebase</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <img src="/python-logo.svg" alt="Python" className="w-6 h-6" />
                                <span className="font-medium">Python</span>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="space-x-2 h-8">
                                    <File className="w-4 h-4" />
                                    <span>Docs</span>
                                </Button>
                                <Button variant="outline" size="sm" className="space-x-2 h-8">
                                    <Terminal className="w-4 h-4" />
                                    <span>Github</span>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <img src="/typescript-logo.svg" alt="TypeScript" className="w-6 h-6" />
                                <span className="font-medium">TypeScript</span>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="space-x-2 h-8">
                                    <File className="w-4 h-4" />
                                    <span>Docs</span>
                                </Button>
                                <Button variant="outline" size="sm" className="space-x-2 h-8">
                                    <Terminal className="w-4 h-4" />
                                    <span>Github</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section> 
            </div>
        </div>
    );
}
 */

import { redirect } from "next/navigation";
export default function InstanceIdPage() {
    redirect("/dashboard/instances");
}