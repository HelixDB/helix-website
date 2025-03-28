"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/amplify-functions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, AlertCircle, CheckCircle2, Rocket } from "lucide-react"
import { Footer } from "@/components/footer"
import api, { InstanceConfig } from "@/app/api"

const INSTANCE_TYPES = [
    {
        value: "sm",
        label: "Small (2 vCPU, 4GB RAM) - Recommended",
        vcpus: 2,
        memory: 4,
        minimumStorage: 8,
        maximumStorage: 16,
        price: 50,
        usagePrice: 0.10,
        reservedPriceId: "small-reserved",
        usagePriceId: "small-usage"
    },
    {
        value: "md",
        label: "Medium (2 vCPU, 8GB RAM)",
        vcpus: 2,
        memory: 8,
        minimumStorage: 16,
        maximumStorage: 32,
        price: 100,
        usagePrice: 0.20,
        reservedPriceId: "medium-reserved",
        usagePriceId: "medium-usage"
    },
    {
        value: "lg",
        label: "Large (4 vCPU, 16GB RAM)",
        vcpus: 4,
        memory: 16,
        minimumStorage: 16,
        maximumStorage: 32,
        price: 200,
        usagePrice: 0.50,
        reservedPriceId: "large-reserved",
        usagePriceId: "large-usage"
    },
    {
        value: "xl",
        label: "Extra large (8 vCPU, 32GB RAM)",
        vcpus: 8,
        memory: 32,
        minimumStorage: 32,
        maximumStorage: 64,
        price: 300,
        usagePrice: 1.00,
        reservedPriceId: "xlarge-reserved",
        usagePriceId: "xlarge-usage"
    },
]

const REGIONS = [
    { value: "us-east-1", label: "US East Coast", timezones: ["America/New_York", "America/Detroit", "America/Toronto", "America/Montreal"] },
    { value: "eu-west-2", label: "West Europe", timezones: ["Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Madrid"] },
]

function getDefaultRegion(): string {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Find the region that includes the user's timezone
    const matchedRegion = REGIONS.find(region =>
        region.timezones.some(timezone =>
            userTimezone.startsWith(timezone.split('/')[0])
        )
    )

    // Default to US East if no match found
    return matchedRegion?.value || "us-east-1"
}

export default function CreateInstancePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        instanceType: "sm",
        region: getDefaultRegion(),
        storage: INSTANCE_TYPES[0].minimumStorage,
        pricingType: "reserved"
    })

    const selectedType = INSTANCE_TYPES.find(type => type.value === formData.instanceType)

    // Auth check effect
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    router.push("/")
                    return
                }
                const instances = await api.getUserResources(user.userId, "")
                if (Array.isArray(instances) && instances.length > 0) {
                    router.push("/dashboard")
                    return
                }
            } catch (err) {
                console.error('Error checking auth:', err)
                router.push("/")
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router])

    // Storage bounds effect
    useEffect(() => {
        if (selectedType) {
            setFormData(prev => ({
                ...prev,
                storage: Math.max(
                    selectedType.minimumStorage,
                    Math.min(prev.storage, selectedType.maximumStorage)
                )
            }))
        }
    }, [formData.instanceType, selectedType])

    useEffect(() => {
        if (countdown !== null) {
            if (countdown === 0) {
                router.push("/dashboard")
                return
            }
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        setError(null)
        setCountdown(null)

        try {
            const user = await getCurrentUser()
            if (!user) {
                router.push("/")
                return
            }

            if (!selectedType) {
                throw new Error('Invalid instance type selected')
            }

            const instanceConfig = {
                region: formData.region,
                instanceName: formData.name,
                vcpus: selectedType.vcpus,
                memory: selectedType.memory,
                storage: Math.round(formData.storage / 2) * 2
            }

            const priceId = formData.pricingType === 'reserved'
                ? selectedType.reservedPriceId
                : selectedType.usagePriceId;

            // Create Autumn Checkout Session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userId: user.userId,
                    instanceConfig,
                }),
            });

            const { checkoutUrl, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            // Redirect to Autumn Checkout
            window.location.href = checkoutUrl;
        } catch (error: any) {
            console.error('Error creating instance:', error)
            setError(error.message || 'Failed to create instance. Please try again.')
            setCreating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (countdown !== null) {
        return (
            <div className="flex min-h-[85vh] flex-col items-center justify-center gap-6 px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                        <Rocket className="h-16 w-16 text-primary animate-bounce" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Instance Created Successfully!</h2>
                        <p className="text-muted-foreground">
                            Your HelixDB instance is being prepared. You will be redirected to the dashboard in {countdown} seconds.
                        </p>
                    </div>
                </div>
                <div className="w-full max-w-md h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${((15 - countdown) / 15) * 100}%` }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="">
            <div className="mx-auto max-w-2xl px-4 py-8 container min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Create Instance</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Instance Configuration</CardTitle>
                        <CardDescription>
                            Configure your new HelixDB instance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base">Instance Name</Label>
                                <Input
                                    id="name"
                                    placeholder="my-helix-instance"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base">Region</Label>
                                <Select
                                    value={formData.region}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONS.map((region) => (
                                            <SelectItem key={region.value} value={region.value}>
                                                {region.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base">Instance Type</Label>
                                <Select
                                    value={formData.instanceType}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, instanceType: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INSTANCE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base">Pricing Type</Label>
                                <Select
                                    value={formData.pricingType}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, pricingType: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reserved">Reserved - Monthly Billing</SelectItem>
                                        <SelectItem value="usage">Usage-Based - Pay per Hour</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedType && (
                                <>
                                    <div className="rounded-xl bg-background border p-4">
                                        <h3 className="font-medium mb-2">Instance Specifications</h3>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">vCPUs</p>
                                                <p>{selectedType.vcpus}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Memory</p>
                                                <p>{selectedType.memory} GB</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Price</p>
                                                <p className="font-medium text-primary">
                                                    ${formData.pricingType === 'reserved' ? selectedType.price : selectedType.usagePrice}
                                                    {formData.pricingType === 'reserved' ? '/month' : '/hour'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-base">Storage</Label>
                                            <span className="text-base font-medium">
                                                {Math.round(formData.storage / 2) * 2} GB
                                            </span>
                                        </div>
                                        <Slider
                                            value={[formData.storage]}
                                            min={selectedType.minimumStorage}
                                            max={selectedType.maximumStorage}
                                            step={0.1}
                                            onValueChange={(values: number[]) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    storage: values[0]
                                                }))
                                            }}
                                            aria-valuetext={`${Math.round(formData.storage / 2) * 2} GB`}
                                            aria-label="Storage"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Min: {selectedType.minimumStorage} GB</span>
                                            <span>Max: {selectedType.maximumStorage} GB</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            <Button type="submit" className="w-full" disabled={creating}>
                                {creating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Redirecting to payment...
                                    </>
                                ) : (
                                    `Subscribe - $${selectedType ? (formData.pricingType === 'reserved' ? selectedType.price + '/month' : selectedType.usagePrice + '/hour') : ''}`
                                )}
                            </Button>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-md">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>{error}</p>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}