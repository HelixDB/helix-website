"use client";
import { use } from "react";
import { InstanceProvider } from "./instance-context";
import { InstanceHeader } from "../../components/InstanceHeader";

export default function InstanceLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ instanceId: string }>;
}) {
    const resolvedParams = use(params);

    return (
        <InstanceProvider instanceId={resolvedParams.instanceId}>
            <div className="flex flex-col h-screen overflow-hidden">
                <InstanceHeader />
                <div className="flex flex-1 overflow-hidden">
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </InstanceProvider>
    );
}
