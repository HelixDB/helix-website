import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r dark:border-foreground/10">
            <nav className="">
                <div className="border-b dark:border-foreground/10 p-6">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Instances</h2>
                    <div className="space-y-1">
                        <Link
                            href="/dashboard/instances"
                            className={`flex items-center text-sm transition font-medium ${pathname === "/dashboard/instances" ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'
                                }`}
                        >
                            All Instances
                        </Link>
                    </div>
                </div>
                {/* <div className="border-b dark:border-foreground/10 p-6">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Account</h2>
                    <div className="space-y-1">
                        <Link
                            href="/dashboard"
                            className={`flex items-center text-sm transition font-medium ${pathname === "/dashboard" ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'
                                }`}
                        >
                            Preferences
                        </Link>
                    </div>
                </div> */}
                <div className="p-6">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Guides</h2>
                    <div className="space-y-1">
                        <Link
                            href="https://docs.helix-db.com"
                            className="flex items-center text-sm text-foreground/75 hover:text-foreground transition font-medium"
                        >
                            <ArrowUpRight className="w-4 h-4 mr-2" /> Documentation
                        </Link>
                    </div>
                </div>
            </nav>
        </aside>
    );
} 