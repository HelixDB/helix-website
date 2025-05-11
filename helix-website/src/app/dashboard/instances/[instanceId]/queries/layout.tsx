"use client";
import { usePathname } from "next/navigation";
import { Plus, Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
    fetchQueries,
    selectQueries,
    selectQueriesStatus,
    clearQueries,
} from "@/store/features/instancesSlice";
import { getCurrentUser } from "@/lib/amplify-functions";
import { useInstanceData } from "../instance-context";

export default function QueriesLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ instanceId: string }>;
}) {
    const pathname = usePathname();
    const resolvedParams = use(params);
    const dispatch = useDispatch<AppDispatch>();
    const { instance } = useInstanceData();

    const queries = useSelector(selectQueries);
    const status = useSelector(selectQueriesStatus);

    useEffect(() => {
        async function fetchData() {
            const user = await getCurrentUser();
            if (user && resolvedParams.instanceId) {
                dispatch(fetchQueries({ userId: user.userId, instanceId: resolvedParams.instanceId }));
            }
        }
        fetchData();

        // Clear queries when unmounting or when instance changes
        return () => {
            dispatch(clearQueries());
        };
    }, [dispatch, resolvedParams.instanceId]);

    // Get the base path without any query ID
    const basePath = pathname.split('/queries')[0] + '/queries';

    return (
        <div className="flex flex-row h-full">
            <aside className="w-64 border-r dark:border-foreground/10">
                <div className="border-b dark:border-foreground/10 px-6 py-6">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Instance</h2>
                    <Link
                        href={`${basePath}`}
                        className={`flex items-center text-sm transition font-medium capitalize
                            ${pathname.endsWith("queries")
                                ? 'text-foreground'
                                : 'text-foreground/75 hover:text-foreground'}`}
                        onClick={(e) => {
                            if (pathname === basePath) {
                                e.preventDefault();
                            }
                        }}
                    >{instance?.instance_name} Instance</Link>
                </div>
                {/* <div className="border-b dark:border-foreground/10 p-6 space-y-3">
                    <h2 className="text-sm font-medium text-foreground/75 mb-2">Schema</h2>
                    <Link
                        href={`${basePath}/schema`}
                        className={`flex items-center text-sm transition font-medium 
                            ${pathname.endsWith('/schema') ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'}`}
                    >
                        Schema
                    </Link>
                </div> */}
                <div className="p-6 space-y-3 border-b dark:border-foreground/10">
                    <h2 className="text-sm font-medium text-foreground/50 mb-2">Queries</h2>
                    {status === 'loading' ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                    ) : status === 'failed' ? (
                        <div className="text-sm text-destructive">
                            Failed to load queries
                        </div>
                    ) : (
                        <>
                            {queries?.map((query) => (
                                <Link
                                    key={query.id}
                                    href={`${basePath}/${query.id}`}
                                    className={`flex items-center text-sm transition font-medium 
                                        ${pathname.endsWith(query.id)
                                            ? 'text-foreground'
                                            : 'text-foreground/75 hover:text-foreground'}`}
                                    onClick={(e) => {
                                        if (pathname.endsWith(query.id)) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    {query.name}
                                </Link>
                            ))}
                            <Link
                                href={`${basePath}/new`}
                                className={`flex w-full items-center text-sm transition font-medium hover:text-foreground ${pathname.endsWith("/new")
                                    ? 'text-foreground'
                                    : 'text-foreground/75 hover:text-foreground'}`}
                                onClick={(e) => {
                                    if (pathname.endsWith("/new")) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" /> New Query
                            </Link>
                        </>
                    )}
                </div>
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
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
