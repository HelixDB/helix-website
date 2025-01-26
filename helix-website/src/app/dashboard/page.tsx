import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Plus } from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Instance
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Database className="mr-2 h-5 w-5" />
                            Database Instance
                        </CardTitle>
                        <CardDescription>
                            Manage your Helix database instance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <p className="text-sm">Active</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Region</p>
                                    <p className="text-sm">eu-west-2</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                                    <p className="text-sm">March 12, 2024</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Size</p>
                                    <p className="text-sm">Standard</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 