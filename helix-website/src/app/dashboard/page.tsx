"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/amplify-functions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Plus,
  Loader2,
  HardDrive,
  Cpu,
  CircuitBoard,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { Footer } from "@/components/footer";
import api, { InstanceDetails } from "@/app/api";
import { DeleteInstanceDialog } from "@/components/ui/delete-instance-dialog";
import { AuthUser } from "aws-amplify/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [resources, setResources] = useState<InstanceDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [instanceToDelete, setInstanceToDelete] = useState<InstanceDetails | null>(null);

  const handleCopyEndpoint = async (endpoint: string) => {
    await navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/");
          return;
        }
        setUser(user);
        const instances = await api.getUserResources(user.userId, "");
        console.log("Fetched instances:", instances);
        const instancesArray = Array.isArray(instances) ? instances : [instances];
        setResources(instancesArray);

        const hasInitializingInstances = instancesArray.some(
          (instance) => instance.instance_status?.toLowerCase() !== "active"
        );

        if (!hasInitializingInstances && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        router.push("/");
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    intervalId = setInterval(fetchData, 20000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [router, instanceToDelete]);

  const handleDeleteInstance = async () => {
    if (!instanceToDelete) return;

    try {
      if (!user) return;
      await api.deleteInstance(user.userId, instanceToDelete.cluster_id, instanceToDelete.instance_region, instanceToDelete.instance_id);

      // Update the resources list after successful deletion
      if (resources) {
        setResources(resources.filter(
          instance => instance.cluster_id !== instanceToDelete.cluster_id
        ));
      }
      setInstanceToDelete(null);
    } catch (error) {
      console.error('Error deleting instance:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasInstances = Array.isArray(resources) && resources.length > 0;

  return (
    <div className="">
      <div className="mx-auto max-w-6xl px-4 py-8 container min-h-screen">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>

        {hasInstances ? (
          <div className="grid gap-6">
            {resources.map((instance, index) => {
              console.log("Instance:", instance);
              return (
                <Card key={index} className="bg-muted/50 rounded-2xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <div className="flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        {instance.instance_name}
                      </div>
                      <div className="flex items-center flex-row">
                        {instance.instance_status?.toLowerCase() === "initializing" && (
                          <span className="text-sm font-medium text-muted-foreground px-3 py-1">
                            Normally this takes 4-5 minutes
                          </span>
                        )}
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${instance.instance_status?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-700"
                            : instance.instance_status?.toLowerCase() === "stopped"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {instance.instance_status?.charAt(0).toUpperCase() +
                            instance.instance_status?.slice(1)}
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription className="pt-2 flex items-center gap-2 text-sm">
                      {instance.api_endpoint && (
                        <>
                          <span className="text-muted-foreground font-medium">Endpoint:</span>
                          <code className="px-2 py-0.5 rounded text-muted-foreground bg-muted font-mono text-xs">
                            {instance.api_endpoint}
                          </code>
                          <button
                            onClick={() => handleCopyEndpoint(instance.api_endpoint)}
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

                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Type
                          </p>
                          <p className="capitalize text-sm">
                            {instance.instance_size}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground mt-auto">
                          <span className="font-medium">Created:</span> {new Date(instance.created_at).toLocaleDateString()}
                        </div>
                        <div className="space-x-4 flex flex-row">
                          {instance.instance_status?.toLowerCase() === "active" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setInstanceToDelete(instance)}
                                className="h-10 w-10"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              <Button
                                onClick={() => router.push(`/instances/${instance.instance_id}/queries`)}
                                className="flex items-center gap-2 rounded-xl"
                              >
                                View Queries
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="text-center bg-muted/50 py-12 border-0 rounded-2xl">
            <CardHeader>
              <CardTitle>No Instances Found</CardTitle>
              <CardDescription>
                If you've just created an instance, wait a few seconds and refresh the page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/create-instance")}
                className="mt-4 rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Instance
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <DeleteInstanceDialog
        isOpen={instanceToDelete !== null}
        onClose={() => setInstanceToDelete(null)}
        onConfirm={handleDeleteInstance}
        instanceName={instanceToDelete?.instance_name || ""}
      />
    </div>
  );
}