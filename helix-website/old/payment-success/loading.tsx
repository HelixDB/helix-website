import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function PaymentSuccessLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-lg font-medium">Loading payment details...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 