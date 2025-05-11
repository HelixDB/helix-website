"use client";
import { AuthWrapper } from "./components/auth-wrapper";
import { Footer } from "@/components/footer";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchInstances } from "@/store/features/instancesSlice";
import { getCurrentUser } from "@/lib/amplify-functions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadInstances = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch(fetchInstances(user.userId));
        }
      } catch (error) {
        console.error('Failed to fetch instances:', error);
      }
    };

    loadInstances();
  }, [dispatch]);

  return (
    <AuthWrapper>
      <main className="min-h-screen dark:bg-[#171717]">{children}</main>
    </AuthWrapper>
  );
}
