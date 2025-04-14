"use client";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
export default function QueriesPage() {
    const pathname = usePathname();

    return (
        <div className="flex flex-row h-full">
            <aside className="w-52 border-r dark:border-foreground/10">
                <div className="border-b dark:border-foreground/10 px-6 py-4">
                    <h2 className="text-sm font-medium text-foreground">My Queries</h2>
                </div>
                <div className="border-b dark:border-foreground/10 p-6 space-y-3">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Schema</h2>
                    <Link
                        href="queries/schema"
                        className={`flex items-center text-sm transition font-medium 
                                ${pathname === "/dashboard/instances" ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'
                            }`}
                    >
                        Schema
                    </Link>
                </div>
                <div className="border-b dark:border-foreground/10 p-6 space-y-3">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Queries</h2>
                    <Link
                        href="queries/query-1"
                        className={`flex items-center text-sm transition font-medium text-foreground/50 hover:text-foreground`}
                    >
                        query-1
                    </Link>
                    <button className="flex w-full items-center text-sm transition font-medium text-foreground/50 hover:text-foreground">
                        <Plus className="w-4 h-4 mr-2" /> New Query
                    </button>
                </div>

            </aside>
            <main className="flex-1 overflow-y-auto ">
                <h1>Queries</h1>
            </main>
        </div >
    );
}
