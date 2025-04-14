"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/amplify-functions";
import { AuthUser } from "aws-amplify/auth";

interface AuthContextType {
    user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

interface AuthWrapperProps {
    children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
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

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
} 