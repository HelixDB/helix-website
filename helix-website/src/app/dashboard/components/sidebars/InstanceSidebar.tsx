import { Home, Terminal, Settings, Feather, File } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface InstanceSidebarProps {
    instanceId: string;
}

export function InstanceSidebar({ instanceId }: InstanceSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-12 border-r border-foreground/10">
            <nav className="flex flex-col items-center py-2 space-y-2">
                <Link
                    href={`/dashboard/instances/${instanceId}`}
                    className={`p-2 ${pathname === `/dashboard/instances/${instanceId}` ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                >
                    <Home className="w-5 h-5" />
                </Link>
                <Link
                    href={`/dashboard/instances/${instanceId}/queries`}
                    className={`px-2 pt-2 pb-4 border-b dark:border-foreground/10 ${pathname.includes(`/dashboard/instances/${instanceId}/queries`) ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                >
                    <Feather className="w-5 h-5" />
                </Link>
                <Link
                    href={`https://docs.helix-db.com`}
                    className={`p-2 text-foreground/60 hover:text-foreground }`}
                >
                    <File className="w-5 h-5" />
                </Link>
                {/* <Link
                    href={`/dashboard/instances/${instanceId}/settings`}
                    className={`p-2 ${pathname === `/dashboard/instances/${instanceId}/settings` ? 'text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                >
                    <Settings className="w-5 h-5" />
                </Link> */}

            </nav>
        </aside>
    );
} 