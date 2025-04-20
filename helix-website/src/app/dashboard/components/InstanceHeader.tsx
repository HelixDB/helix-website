import { Logo } from "@/components/ui/logo";
import { HeaderActions } from "./HeaderActions";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { selectInstanceById, selectQueries } from "@/store/features/instancesSlice";
import { Button } from "@/components/ui/button";
import { ChevronRight, Slash } from "lucide-react";

export function InstanceHeader() {
    const params = useParams();
    const pathname = usePathname();
    const instanceId = params?.instanceId as string;
    const queryId = params?.queryId as string;

    const instance = useSelector((state: RootState) =>
        instanceId ? selectInstanceById(state, instanceId) : null
    );
    const queries = useSelector((state: RootState) => selectQueries(state));
    const query = queryId ? queries?.find(q => q.id === queryId) : null;

    return (
        <header className="flex items-center justify-between border-b dark:border-foreground/10">
            <div className="flex items-center">
                <Link href="/dashboard/instances" className="h-full py-2 flex items-center">
                    <span className="hidden text-foreground text-xl font-bold sm:inline-block border-r dark:border-foreground/10 w-12 justify-center px-2">
                        <Logo className="w-7 h-7 mx-auto hover:scale-110 
transition" />
                    </span>
                </Link>
                <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/instances/${instanceId}/queries`} className="flex items-center">
                        <Button variant="ghost" className="text-sm h-8 gap-4 font-medium">
                            <div className={`w-2 h-2 rounded-full ${instance?.instance_status?.toLowerCase() === 'active'
                                ? 'bg-green-500'
                                : instance?.instance_status?.toLowerCase() === 'redeploying'
                                    ? 'bg-yellow-500'
                                    : ''
                                }`} />
                            {instance?.instance_name}
                        </Button>
                    </Link>
                    {query && (
                        <>
                            <div className="w-0 rotate-[30deg] mx-1 rounded border-[1px] dark:border-foreground/10 h-5" />

                            <Button variant="ghost" className="text-sm h-8 font-medium">
                                {query?.name}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <HeaderActions />
        </header>
    );
} 