"use client"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { getCurrentUser } from "@/lib/amplify-functions"

function PaymentVerification() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState<number>(5)

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const paymentId = searchParams.get('payment_id')
                if (!paymentId) {
                    throw new Error('No payment ID found')
                }

                const user = await getCurrentUser()
                if (!user) {
                    router.push('/')
                    return
                }

                // Payment is already verified by Autumn, just start the countdown
                setStatus('success')

                // Start countdown to redirect
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            router.push('/dashboard')
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)

                return () => clearInterval(timer)
            } catch (err: any) {
                console.error('Error verifying payment:', err)
                setError(err.message || 'Failed to verify payment')
                setStatus('error')
            }
        }

        if (typeof window !== 'undefined') {
            verifyPayment()
        }
    }, [searchParams])

    return (
        <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-lg font-medium">Verifying your payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <div>
                            <h2 className="text-2xl font-bold text-green-500">Payment Successful!</h2>
                            <p className="text-muted-foreground mt-2">
                                Your instance is being created. You will be redirected to the dashboard in {countdown} seconds.
                            </p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <div>
                            <h2 className="text-2xl font-bold text-red-500">Payment Verification Failed</h2>
                            <p className="text-muted-foreground mt-2">{error}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function LoadingCard() {
    return (
        <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-lg font-medium">Loading...</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Suspense fallback={<LoadingCard />}>
                <PaymentVerification />
            </Suspense>
        </div>
    )
} 