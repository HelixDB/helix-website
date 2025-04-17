import { Metadata } from "next";
import { AuthWrapper } from "./components/auth-wrapper";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "HelixDB | Dashboard",
  description: "Deploy and manage your HelixDB instances",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <main className="min-h-screen dark:bg-[#171717]">{children}</main>
    </AuthWrapper>
  );
}
