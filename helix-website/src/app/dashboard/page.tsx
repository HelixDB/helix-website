"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/amplify-functions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Plus } from "lucide-react"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
    const router = useRouter()

    useEffect(() => {
        checkAuth()
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

    return (
        <div className=" ">
            <div className="mx-auto max-w-6xl px-4 py-8 container min-h-screen">

                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Add your dashboard content here */}
                    <div className="p-6 bg-card rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
                        <p className="text-muted-foreground">
                            This is your dashboard. You can start managing your HelixDB queries here.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
} 