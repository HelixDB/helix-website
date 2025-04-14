"use client";
import { useParams } from "next/navigation";
import { Header } from "@/app/dashboard/components/InstanceHeader";
import { InstanceSidebar } from "@/app/dashboard/components/sidebars/InstanceSidebar";

export default function InstanceLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const instanceId = params.instanceId as string;

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <InstanceSidebar instanceId={instanceId} />
                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div >
        </div >
    );
}
