"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/amplify-functions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Plus, Loader2, HardDrive, Cpu, CircuitBoard } from "lucide-react"
import { Footer } from "@/components/footer"
import api, { InstanceDetails } from "@/app/api"

export default function DashboardPage() {
    const router = useRouter()
    const [resources, setResources] = useState<InstanceDetails[] | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        checkAuth()
        let res: string = ""
        api.getUserResources("b6d2e234-30a1-702a-963b-bb6f612bbbc8", "").then((res) => {

            setResources(res)
        })
        console.log(resources)
    }, [])

    const checkAuth = async () => {
        try {
            const user = await getCurrentUser()
            if (!user) {
                router.push("/")
            }
        } catch (err) {
            router.push("/")
        }
    }

    const formatMemory = (memory: number) => {
        if (memory >= 1024) {
            return `${(memory / 1024).toFixed(1)} GB`
        }
        return `${memory} MB`
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="">
            <div className="mx-auto max-w-6xl px-4 py-8 container min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <Button onClick={() => router.push("/create-instance")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Instance
                    </Button>
                </div>

                {resources && resources.length > 0 ? (
                    <div className="grid gap-6">
                        {resources.map((instance) => (
                            <Card key={instance.instance_id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Database className="mr-2 h-5 w-5" />
                                            Instance {instance.instance_id}
                                        </div>
                                        <span className={`text-sm px-3 py-1 rounded-full ${instance.status === 'running'
                                            ? 'bg-green-100 text-green-700'
                                            : instance.status === 'stopped'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {instance.status}
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        {instance.api_endpoint}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Cpu className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">vCPUs</p>
                                                    <p className="text-sm">{instance.vcpus}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CircuitBoard className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Memory</p>
                                                    <p className="text-sm">{formatMemory(instance.memory)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Volumes</p>
                                                    <p className="text-sm">{instance.ebs_volumes.length}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Type</p>
                                                <p className="text-sm">{instance.instance_type}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Created {new Date(instance.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <CardHeader>
                            <CardTitle>No Instances Found</CardTitle>
                            <CardDescription>
                                Get started by creating your first Helix database instance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => router.push("/create-instance")}
                                className="mt-4"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Instance
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Footer />
        </div>
    )
} 