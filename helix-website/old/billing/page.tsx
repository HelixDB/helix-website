"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CreditCard,
    Clock,
    Package,
    CheckCircle,
    AlertCircle,
    ChevronRight,
} from "lucide-react";

interface PaymentMethod {
    id: string;
    type: "card";
    last4: string;
    expMonth: number;
    expYear: number;
    brand: string;
}

interface PaymentHistory {
    id: string;
    date: string;
    amount: number;
    status: "succeeded" | "failed" | "pending";
    description: string;
}

// Mock data - replace with actual API calls
const mockPaymentMethod: PaymentMethod = {
    id: "pm_123",
    type: "card",
    last4: "4242",
    expMonth: 12,
    expYear: 2024,
    brand: "Visa",
};

const mockPaymentHistory: PaymentHistory[] = [
    {
        id: "pi_1",
        date: "2024-01-15",
        amount: 49.99,
        status: "succeeded",
        description: "Pro Plan - Monthly",
    },
    {
        id: "pi_2",
        date: "2023-12-15",
        amount: 49.99,
        status: "succeeded",
        description: "Pro Plan - Monthly",
    },
    {
        id: "pi_3",
        date: "2023-11-15",
        amount: 49.99,
        status: "failed",
        description: "Pro Plan - Monthly",
    },
];

export default function BillingPage() {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(mockPaymentMethod);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Billing</h1>
                <Button>Update Payment Method</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Current Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Current Plan
                        </CardTitle>
                        <CardDescription>Your subscription plan details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold">Pro Plan</h3>
                                <p className="text-muted-foreground">$49.99/month</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-500">
                                <CheckCircle className="h-4 w-4" />
                                Active
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Next billing date: February 15, 2024
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            Change Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Method
                        </CardTitle>
                        <CardDescription>Your current payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white font-bold">
                                    {paymentMethod.brand}
                                </div>
                                <div>
                                    <div className="font-medium">
                                        •••• •••• •••• {paymentMethod.last4}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            Update Card
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Payment History
                    </CardTitle>
                    <CardDescription>Your recent payments and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {paymentHistory.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between py-4 border-b last:border-0"
                            >
                                <div className="flex items-center gap-4">
                                    {payment.status === "succeeded" ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : payment.status === "failed" ? (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-yellow-500" />
                                    )}
                                    <div>
                                        <div className="font-medium">{payment.description}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(payment.date)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-medium">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                        <div className="text-sm text-muted-foreground capitalize">
                                            {payment.status}
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        View All Invoices
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
