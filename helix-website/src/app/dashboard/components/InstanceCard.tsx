import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { InstanceDetails } from "@/app/api";
import { useRouter } from "next/navigation";

interface InstanceCardProps {
    instance: InstanceDetails;
}

export function InstanceCard({ instance }: InstanceCardProps) {
    const router = useRouter();

    return (
        <Card
            className="p-4 rounded-lg transition group cursor-pointer hover:border-foreground/20 hover:bg-transparent"
            onClick={() => (instance.instance_status?.toLowerCase() === "active" || instance.instance_status?.toLowerCase() === "redeploying") &&
                router.push(`/dashboard/instances/${instance.instance_id}/queries`)}
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-4">
                    <h3 className="font-medium">{instance.instance_name}</h3>
                    <p className="text-sm text-gray-400">{instance.instance_region}</p>
                </div>
                <div className="flex flex-col items-end space-y-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${instance.instance_status?.toLowerCase() === "active"
                        ? "bg-green-500/20 text-green-400"
                        : instance.instance_status?.toLowerCase() === "stopped"
                            ? "bg-red-500/20 text-red-600"
                            : "bg-yellow-500/20 text-yellow-600"
                        }`}>
                        {instance.instance_status?.charAt(0).toUpperCase() +
                            instance.instance_status?.slice(1)}
                    </span>
                    {(instance.instance_status?.toLowerCase() === "active" || instance.instance_status?.toLowerCase() === "redeploying") && (
                        <ChevronRight className="w-6 h-6 transition-transform opacity-60 group-hover:translate-x-0.5 group-hover:scale-110 group-hover:opacity-100" />
                    )}
                </div>
            </div>
        </Card>
    );
}

export function SkeletonCard() {
    return (
        <Card className="p-4 rounded-lg animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-4">
                    <div className="h-4 w-32 bg-foreground/10 rounded"></div>
                    <div className="h-3 w-24 bg-foreground/10 rounded"></div>
                </div>
                <div className="flex flex-col items-end space-y-4">
                    <div className="h-6 w-16 bg-foreground/10 rounded-full"></div>
                    <div className="h-6 w-6 bg-foreground/10 rounded"></div>
                </div>
            </div>
        </Card>
    );
} 