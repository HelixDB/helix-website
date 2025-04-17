"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectQueries, selectQueriesStatus, deleteInstanceThunk } from "@/store/features/instancesSlice";
import { Loader2, Plus, ChevronRight, Feather, Copy, Check, Cpu, CircuitBoard, HardDrive, Ruler, Moon, Sun, Monitor } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstanceData } from "../instance-context";
import { useState } from "react";
import { DeleteInstanceDialog } from "@/components/ui/delete-instance-dialog";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/amplify-functions";
import { AppDispatch } from "@/store/store";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function QueriesPage() {
    const pathname = usePathname();
    const queries = useSelector(selectQueries);
    const status = useSelector(selectQueriesStatus);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const instanceId = params.instanceId as string;
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { instance } = useInstanceData();
    const { setTheme, resolvedTheme, theme } = useTheme();

    if (!instance) {
        return null;
    }

    const handleCopyEndpoint = async (endpoint: string) => {
        await navigator.clipboard.writeText(endpoint);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const handleDeleteInstance = async () => {
        try {
            const user = await getCurrentUser();
            if (!user || !instance) return;

            await dispatch(deleteInstanceThunk({
                userId: user.userId,
                instanceId: instanceId,
                instanceName: instance.instance_name,
                clusterId: instance.cluster_id,
                region: instance.instance_region
            })).unwrap();

            router.push('/dashboard/instances');
            toast.success('Instance deleted successfully');
        } catch (error) {
            toast.error('Failed to delete instance', {
                description: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <div className="p-8 space-y-16 pb-32">
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
                            {/* Welcome section */}
                            <section>
                                <h2 className="text-xl font-semibold mb-2">Welcome to your project</h2>
                                <p className="text-foreground/60 mb-4">
                                    Your instance has been deployed and is ready to start developing on
                                </p>
                            </section>

                            {/* Start writing queries section */}
                            <section>
                                <h2 className="text-xl font-semibold mb-2">Start writing your queries</h2>
                                <p className="text-foreground/60 mb-6">
                                    Navigate to the queries tab, you can start defining, editing, and deploying queries.
                                </p>
                                <Link href={`${pathname}/new`} >
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Query
                                    </Button>
                                </Link>
                            </section>
                        </div>

                        {/* Instance details card */}
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

                    {/* Integration section */}
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
                    </section> */}
                </div>
                <div className="flex justify-between items-center mb-6 border-t dark:border-foreground/10 pt-16">
                    <h1 className="text-3xl font-semibold">Queries</h1>
                </div>

                {queries.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No queries yet. Create your first query to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {queries.map((query) => (
                            <Link key={query.id} href={`${pathname}/${query.id}`}>
                                <Card className="h-full hover:border-primary/50 transition-colors relative group">
                                    <div className="absolute top-4 right-4 text-muted-foreground/50 group-hover:text-primary transition-colors">
                                        <ChevronRight className="w-6 h-6 transition-transform opacity-60 group-hover:translate-x-0.5 group-hover:scale-110 group-hover:opacity-100" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg pr-6">{query.name}</CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground">
                                            Query ID: {query.id.slice(0, 8)}...
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="text-sm bg-muted/50 pb-2 px-2 rounded-md overflow-hidden max-h-24">
                                            <code className="text-xs">
                                                {query.content.slice(0, 150)}
                                                {query.content.length > 150 && '...'}
                                            </code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}


                {/* Delete Instance Section */}
                <div className="border-t dark:border-foreground/10 pt-16">
                    <h2 className="text-xl font-semibold mb-8">DANGER ZONE</h2>
                    <Card className="bg-red-950/20 border-red-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-medium text-red-500">Delete this instance</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Deleting this instance is permanent and cannot be undone. Your data will be deleted within 30 days, except we may retain some metadata and logs for longer where required or permitted by law.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="bg-red-500/90 hover:bg-red-500 text-white mt-2"
                                    >
                                        Delete Instance
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DeleteInstanceDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteInstance}
                instanceName={instance?.instance_name || ''}
            />
        </>
    );
}
