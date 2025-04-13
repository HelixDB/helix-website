"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/amplify-functions";
import { AuthUser } from "aws-amplify/auth";

export function AuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const user = await getCurrentUser();
            if (!user) {
                router.push("/");
                return;
            }
            setUser(user);
        }
        getUser();
    }, [router]);

    if (!user) {
        return null;
    }

    return <>{children}</>;
} 